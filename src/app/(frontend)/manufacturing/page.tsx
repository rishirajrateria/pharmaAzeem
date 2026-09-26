import type { Metadata } from 'next'

import { FaqAccordion } from '@/components/FaqAccordion'
import { CapabilitiesGrid } from '@/components/manufacturing/CapabilitiesGrid'
import { ContentSections } from '@/components/manufacturing/ContentSections'
import { ContractManufacturing } from '@/components/manufacturing/ContractManufacturing'
import { CtaBand } from '@/components/manufacturing/CtaBand'
import { FacilitiesSection } from '@/components/manufacturing/FacilitiesSection'
import { ManufacturingHero, type HeroChip } from '@/components/manufacturing/ManufacturingHero'
import { OverviewSection } from '@/components/manufacturing/OverviewSection'
import { ProcessStepper } from '@/components/manufacturing/ProcessStepper'
import { facilityAnchor, facilityImages } from '@/components/manufacturing/facilities'
import { JsonLd } from '@/components/seo/JsonLd'
import { Container, Section, SectionHeading } from '@/components/ui'
import { getCertifications, getFacilities, getPageGlobal, getSiteSettings } from '@/lib/data'
import { buildMetadata, graph, itemListJsonLd, webPageJsonLd } from '@/lib/seo'
import { mediaUrl, richTextToPlain, truncate } from '@/lib/utils'

export const revalidate = 3600

const PATH = '/manufacturing'

export async function generateMetadata(): Promise<Metadata> {
  const [settings, doc] = await Promise.all([getSiteSettings(), getPageGlobal('manufacturing-page')])
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

export default async function ManufacturingPage() {
  const [doc, facilities, certifications] = await Promise.all([getPageGlobal('manufacturing-page'), getFacilities(), getCertifications({ featured: true })])

  const description = doc.meta?.description || doc.hero.subtitle || truncate(richTextToPlain(doc.intro), 300)
  const lastUpdated = facilities.reduce<string>((latest, f) => (f.updatedAt > latest ? f.updatedAt : latest), doc.updatedAt || '') || null
  const gmp = certifications.find((c) => /gmp/i.test(c.title))
  const firstStat = doc.stats?.[0]

  const chips: HeroChip[] = [
    facilities.length ? { icon: 'factory', label: 'Sites', value: `${facilities.length} ${facilities.length === 1 ? 'facility' : 'facilities'}` } : null,
    firstStat ? { icon: 'gauge', label: firstStat.label, value: `${firstStat.value}${firstStat.suffix || ''}` } : null,
    gmp ? { icon: 'badge-check', label: 'Certified', value: gmp.title } : certifications.length ? { icon: 'badge-check', label: 'Certifications', value: String(certifications.length) } : null,
  ].filter((c): c is HeroChip => Boolean(c))

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
            dateModified: lastUpdated,
            datePublished: doc.createdAt,
          }),
          facilities.length
            ? itemListJsonLd(
                facilities.map((f) => ({ name: f.name, path: `${PATH}#${facilityAnchor(f)}`, image: mediaUrl(facilityImages(f)[0], 'card') })),
                'Manufacturing facilities',
              )
            : null,
        )}
      />

      <ManufacturingHero
        crumbs={[{ name: 'Manufacturing', path: PATH }]}
        eyebrow={doc.hero.eyebrow || 'Manufacturing'}
        title={doc.hero.title}
        subtitle={doc.hero.subtitle}
        image={doc.hero.image}
        primaryCta={doc.hero.primaryCta}
        secondaryCta={doc.hero.secondaryCta}
        fallbackPrimary={{ label: 'Discuss contract manufacturing', url: '/contact' }}
        fallbackSecondary={{ label: 'Tour our facilities', url: '#facilities' }}
        chips={chips}
      />

      <OverviewSection intro={doc.intro} stats={doc.stats} facilities={facilities} />
      <CapabilitiesGrid capabilities={doc.capabilities} />
      <FacilitiesSection facilities={facilities} certifications={certifications} />
      <ProcessStepper steps={doc.process} />
      <ContractManufacturing data={doc.contractManufacturing} />
      <ContentSections sections={doc.sections} />

      {doc.faqs?.length ? (
        <Section aria-labelledby="manufacturing-faq-title" className="pt-0">
          <Container>
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <SectionHeading
                  eyebrow="FAQ"
                  title={<span id="manufacturing-faq-title">Manufacturing questions, answered</span>}
                  description="What distributors, private-label partners and auditors most often ask about our plants, capacity and lead times."
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
        eyebrow="Work with us"
        title="Audit our plants or launch your own brand"
        description="Schedule a facility audit, request our site master file, or brief us on a private-label project. Our contract manufacturing team will follow up with next steps."
        primary={{ label: 'Contact our team', href: '/contact' }}
        secondary={{ label: 'View licenses & certificates', href: '/licenses' }}
      />
    </>
  )
}
