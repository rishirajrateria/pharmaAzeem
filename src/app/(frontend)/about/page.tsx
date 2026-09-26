import type { Metadata } from 'next'

import { AboutCta } from '@/components/about/AboutCta'
import { AboutHero } from '@/components/about/AboutHero'
import { ContentSections } from '@/components/about/ContentSections'
import { CoreValues } from '@/components/about/CoreValues'
import { FacilitiesStrip } from '@/components/about/FacilitiesStrip'
import { IntroPanel, type KeyFact } from '@/components/about/IntroPanel'
import { Leadership } from '@/components/about/Leadership'
import { MissionVision } from '@/components/about/MissionVision'
import { Timeline } from '@/components/about/Timeline'
import { TrustRow } from '@/components/about/TrustRow'
import { leadershipJsonLd, organizationRef } from '@/components/about/jsonld'
import { FaqAccordion } from '@/components/FaqAccordion'
import { JsonLd } from '@/components/seo/JsonLd'
import { Stats } from '@/components/Stats'
import { Container, Section, SectionHeading } from '@/components/ui'
import { getCertifications, getFacilities, getPageGlobal, getSiteSettings } from '@/lib/data'
import { buildMetadata, graph, webPageJsonLd } from '@/lib/seo'
import { mediaUrl, richTextToPlain, truncate } from '@/lib/utils'

export const revalidate = 3600

const PATH = '/about'

const getData = () =>
  Promise.all([getPageGlobal('about-page'), getSiteSettings(), getCertifications({ featured: true }), getFacilities()])

export async function generateMetadata(): Promise<Metadata> {
  const [doc, settings] = await Promise.all([getPageGlobal('about-page'), getSiteSettings()])
  return buildMetadata({
    settings,
    path: PATH,
    title: doc.hero?.title || `About ${settings.siteName}`,
    description: doc.hero?.subtitle || truncate(richTextToPlain(doc.intro), 160),
    image: doc.hero?.image,
    meta: doc.meta,
    modifiedTime: doc.updatedAt,
  })
}

export default async function AboutPage() {
  const [doc, settings, certifications, facilities] = await getData()
  const description = doc.hero?.subtitle || truncate(richTextToPlain(doc.intro), 300)
  const addr = settings.contact?.address
  const gmp = certifications.find((c) => /gmp/i.test(c.title)) || certifications[0]

  const facts: KeyFact[] = [
    settings.legalName ? { label: 'Legal name', value: settings.legalName } : null,
    settings.foundingYear ? { label: 'Founded', value: String(settings.foundingYear) } : null,
    addr?.city ? { label: 'Headquarters', value: [addr.city, addr.state, addr.country].filter(Boolean).join(', ') } : null,
    settings.employeeCount ? { label: 'Team', value: `${settings.employeeCount} people` } : null,
    facilities.length ? { label: 'Facilities', value: `${facilities.length} (${[...new Set(facilities.map((f) => f.city).filter(Boolean))].join(', ')})` } : null,
    certifications.length
      ? { label: 'Certified', value: certifications.slice(0, 3).map((c) => c.title).join(' · ') + (certifications.length > 3 ? ` +${certifications.length - 3}` : '') }
      : null,
  ].filter((f): f is KeyFact => f !== null)

  const jsonLd = graph(
    {
      ...webPageJsonLd({
        path: PATH,
        name: doc.meta?.title || doc.hero?.title || `About ${settings.siteName}`,
        description,
        type: 'AboutPage',
        image: mediaUrl(doc.hero?.image, 'large'),
        dateModified: doc.updatedAt,
        datePublished: doc.createdAt,
      }),
      mainEntity: organizationRef(),
    },
    ...leadershipJsonLd(doc.leadership),
  )

  return (
    <>
      <JsonLd data={jsonLd} />

      <AboutHero hero={doc.hero} settings={settings} facilityCount={facilities.length} certification={gmp?.title} />

      <IntroPanel intro={doc.intro} foundingYear={settings.foundingYear} facts={facts} />

      {doc.stats?.length ? (
        <Section className="!pt-0" aria-label="Company at a glance">
          <Container>
            <Stats stats={doc.stats} />
          </Container>
        </Section>
      ) : null}

      <MissionVision mission={doc.mission} />

      <CoreValues values={doc.values} />

      <Timeline milestones={doc.milestones} siteName={settings.siteName} />

      <Leadership leadership={doc.leadership} />

      <ContentSections sections={doc.sections} />

      <FacilitiesStrip facilities={facilities} />

      <TrustRow certifications={certifications} />

      {doc.faqs?.length ? (
        <Section className="!pt-0" aria-labelledby="about-faq">
          <Container>
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <SectionHeading
                  eyebrow="FAQ"
                  title={<span id="about-faq">Frequently asked questions</span>}
                  description="Quick answers about who we are, where we operate and how we work with partners."
                />
              </div>
              <div className="lg:col-span-8">
                <FaqAccordion faqs={doc.faqs} />
              </div>
            </div>
          </Container>
        </Section>
      ) : null}

      <AboutCta settings={settings} />
    </>
  )
}
