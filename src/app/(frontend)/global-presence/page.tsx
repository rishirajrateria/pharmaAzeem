import { ArrowRight, Globe2, ShieldCheck, Ship } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { FaqAccordion } from '@/components/FaqAccordion'
import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { Stats } from '@/components/Stats'
import { ContentSections } from '@/components/global/ContentSections'
import { CountryCard } from '@/components/global/CountryCard'
import { CtaBand } from '@/components/global/CtaBand'
import { ExportServices } from '@/components/global/ExportServices'
import { GlobalMapPanel } from '@/components/global/GlobalMapPanel'
import { OnboardingSteps } from '@/components/global/OnboardingSteps'
import { RegionNav } from '@/components/global/RegionNav'
import { countryPath, earliestYear, groupByRegion, regionAnchor } from '@/components/global/regions'
import { JsonLd } from '@/components/seo/JsonLd'
import { Button, Container, Eyebrow, Section, SectionHeading } from '@/components/ui'
import { Reveal } from '@/components/ui/Reveal'
import { HudRings } from '@/components/visuals/MoleculeField'
import { Orbs } from '@/components/visuals/Orbs'
import { getCountries, getPageGlobal, getSiteSettings } from '@/lib/data'
import { buildMetadata, graph, itemListJsonLd, siteName, webPageJsonLd } from '@/lib/seo'
import { mediaUrl, richTextToPlain, truncate } from '@/lib/utils'

export const revalidate = 3600

const PATH = '/global-presence'

const getData = async () => {
  const [page, countries, settings] = await Promise.all([getPageGlobal('global-presence-page'), getCountries({ served: true }), getSiteSettings()])
  return { page, countries, settings }
}

export async function generateMetadata(): Promise<Metadata> {
  const { page, countries, settings } = await getData()
  const title = page.meta?.title || page.hero?.title || 'Global presence – pharmaceutical exporter'
  const description = page.hero?.subtitle || truncate(richTextToPlain(page.intro), 160) || `${siteName(settings)} exports WHO-GMP certified medicines to ${countries.length}+ countries.`
  return buildMetadata({ settings, path: PATH, title, description, image: page.hero?.image, meta: page.meta, modifiedTime: page.updatedAt })
}

