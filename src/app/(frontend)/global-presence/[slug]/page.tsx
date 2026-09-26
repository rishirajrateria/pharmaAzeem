import { ArrowRight, Check, Clock, Landmark, Mail, MessageCircle, Phone } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { FaqAccordion } from '@/components/FaqAccordion'
import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { CategoryCard } from '@/components/catalog/CategoryCard'
import { ProductCard } from '@/components/catalog/ProductCard'
import { InquiryForm } from '@/components/forms/InquiryForm'
import { CountryMapCard } from '@/components/global/CountryMapCard'
import { FactList, type Fact } from '@/components/global/FactList'
import { MarketLinks } from '@/components/global/MarketLinks'
import { countryPath, regionAnchor, regionLabel, regulatorShort } from '@/components/global/regions'
import { JsonLd } from '@/components/seo/JsonLd'
import { Button, Container, Eyebrow, Section, SectionHeading } from '@/components/ui'
import { Reveal } from '@/components/ui/Reveal'
import { Orbs } from '@/components/visuals/Orbs'
import { getCommerceLabels } from '@/lib/commerce'
import { getCountries, getCountryBySlug, getFeaturedProducts, getSiteSettings } from '@/lib/data'
import {
  buildMetadata,
  countryServiceJsonLd,
  faqJsonLd,
  graph,
  siteName,
  webPageJsonLd,
} from '@/lib/seo'
import { mediaUrl, richTextToPlain, truncate } from '@/lib/utils'
import type { Category, Product } from '@/payload-types'

export const revalidate = 3600
export const dynamicParams = true

type Params = Promise<{ slug: string }>

export async function generateStaticParams() {
  const countries = await getCountries({ served: true })
  return countries.map((c) => ({ slug: c.slug }))
}

const pageTitle = (name: string) => `Pharmaceutical Supplier & Exporter to ${name}`

/** Neutral fallback when the editor has not written a summary – no certification or SLA claims. */
const defaultSummary = (company: string, countryName: string) =>
  `${company} supplies pharmaceutical products to licensed importers, distributors and healthcare institutions in ${countryName}.`

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const [country, settings] = await Promise.all([getCountryBySlug(slug), getSiteSettings()])
  // Markets flagged as not served are excluded from the index, sitemap and static params – keep the page consistent.
  if (!country || !country.served)
    return { title: 'Market not found', robots: { index: false, follow: false } }
  const description =
    country.summary ||
    truncate(richTextToPlain(country.description), 160) ||
    defaultSummary(siteName(settings), country.name)
  return buildMetadata({
    settings,
    path: countryPath(country),
    title: country.meta?.title || pageTitle(country.name),
    description,
    image: country.image,
    meta: country.meta,
    modifiedTime: country.updatedAt,
  })
}

