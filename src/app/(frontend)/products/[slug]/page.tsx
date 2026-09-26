import { Check, Package, Pill, Sparkles } from 'lucide-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { FaqAccordion } from '@/components/FaqAccordion'
import { RichText } from '@/components/RichText'
import { AddToListPanel, type TrustItem } from '@/components/product/AddToListPanel'
import { DocumentationStrip } from '@/components/product/DocumentationStrip'
import { InquireSection } from '@/components/product/InquireSection'
import { KeyFacts, buildKeyFacts } from '@/components/product/KeyFacts'
import { ProductGallery } from '@/components/product/ProductGallery'
import { ProductTabs, type ProductTab } from '@/components/product/ProductTabs'
import { MoreInCategory, RelatedProducts } from '@/components/product/RelatedProducts'
import { SpecTable } from '@/components/product/SpecTable'
import {
  AVAILABILITY_LABEL,
  BADGE_LABEL,
  genericLine,
  productHeadline,
  rxLabel,
  shortCertName,
  toGalleryImages,
} from '@/components/product/labels'
import { toInquiryItem } from '@/components/catalog/ProductCard'
import { JsonLd } from '@/components/seo/JsonLd'
import { Badge, Container, Eyebrow, Section, SectionHeading } from '@/components/ui'
import { Orbs } from '@/components/visuals/Orbs'
import { getCommerceLabels, resolvePrice } from '@/lib/commerce'
import {
  getAllProductsSlim,
  getCategoryAncestors,
  getCertifications,
  getProductBySlug,
  getRelatedProducts,
  getSiteSettings,
} from '@/lib/data'
import {
  buildMetadata,
  faqJsonLd,
  graph,
  productJsonLd,
  webPageJsonLd,
  type Crumb,
} from '@/lib/seo'
import { absUrl, mediaUrl } from '@/lib/utils'
import type { Category } from '@/payload-types'

export const revalidate = 3600
export const dynamicParams = true

type Params = Promise<{ slug: string }>

export async function generateStaticParams() {
  const products = await getAllProductsSlim()
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const [product, settings] = await Promise.all([getProductBySlug(slug), getSiteSettings()])
  if (!product) return { title: 'Product not found', robots: { index: false, follow: false } }
  return buildMetadata({
    settings,
    path: `/products/${product.slug}`,
    title: productHeadline(product),
    description: product.shortDescription,
    image: product.images?.[0],
    meta: product.meta,
    type: 'product',
    modifiedTime: product.updatedAt,
  })
}