export default async function GlobalPresencePage() {
  const { page, countries, settings } = await getData()
  const groups = groupByRegion(countries)
  const since = earliestYear(countries)
  const name = siteName(settings)
  const hero = page.hero
  const heroImage = mediaUrl(hero?.image, 'large')
  const primaryCta = hero?.primaryCta?.label && hero?.primaryCta?.url ? hero.primaryCta : { label: 'Start an inquiry', url: '/inquiry' }
  const secondaryCta = hero?.secondaryCta?.label && hero?.secondaryCta?.url ? hero.secondaryCta : { label: 'Browse products', url: '/products' }
  const summary = `${name} currently exports to ${countries.length} countries across ${groups.length} regions${since ? `, with the first international shipments dating back to ${since}` : ''}. Each market below has a dedicated page covering its medicines regulator, the therapeutic categories in demand and how we register, ship and support products there.`

  return (
    <>
      <JsonLd
        data={graph(
          webPageJsonLd({ path: PATH, name: page.meta?.title || hero?.title || 'Global presence', description: page.meta?.description || hero?.subtitle, type: 'CollectionPage', image: heroImage, dateModified: page.updatedAt }),
          itemListJsonLd(
            countries.map((c) => ({ name: c.name, path: countryPath(c) })),
            'Countries served',
          ),
        )}
      />

      {/* Hero */}
      <section aria-labelledby="hero-heading" className="relative overflow-hidden pt-8 sm:pt-12">
        <Orbs variant="intense" />
        <Container>
          <Breadcrumbs crumbs={[{ name: 'Global presence', path: PATH }]} />
          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div className="animate-fade-up">
              <Eyebrow className="mb-5">{hero?.eyebrow || 'Global presence'}</Eyebrow>
              <h1 id="hero-heading" className="display-2">
                {hero?.title || 'Serving healthcare partners worldwide'}
              </h1>
              {hero?.subtitle && <p className="lead mt-5 max-w-2xl">{hero.subtitle}</p>}
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-600">{summary}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href={primaryCta.url as string}>
                  {primaryCta.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button href={secondaryCta.url as string} variant="secondary">
                  {secondaryCta.label}
                </Button>
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-ink-600" aria-label="Highlights">
                <li className="inline-flex items-center gap-2">
                  <Globe2 className="h-4 w-4 text-brand-600" aria-hidden="true" /> {countries.length} countries · {groups.length} regions
                </li>
                <li className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-brand-600" aria-hidden="true" /> Registration & dossier support
                </li>
                <li className="inline-flex items-center gap-2">
                  <Ship className="h-4 w-4 text-brand-600" aria-hidden="true" /> Sea, air & cold-chain freight
                </li>
              </ul>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <HudRings className="opacity-70" />
              <div className="glass gradient-border animate-float relative rotate-2 rounded-4xl p-2 shadow-glass-lg">
                <Media media={hero?.image} size="large" sizes="(max-width: 1024px) 90vw, 40vw" priority className="aspect-[4/3] w-full rounded-3xl object-cover" />
                <div className="pointer-events-none absolute inset-2 rounded-3xl bg-gradient-to-t from-white/50 via-transparent to-transparent" aria-hidden="true" />
              </div>
              <div className="glass absolute -bottom-5 -left-3 animate-float-slow rounded-2xl px-4 py-3 shadow-glass sm:-left-8" aria-hidden="true">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-500">Markets served</p>
                <p className="text-gradient text-2xl font-semibold">{countries.length}+</p>
              </div>
              {since && (
                <div className="glass absolute -right-2 -top-4 animate-float rounded-2xl px-4 py-3 shadow-glass sm:-right-6" aria-hidden="true">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-500">Exporting since</p>
                  <p className="text-gradient text-2xl font-semibold">{since}</p>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* World map */}
      <Container className="mt-16 sm:mt-20 lg:mt-24">
        <Reveal>
          <GlobalMapPanel countries={countries} regionCount={groups.length} />
        </Reveal>
      </Container>

      {/* Intro + stats */}
      <Section aria-labelledby="intro-heading">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div>
              <Eyebrow className="mb-4">Export operations</Eyebrow>
              <h2 id="intro-heading" className="heading-2">
                Registered products, local know-how, dependable logistics
              </h2>
            </div>
            <div>
              <RichText data={page.intro} className="max-w-3xl" />
              {!page.intro && <p className="lead max-w-3xl">{summary}</p>}
            </div>
          </div>
          {page.stats && page.stats.length > 0 && (
            <Reveal className="mt-12">
              <Stats stats={page.stats} />
            </Reveal>
          )}
        </Container>
      </Section>

      {/* Markets by region */}
      <section aria-labelledby="regions-heading" className="relative pb-16 sm:pb-20 lg:pb-28">
        <Container>
          <SectionHeading eyebrow="Markets by region" title={<span id="regions-heading">Where we ship, region by region</span>} description="Every country page explains the local regulatory pathway, the therapeutic categories in demand and the practicalities of ordering from us." className="mb-8" />
          <RegionNav items={groups.map((g) => ({ key: g.key, label: g.label, count: g.countries.length, anchor: regionAnchor(g.key) }))} className="mb-4" />
          <div className="space-y-16 pt-8">
            {groups.map((g) => {
              const anchor = regionAnchor(g.key)
              return (
                <section key={g.key} id={anchor} aria-labelledby={`${anchor}-heading`} className="scroll-mt-48">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-2xl">
                      <h2 id={`${anchor}-heading`} className="heading-3 flex flex-wrap items-center gap-3">
                        {g.label}
                        <span className="rounded-full bg-brand-gradient px-2.5 py-0.5 font-mono text-[11px] font-semibold text-white shadow-[0_6px_16px_-6px_rgb(225_29_46_/_0.6)]">
                          {g.countries.length} {g.countries.length === 1 ? 'market' : 'markets'}
                        </span>
                      </h2>
                      <p className="mt-2 text-sm text-ink-600">{g.blurb}</p>
                    </div>
                    <div className="hairline w-full sm:mb-2 sm:flex-1 sm:self-end" aria-hidden="true" />
                  </div>
                  <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" role="list">
                    {g.countries.map((c, i) => (
                      <Reveal as="li" key={c.id} delay={(i % 4) * 60} className="h-full">
                        <CountryCard country={c} className="h-full" />
                      </Reveal>
                    ))}
                  </ul>
                </section>
              )
            })}
          </div>
          {groups.length === 0 && (
            <div className="glass rounded-3xl p-8 text-center text-sm text-ink-600">
              Country pages are being prepared.{' '}
              <Link href="/contact" className="font-semibold text-brand-700 hover:underline">
                Contact us
              </Link>{' '}
              to discuss your market.
            </div>
          )}
        </Container>
      </section>

      {/* Export services */}
      <Section aria-labelledby="services-heading" className="!pt-0">
        <Container>
          <SectionHeading eyebrow="Export services" title={<span id="services-heading">Everything between our plant and your pharmacy shelf</span>} description="From dossier to dispatch, one team handles the regulatory, commercial and logistical work of bringing a product into a new market." className="mb-10" />
          <ExportServices services={page.exportServices} />
        </Container>
      </Section>

      {/* Onboarding process */}
      <Section aria-labelledby="process-heading" className="!pt-0">
        <Container>
          <div className="glass-subtle relative overflow-hidden rounded-4xl p-6 sm:p-10 lg:p-14">
            <div className="pointer-events-none absolute inset-0 dots-pattern opacity-50" aria-hidden="true" />
            <div className="relative">
              <SectionHeading eyebrow="How we onboard a new market" title={<span id="process-heading">From first call to first container in four steps</span>} description="A repeatable process refined over dozens of market launches – typically 30–45 days from confirmed order to dispatch once products are registered." className="mb-10" />
              <OnboardingSteps steps={page.process} />
            </div>
          </div>
        </Container>
      </Section>

      <ContentSections sections={page.sections} />

      {/* FAQ */}
      {page.faqs && page.faqs.length > 0 && (
        <Section aria-labelledby="faq-heading" className="!pt-0">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
              <SectionHeading eyebrow="FAQ" title={<span id="faq-heading">Exporting with {name}</span>} description="Answers to the questions distributors, importers and tender agencies ask us most." />
              <FaqAccordion faqs={page.faqs} />
            </div>
          </Container>
        </Section>
      )}

      <CtaBand
        eyebrow="Open a new market"
        title="Don't see your country yet? We can register there."
        description="Send us your product list and target market. Our regulatory team will assess the requirements and outline a registration and supply plan within a few business days."
        primary={{ label: 'Inquire now', href: '/inquiry' }}
        secondary={{ label: 'Talk to the export team', href: '/contact' }}
      />
    </>
  )
}