export default async function CountryPage({ params }: { params: Params }) {
  const { slug } = await params
  const [country, settings, served] = await Promise.all([
    getCountryBySlug(slug),
    getSiteSettings(),
    getCountries({ served: true }),
  ])
  if (!country || !country.served) notFound()

  const labels = getCommerceLabels(settings)
  const name = siteName(settings)
  const path = countryPath(country)
  const region = regionLabel(country.region)
  const regulator = regulatorShort(country.regulatoryAuthority)
  const summary = country.summary || defaultSummary(name, country.name)

  const categories = (country.popularCategories || []).filter(
    (c): c is Category => typeof c === 'object' && c !== null && Boolean(c.path),
  )
  const picked = (country.popularProducts || []).filter(
    (p): p is Product => typeof p === 'object' && p !== null && p._status === 'published',
  )
  let products: Product[] = picked
  if (products.length < 4) {
    const featured = await getFeaturedProducts(8)
    const seen = new Set(products.map((p) => p.id))
    products = [...products, ...featured.filter((p) => !seen.has(p.id))].slice(
      0,
      Math.max(4, picked.length),
    )
  }
  const siblings = served.filter((c) => c.region === country.region && c.id !== country.id)
  const heroImage = mediaUrl(country.image, 'large')
  const contact = settings.contact

  const facts: Fact[] = [
    {
      label: 'Regulatory authority',
      value: country.regulatoryAuthority || 'National medicines regulator',
      icon: 'landmark',
    },
    {
      label: 'Region',
      value: region,
      href: `/global-presence#${regionAnchor(country.region)}`,
      icon: 'globe',
    },
    {
      label: 'Operating since',
      value: country.sinceYear ? String(country.sinceYear) : 'Active market',
      icon: 'clock',
    },
    {
      label: 'Country code',
      value: `${country.flag ? `${country.flag} ` : ''}${country.isoCode} (ISO 3166-1)`,
      icon: 'flag',
    },
    {
      label: 'Products registered',
      value: 'Ask us for the current list',
      href: '#inquiry',
      icon: 'clipboard-check',
    },
    {
      label: 'Artwork & documentation',
      value: 'English dossiers; local-language artwork on request',
      icon: 'file-check',
    },
  ]

  return (
    <>
      <JsonLd
        data={graph(
          countryServiceJsonLd(country, settings),
          webPageJsonLd({
            path,
            name: country.meta?.title || pageTitle(country.name),
            description: summary,
            type: 'WebPage',
            image: heroImage,
            dateModified: country.updatedAt,
          }),
          faqJsonLd(country.faqs),
        )}
      />

      {/* Hero */}
      <section aria-labelledby="hero-heading" className="relative overflow-hidden pt-8 sm:pt-12">
        <Orbs variant="intense" />
        <Container>
          <Breadcrumbs
            crumbs={[
              { name: 'Global presence', path: '/global-presence' },
              { name: country.name, path },
            ]}
          />
          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div className="animate-fade-up">
              <Eyebrow className="mb-5">Global presence · {region}</Eyebrow>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                {country.flag && (
                  <span
                    className="glass inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl leading-none sm:h-16 sm:w-16 sm:text-4xl"
                    aria-hidden="true"
                  >
                    {country.flag}
                  </span>
                )}
                <h1 id="hero-heading" className="display-2 min-w-0 flex-1 basis-[16rem]">
                  Pharmaceutical Supplier &amp; Exporter to{' '}
                  <span className="text-gradient">{country.name}</span>
                </h1>
              </div>
              <p className="lead mt-5 max-w-2xl">{summary}</p>
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Key facts">
                {country.sinceYear && (
                  <li className="chip !py-1.5">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" /> Exporting since{' '}
                    {country.sinceYear}
                  </li>
                )}
                {regulator && (
                  <li className="chip !py-1.5">
                    <Landmark className="h-3.5 w-3.5" aria-hidden="true" /> Regulator: {regulator}
                  </li>
                )}
                <li className="chip !py-1.5">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" /> Export documentation included
                </li>
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="#inquiry">
                  Talk to our {country.name} desk{' '}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button href="/products" variant="secondary">
                  Browse products
                </Button>
              </div>
            </div>
            <Reveal delay={120}>
              <CountryMapCard country={country} siblings={siblings} />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Key facts */}
      <Section aria-labelledby="facts-heading" className="!pb-0">
        <Container>
          <SectionHeading
            eyebrow="Key facts"
            title={
              <span id="facts-heading">Supplying medicines to {country.name} at a glance</span>
            }
            className="mb-8"
          />
          <Reveal>
            <FactList facts={facts} />
          </Reveal>
        </Container>
      </Section>

      {/* Description + highlights */}
      <Section aria-labelledby="overview-heading">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
            <article>
              <Eyebrow className="mb-4">Market overview</Eyebrow>
              <h2 id="overview-heading" className="heading-2">
                How we work in {country.name}
              </h2>
              {country.description ? (
                <RichText data={country.description} className="mt-6 max-w-3xl" />
              ) : (
                <p className="lead mt-6 max-w-3xl">
                  Our regulatory affairs team prepares dossiers in the format required by the{' '}
                  {country.regulatoryAuthority || 'national regulator'}, provides product
                  certificates and stability data on request, and ships registered products with
                  complete export documentation.
                </p>
              )}
            </article>
            <aside
              className="space-y-6 lg:sticky lg:top-32 lg:self-start"
              aria-label={`${country.name} highlights`}
            >
              {country.highlights && country.highlights.length > 0 && (
                <div className="glass-red rounded-3xl p-6">
                  <p className="eyebrow mb-4">At a glance</p>
                  <ul className="space-y-3" role="list">
                    {country.highlights.map((h, i) => (
                      <li
                        key={h.id || i}
                        className="flex items-start gap-3 text-sm font-medium text-ink-900"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-brand-600 shadow-sm ring-1 ring-brand-200">
                          <Check className="h-3 w-3" aria-hidden="true" />
                        </span>
                        {h.text}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {country.image && (
                <div className="glass rotate-1 rounded-3xl p-2 shadow-glass-lg transition-transform duration-700 hover:rotate-0">
                  <Media
                    media={country.image}
                    size="card"
                    sizes="(max-width: 1024px) 100vw, 30vw"
                    className="aspect-[4/3] w-full rounded-2xl object-cover"
                  />
                </div>
              )}
              <div className="glass rounded-3xl p-6">
                <p className="text-sm font-semibold text-ink-950">
                  Need a quotation for {country.name}?
                </p>
                <p className="mt-1 text-sm text-ink-600">
                  Add products to your {labels.listName.toLowerCase()} and send one request for
                  everything.
                </p>
                <Link
                  href="/products"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline"
                >
                  Browse the catalogue <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      {/* Popular categories */}
      {categories.length > 0 && (
        <Section aria-labelledby="categories-heading" className="!pt-0">
          <Container>
            <SectionHeading
              eyebrow="In demand"
              title={<span id="categories-heading">Popular categories in {country.name}</span>}
              description={`Therapeutic categories our ${country.name} partners order most often. Each category page lists every formulation we manufacture in that class.`}
              className="mb-8"
            />
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" role="list">
              {categories.map((c, i) => (
                <Reveal as="li" key={c.id} delay={i * 60} className="h-full">
                  <CategoryCard category={c} compact className="h-full" />
                </Reveal>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* Products in demand */}
      {products.length > 0 && (
        <Section aria-labelledby="products-heading" className="!pt-0">
          <Container>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                eyebrow="Products"
                title={<span id="products-heading">Products in demand in {country.name}</span>}
                description={
                  picked.length
                    ? `Formulations already supplied to or requested by partners in ${country.name}.`
                    : `A selection from our catalogue frequently requested by partners in ${region}.`
                }
              />
              <Link
                href="/products"
                className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline"
              >
                View all products <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <ul
              className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-4"
              role="list"
            >
              {products.map((p, i) => (
                <Reveal as="li" key={p.id} delay={i * 60} className="h-full">
                  <ProductCard product={p} labels={labels} className="h-full" />
                </Reveal>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* FAQ */}
      {country.faqs && country.faqs.length > 0 && (
        <Section aria-labelledby="faq-heading" className="!pt-0">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
              <SectionHeading
                eyebrow="FAQ"
                title={<span id="faq-heading">Exporting to {country.name}: common questions</span>}
                description="Registration, lead times and how to start working with us."
              />
              <FaqAccordion faqs={country.faqs} withJsonLd={false} />
            </div>
          </Container>
        </Section>
      )}

      {/* Inquiry desk */}
      <Section id="inquiry" aria-labelledby="inquiry-heading" className="scroll-mt-28 !pt-0">
        <Container>
          <div className="glass-strong glass-edge noise relative overflow-hidden rounded-4xl p-6 sm:p-10 lg:p-14">
            <div
              className="pointer-events-none absolute inset-0 dots-pattern opacity-40"
              aria-hidden="true"
            />
            <div className="relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
              <div>
                <Eyebrow className="mb-4">Contact</Eyebrow>
                <h2 id="inquiry-heading" className="heading-2">
                  Talk to our {country.name} desk
                </h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-600">
                  Tell us which products and quantities you need for {country.name}. Our export team
                  will come back to you with availability, registration status and a quotation.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-ink-700" role="list">
                  {[
                    `Dossiers prepared for the ${regulator || 'national regulator'}`,
                    'Product certificates and stability data on request',
                    'Sea, air and cold-chain freight with full export documentation',
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-brand-200">
                        <Check className="h-3 w-3" aria-hidden="true" />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
                {(contact?.email || contact?.phone || contact?.whatsapp) && (
                  <ul className="mt-8 flex flex-wrap gap-2" aria-label="Direct contact">
                    {contact.email && (
                      <li>
                        <a href={`mailto:${contact.email}`} className="btn-secondary !py-2 text-xs">
                          <Mail className="h-4 w-4" aria-hidden="true" /> {contact.email}
                        </a>
                      </li>
                    )}
                    {contact.phone && (
                      <li>
                        <a
                          href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`}
                          className="btn-secondary !py-2 text-xs"
                        >
                          <Phone className="h-4 w-4" aria-hidden="true" /> {contact.phone}
                        </a>
                      </li>
                    )}
                    {contact.whatsapp && (
                      <li>
                        <a
                          href={`https://wa.me/${contact.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary !py-2 text-xs"
                        >
                          <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp
                        </a>
                      </li>
                    )}
                  </ul>
                )}
              </div>
              <div className="glass rounded-3xl p-5 sm:p-7">
                <InquiryForm
                  source="contact-form"
                  includeList={false}
                  compact
                  submitLabel="Send inquiry"
                  successMessage={`Thank you – our ${country.name} desk will be in touch shortly.`}
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Other markets */}
      <Section aria-label={`Other markets in ${region}`} className="!pt-0">
        <Container className="space-y-4">
          <MarketLinks
            countries={siblings}
            regionKey={country.region}
            regionLabel={region}
            title={`Other markets in ${region}`}
          />
          <p className="text-center text-xs text-ink-500">
            <Link href="/global-presence" className="font-semibold text-brand-700 hover:underline">
              See all {served.length} countries we export to
            </Link>
          </p>
        </Container>
      </Section>
    </>
  )
}