const isCategory = (c: unknown): c is Category =>
  typeof c === 'object' && c !== null && 'title' in c

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params
  const [product, settings] = await Promise.all([getProductBySlug(slug), getSiteSettings()])
  if (!product) notFound()

  const path = `/products/${product.slug}`
  const labels = getCommerceLabels(settings)
  const price = resolvePrice(product, labels)
  const populatedCats = (product.categories || []).filter(isCategory)
  const primaryCat = populatedCats[0]
  const [related, ancestors, certifications] = await Promise.all([
    getRelatedProducts(product, 8),
    primaryCat ? getCategoryAncestors(primaryCat) : Promise.resolve([] as Category[]),
    getCertifications({ featured: true }),
  ])

  const headline = productHeadline(product)
  const generic = genericLine(product)
  const images = toGalleryImages(product)
  const badges = (product.badges || []).map((b) => BADGE_LABEL[b] || b)
  const rx = rxLabel(product.prescriptionStatus)
  const facts = buildKeyFacts(product)
  const benefits = (product.keyBenefits || []).filter((b) => b.text?.trim())
  const faqs = product.faqs || []

  const crumbs: Crumb[] = [
    { name: 'Products', path: '/products' },
    ...ancestors
      .filter((c) => c.path)
      .map((c) => ({ name: c.title, path: `/categories/${c.path}` })),
    { name: product.title, path },
  ]

  // Every category the product sits in (chain of the primary one + any extra assignments), de-duplicated.
  const linkCats = [...ancestors, ...populatedCats].filter(
    (c, i, arr) => arr.findIndex((x) => x.id === c.id) === i,
  )

  const tabs: (ProductTab | false)[] = [
    !!product.description && {
      id: 'description',
      label: 'Description',
      content: <RichText data={product.description} />,
    },
    !!product.indications && {
      id: 'indications',
      label: 'Indications',
      content: <RichText data={product.indications} />,
    },
    {
      id: 'composition',
      label: 'Composition & specifications',
      content: <SpecTable product={product} />,
    },
    benefits.length > 0 && {
      id: 'benefits',
      label: 'Key benefits',
      count: benefits.length,
      content: (
        <div>
          <h3 className="heading-3">Why partners choose {product.title}</h3>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2" role="list">
            {benefits.map((b, i) => (
              <li key={b.id || i} className="glass flex items-start gap-3 rounded-2xl p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white shadow-[0_6px_16px_-6px_rgb(225_29_46_/_0.7)]">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <span className="text-sm leading-relaxed text-ink-800">{b.text}</span>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    faqs.length > 0 && {
      id: 'faqs',
      label: 'FAQs',
      count: faqs.length,
      content: (
        <div>
          <h3 className="heading-3">Frequently asked questions about {product.title}</h3>
          <FaqAccordion faqs={faqs} withJsonLd={false} className="mt-5" />
        </div>
      ),
    },
  ]

  const availability = product.availability ? AVAILABILITY_LABEL[product.availability] : null

  // Buy-box assurance chips: certification names come from the CMS (featured certifications);
  // the remaining chips only name document types, so no unverifiable claim is hard-coded.
  const trust: TrustItem[] = [
    ...certifications
      .slice(0, 2)
      .map((c) => ({ icon: 'shield' as const, label: shortCertName(c.title) })),
    { icon: 'file', label: 'Certificate of Analysis per batch' },
    { icon: 'globe', label: 'Export documentation' },
  ]

  return (
    <>
      <JsonLd
        data={graph(
          productJsonLd(product, settings),
          {
            ...webPageJsonLd({
              path,
              name: headline,
              description: product.shortDescription,
              type: 'ItemPage',
              image: mediaUrl(product.images?.[0], 'large'),
              dateModified: product.updatedAt,
              datePublished: product.createdAt,
            }),
            mainEntity: { '@id': `${absUrl(path)}#product` },
          },
          faqJsonLd(faqs),
        )}
      />

      {/* Hero: gallery + buy box. `overflow-x-clip` (not `overflow-hidden`) keeps decorative spill
          off the horizontal axis without turning the section into a scrollport, so the gallery's
          `lg:sticky` still sticks to the viewport. */}
      <section
        aria-labelledby="product-title"
        className="relative overflow-x-clip pt-6 sm:pt-8 lg:pt-12"
      >
        <Orbs variant="intense" />
        <Container>
          <Breadcrumbs crumbs={crumbs} />
          <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14 xl:gap-20">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <ProductGallery
                images={images}
                title={product.title}
                badges={badges}
                rx={rx}
                className="mx-auto w-full max-w-xl lg:max-w-none"
              />
            </div>

            <div className="animate-fade-up">
              <div className="flex flex-wrap items-center gap-2">
                <Eyebrow>{primaryCat?.title || 'Pharmaceutical product'}</Eyebrow>
                {rx && (
                  <span
                    className="rounded-full glass px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-800"
                    title={rx === 'Rx' ? 'Prescription only' : 'Over the counter'}
                  >
                    {rx}
                  </span>
                )}
                {availability && (
                  <Badge tone={product.availability === 'discontinued' ? 'ink' : 'success'}>
                    {availability}
                  </Badge>
                )}
              </div>

              <h1 id="product-title" className="display-2 mt-4">
                <span className="block">{product.title}</span>
                {generic && generic !== product.title && (
                  <>
                    <span className="sr-only"> – </span>
                    <span className="mt-2 block text-[0.56em] font-medium leading-snug tracking-tight text-gradient">
                      {generic}
                    </span>
                  </>
                )}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-600 sm:text-lg">
                {product.shortDescription}
              </p>

              <ul className="mt-5 flex flex-wrap gap-2" aria-label="Quick facts">
                {product.dosageForm && (
                  <li className="chip !py-1.5">
                    <Pill className="h-3.5 w-3.5" aria-hidden="true" /> {product.dosageForm}
                  </li>
                )}
                {product.strength && <li className="chip !py-1.5">{product.strength}</li>}
                {product.packSize && (
                  <li className="chip !py-1.5">
                    <Package className="h-3.5 w-3.5" aria-hidden="true" /> {product.packSize}
                  </li>
                )}
                {product.therapeuticClass && (
                  <li className="chip !py-1.5">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />{' '}
                    {product.therapeuticClass}
                  </li>
                )}
              </ul>

              <AddToListPanel
                product={toInquiryItem(product)}
                price={price}
                labels={{ addLabel: labels.addLabel, addedLabel: labels.addedLabel }}
                trust={trust}
                className="mt-7"
              />

              <div className="mt-8">
                <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-ink-500">
                  At a glance
                </h2>
                <KeyFacts facts={facts} className="mt-3" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Detailed information */}
      <Section aria-labelledby="details-heading" className="!pb-10 sm:!pb-12">
        <Container>
          <SectionHeading
            eyebrow="Product information"
            title={<span id="details-heading">Everything about {product.title}</span>}
            description={`Composition, indications, specifications and answers to common questions about ${generic || product.title}.`}
            className="mb-8"
          />
          <ProductTabs
            tabs={tabs.filter((t): t is ProductTab => Boolean(t))}
            label={`${product.title} information`}
          />
        </Container>
      </Section>

      <DocumentationStrip productTitle={product.title} />

      <InquireSection
        product={{ id: product.id, title: product.title }}
        contact={settings.contact}
      />

      <RelatedProducts products={related} labels={labels} />

      <MoreInCategory categories={linkCats} />
    </>
  )
}
