import type { Metadata } from 'next'

import { FaqAccordion } from '@/components/FaqAccordion'
import { RichText } from '@/components/RichText'
import { CertificateGallery, GroupJumpNav } from '@/components/quality/CertificateGallery'
import { ContentSections } from '@/components/quality/ContentSections'
import { CtaBand } from '@/components/quality/CtaBand'
import { PageHero, type HeroChip } from '@/components/quality/PageHero'
import { VerifyNote } from '@/components/quality/VerifyNote'
import { certAnchor, certStatus, groupCertifications } from '@/components/quality/certifications'
import { JsonLd } from '@/components/seo/JsonLd'
import { Container, Eyebrow, Section, SectionHeading } from '@/components/ui'
import { getCertifications, getPageGlobal, getSiteSettings } from '@/lib/data'
import { buildMetadata, graph, itemListJsonLd, webPageJsonLd } from '@/lib/seo'
import { formatDate, mediaUrl, richTextToPlain, truncate } from '@/lib/utils'

export const revalidate = 3600

const PATH = '/licenses'

export async function generateMetadata(): Promise<Metadata> {
  const [settings, doc] = await Promise.all([getSiteSettings(), getPageGlobal('licenses-page')])
  return buildMetadata({
    settings,
    path: PATH,
    title: doc.hero.title,
    description: doc.hero.subtitle || truncate(richTextToPlain(doc.intro), 160),
    image: doc.hero.image,
    meta: doc.meta,
    modifiedTime: doc.updatedAt,
  })
}

export default async function LicensesPage() {
  const [doc, certifications] = await Promise.all([
    getPageGlobal('licenses-page'),
    getCertifications(),
  ])
  const groups = groupCertifications(certifications)
  const validCount = certifications.filter((c) => certStatus(c) === 'valid').length
  const issuerCount = new Set(certifications.map((c) => c.issuer.trim().toLowerCase())).size
  const lastUpdated = certifications.reduce<string | null>(
    (latest, c) => (!latest || c.updatedAt > latest ? c.updatedAt : latest),
    null,
  )
  const description =
    doc.meta?.description || doc.hero.subtitle || truncate(richTextToPlain(doc.intro), 300)
  /** Summary shown directly under the h1 – falls back to the intro so the page always has one. */
  const summary =
    doc.hero.subtitle || truncate(richTextToPlain(doc.intro), 200) || doc.meta?.description || null
  const chips: HeroChip[] = certifications.length
    ? [
        { icon: 'badge-check', label: 'Valid documents', value: String(validCount) },
        { icon: 'landmark', label: 'Issuing bodies', value: String(issuerCount) },
      ]
    : []

  const glance = [
    { label: 'Documents listed', value: String(certifications.length) },
    { label: 'Currently valid', value: String(validCount) },
    { label: 'Issuing authorities', value: String(issuerCount) },
    { label: 'Categories', value: String(groups.length) },
  ]

  return (
    <>
      <JsonLd
        data={graph(
          webPageJsonLd({
            path: PATH,
            name: doc.meta?.title || doc.hero.title,
            description,
            type: 'CollectionPage',
            image: mediaUrl(doc.hero.image, 'large'),
            dateModified: lastUpdated || doc.updatedAt,
            datePublished: doc.createdAt,
          }),
          certifications.length
            ? itemListJsonLd(
                certifications.map((c) => ({
                  name: `${c.title} – ${c.issuer}`,
                  path: `${PATH}#${certAnchor(c)}`,
                  image: mediaUrl(c.image, 'card'),
                })),
                'Licenses, certifications and accreditations',
              )
            : null,
        )}
      />

      <PageHero
        crumbs={[{ name: 'Licenses & certifications', path: PATH }]}
        eyebrow={doc.hero.eyebrow || 'Compliance'}
        title={doc.hero.title}
        subtitle={summary}
        image={doc.hero.image}
        primaryCta={doc.hero.primaryCta}
        secondaryCta={doc.hero.secondaryCta}
        fallbackPrimary={{ label: 'Request certificate copies', url: '/contact' }}
        fallbackSecondary={{ label: 'Our quality system', url: '/quality' }}
        chips={chips}
      />

      <Section aria-labelledby="licenses-overview-title">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <Eyebrow className="mb-4">Overview</Eyebrow>
              <h2 id="licenses-overview-title" className="heading-2">
                The approvals behind our products
              </h2>
              {doc.intro ? (
                <RichText
                  data={doc.intro}
                  className="mt-5 [&_p]:text-base [&_p]:leading-relaxed sm:[&_p]:text-lg"
                />
              ) : (
                <p className="mt-5 lead">
                  The licences, certificates and registrations that authorise our manufacturing and
                  support product registration in partner markets.
                </p>
              )}
              <GroupJumpNav groups={groups} className="mt-8" />
            </div>
            <div className="lg:col-span-5">
              <div className="relative overflow-hidden glass-strong glass-edge p-6 sm:p-8">
                <p className="eyebrow">At a glance</p>
                <dl className="mt-5 grid grid-cols-2 gap-5">
                  {glance.map((g) => (
                    <div key={g.label} className="flex flex-col-reverse">
                      <dt className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-ink-500">
                        {g.label}
                      </dt>
                      <dd className="text-3xl font-semibold tracking-tight text-gradient">
                        {g.value}
                      </dd>
                    </div>
                  ))}
                </dl>
                {lastUpdated && (
                  <p className="mt-6 border-t border-ink-100 pt-4 text-xs text-ink-500">
                    Register last updated{' '}
                    <time dateTime={lastUpdated}>
                      {formatDate(lastUpdated, { day: 'numeric', month: 'long', year: 'numeric' })}
                    </time>
                  </p>
                )}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <CertificateGallery groups={groups} />
      <ContentSections sections={doc.sections} />
      <VerifyNote certifications={certifications} />

      {doc.faqs?.length ? (
        <Section aria-labelledby="licenses-faq-title" className="!pt-0">
          <Container>
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <SectionHeading
                  eyebrow="FAQ"
                  title={<span id="licenses-faq-title">Certificate questions, answered</span>}
                  description="What partners and regulators most often ask about our licences, certificates and registration documents."
                />
              </div>
              <div className="lg:col-span-8">
                <FaqAccordion faqs={doc.faqs} />
              </div>
            </div>
          </Container>
        </Section>
      ) : null}

      <CtaBand
        id="licenses-cta"
        eyebrow="Registration support"
        title="Need certificate copies for a registration dossier?"
        description="Tell us the products and destination country, and we will prepare the certificate copies and supporting documents your submission requires."
        primary={{ label: 'Request certificate copies', href: '/contact' }}
        secondary={{ label: 'See our quality system', href: '/quality' }}
      />
    </>
  )
}
