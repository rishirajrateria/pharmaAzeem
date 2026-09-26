import type { Metadata } from 'next'

import { FaqAccordion } from '@/components/FaqAccordion'
import { RichText } from '@/components/RichText'
import { Stats } from '@/components/Stats'
import { CertificationStrip } from '@/components/quality/CertificationStrip'
import { ContentSections } from '@/components/quality/ContentSections'
import { CtaBand } from '@/components/quality/CtaBand'
import { PageHero, type HeroChip } from '@/components/quality/PageHero'
import { ProcessStepper } from '@/components/quality/ProcessStepper'
import { QualityPillars } from '@/components/quality/QualityPillars'
import { StandardsList } from '@/components/quality/StandardsList'
import { JsonLd } from '@/components/seo/JsonLd'
import { Container, Eyebrow, Section, SectionHeading } from '@/components/ui'
import { getCertifications, getPageGlobal, getSiteSettings } from '@/lib/data'
import { buildMetadata, graph, webPageJsonLd } from '@/lib/seo'
import { mediaUrl, richTextToPlain, truncate } from '@/lib/utils'

export const revalidate = 3600

const PATH = '/quality'
const CHIP_ICONS = ['shield-check', 'flask-conical', 'microscope']

export async function generateMetadata(): Promise<Metadata> {
  const [settings, doc] = await Promise.all([getSiteSettings(), getPageGlobal('quality-page')])
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

export default async function QualityPage() {
  const [doc, certifications] = await Promise.all([getPageGlobal('quality-page'), getCertifications()])
  const featured = certifications.filter((c) => c.featured)
  const strip = (featured.length >= 3 ? featured : certifications).slice(0, 5)
  const description = doc.meta?.description || doc.hero.subtitle || truncate(richTextToPlain(doc.intro), 300)
  const chips: HeroChip[] = (doc.stats || []).slice(0, 2).map((s, i) => ({ icon: CHIP_ICONS[i], label: s.label, value: `${s.value}${s.suffix || ''}` }))

  return (
    <>
      <JsonLd
        data={graph(
          webPageJsonLd({
            path: PATH,
            name: doc.meta?.title || doc.hero.title,
            description,
            type: 'WebPage',
            image: mediaUrl(doc.hero.image, 'large'),
            dateModified: doc.updatedAt,
            datePublished: doc.createdAt,
          }),
        )}
      />

      <PageHero
        crumbs={[{ name: 'Quality', path: PATH }]}
        eyebrow={doc.hero.eyebrow || 'Quality assurance'}
        title={doc.hero.title}
        subtitle={doc.hero.subtitle}
        image={doc.hero.image}
        primaryCta={doc.hero.primaryCta}
        secondaryCta={doc.hero.secondaryCta}
        fallbackPrimary={{ label: 'Request quality documentation', url: '/contact' }}
        fallbackSecondary={{ label: 'View licenses & certificates', url: '/licenses' }}
        chips={chips}
      />

      {(doc.intro || doc.stats?.length) && (
        <Section className="!pt-0" aria-labelledby="quality-overview-title">
          <Container>
            {doc.intro && (
              <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
                <div className="lg:col-span-4">
                  <Eyebrow className="mb-4">Overview</Eyebrow>
                  <h2 id="quality-overview-title" className="heading-2">
                    An independent quality organisation
                  </h2>
                </div>
                <div className="lg:col-span-8">
                  <RichText data={doc.intro} className="[&_p]:text-base [&_p]:leading-relaxed sm:[&_p]:text-lg" />
                </div>
              </div>
            )}
            {!doc.intro && (
              <h2 id="quality-overview-title" className="sr-only">
                Quality at a glance
              </h2>
            )}
            <Stats stats={doc.stats} className={doc.intro ? 'mt-12' : undefined} />
          </Container>
        </Section>
      )}

      <QualityPillars pillars={doc.pillars} />
      <ProcessStepper steps={doc.process} />
      <StandardsList standards={doc.standards} />
      <CertificationStrip certifications={strip} />
      <ContentSections sections={doc.sections} />

      {doc.faqs?.length ? (
        <Section aria-labelledby="quality-faq-title" className="!pt-0">
          <Container>
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <SectionHeading
                  eyebrow="FAQ"
                  title={<span id="quality-faq-title">Quality questions, answered</span>}
                  description="Common questions from distributors, regulators and procurement teams about our quality system and documentation."
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
        id="quality-cta"
        eyebrow="Documentation"
        title="Request our quality documentation"
        description="Certificates of Analysis, stability summaries, GMP certificates, site master file and product dossiers – prepared for your regulatory submission and shared within one business day."
        primary={{ label: 'Request quality documentation', href: '/contact' }}
        secondary={{ label: 'Browse products', href: '/products' }}
      />
    </>
  )
}
