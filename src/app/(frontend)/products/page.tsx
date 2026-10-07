import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { FaqAccordion } from '@/components/FaqAccordion'
import { RichText } from '@/components/RichText'
import { CatalogCta } from '@/components/catalog/filters/CatalogCta'
import { CatalogHero } from '@/components/catalog/filters/CatalogHero'
import { CatalogResults } from '@/components/catalog/filters/CatalogResults'
import { CatalogSections } from '@/components/catalog/filters/CatalogSections'
import { CategoryStrip } from '@/components/catalog/filters/CategoryStrip'
import {
  canonicalPath,
  describeFilters,
  parseFilters,
  type CatalogSearchParams,
} from '@/components/catalog/filters/parseFilters'
import { countDescendants } from '@/components/catalog/filters/tree'
import { JsonLd } from '@/components/seo/JsonLd'
import { Container, Section, SectionHeading } from '@/components/ui'
import { getCommerceLabels } from '@/lib/commerce'
import {
  getAllProductsSlim,
  getCategoryTree,
  getFeaturedProducts,
  getPageGlobal,
  getProductFacets,
  getProducts,
  getSiteSettings,
} from '@/lib/data'
import { buildMetadata, graph, itemListJsonLd, siteName, webPageJsonLd } from '@/lib/seo'
import { mediaUrl, richTextToPlain, truncate } from '@/lib/utils'

const BASE = '/products'

type Props = { searchParams: Promise<CatalogSearchParams> }

/**
 * /products – the full catalogue. Reads search params (filters, search, sort, page),
 * so it renders dynamically; every query is a small indexed Payload find.
 */
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const [settings, doc, sp] = await Promise.all([
    getSiteSettings(),
    getPageGlobal('products-page'),
    searchParams,
  ])
  const filters = parseFilters(sp)
  const baseTitle = doc.meta?.title || doc.hero?.title || 'Pharmaceutical product catalogue'
  const summary = describeFilters(filters)
  let title = summary ? `${summary} – ${baseTitle}` : baseTitle
  if (filters.page > 1) title += ` – page ${filters.page}`
  return buildMetadata({
    settings,
    path: canonicalPath(BASE, filters),
    title,
    description:
      doc.meta?.description || doc.hero?.subtitle || truncate(richTextToPlain(doc.intro), 160),
    image: doc.hero?.image,
    meta: { ...doc.meta, title },
    modifiedTime: doc.updatedAt,
  })
}

export default async function ProductsPage({ searchParams }: Props) {
  const filters = parseFilters(await searchParams)
  const [settings, doc, tree, result, facets, all] = await Promise.all([
    getSiteSettings(),
    getPageGlobal('products-page'),
    getCategoryTree(),
    getProducts(filters.query),
    getProductFacets(),
    getAllProductsSlim(),
  ])
  if (result.totalPages > 0 && filters.page > result.totalPages) notFound()
  const suggestions = result.docs.length === 0 ? await getFeaturedProducts(4) : []
  const labels = getCommerceLabels(settings)
  const name = siteName(settings)

  const title = doc.hero?.title || 'Pharmaceutical product catalogue'
  const description =
    doc.meta?.description || doc.hero?.subtitle || truncate(richTextToPlain(doc.intro), 300)
  const subCount = countDescendants(tree)
  const stats = [
    { value: all.length, label: 'products' },
    { value: tree.length, label: 'therapeutic categories' },
    ...(subCount ? [{ value: subCount, label: 'sub-categories' }] : []),
    ...(facets.dosageForm.length
      ? [{ value: facets.dosageForm.length, label: 'dosage forms' }]
      : []),
  ]
  const ctas = [
    doc.hero?.primaryCta?.label
      ? { ...doc.hero.primaryCta, variant: 'primary' as const }
      : { label: 'Browse the catalogue', url: '#catalog', variant: 'primary' as const },
    doc.hero?.secondaryCta?.label
      ? { ...doc.hero.secondaryCta, variant: 'secondary' as const }
      : { label: labels.ctaLabel, url: '/inquiry', variant: 'secondary' as const },
  ]

  return (
    <>
      <JsonLd
        data={graph(
          webPageJsonLd({
            path: canonicalPath(BASE, filters),
            name: title,
            description,
            type: 'CollectionPage',
            image: mediaUrl(doc.hero?.image, 'large'),
            dateModified: doc.updatedAt,
          }),
          itemListJsonLd(
            result.docs.map((p) => ({
              name: p.title,
              path: `/products/${p.slug}`,
              image: mediaUrl(p.images?.[0], 'card'),
            })),
            filters.page > 1 ? `${name} products – page ${filters.page}` : `${name} products`,
          ),
        )}
      />

      <CatalogHero
        crumbs={[{ name: 'Products', path: BASE }]}
        eyebrow={doc.hero?.eyebrow || 'Products'}
        title={title}
        lead={doc.hero?.subtitle}
        stats={stats}
        ctas={ctas}
        image={doc.hero?.image}
      >
        {doc.intro && <RichText data={doc.intro} className="max-w-2xl text-[15px]" />}
      </CatalogHero>

      <Section className="!pb-10 sm:!pb-12" aria-labelledby="browse-by-category">
        <Container>
          <SectionHeading
            eyebrow="Categories"
            title={<span id="browse-by-category">Browse by therapeutic category</span>}
            titleClassName="!text-xl sm:!text-2xl"
            className="mb-5"
          />
          <CategoryStrip categories={tree} />
        </Container>
      </Section>

      <Section className="!pt-0" aria-label="Product catalogue">
        <Container>
          <CatalogResults
            basePath={BASE}
            filters={filters}
            facets={facets}
            result={result}
            labels={labels}
            suggestions={suggestions}
            priorityCount={doc.hero?.image ? 0 : 2}
          />
        </Container>
      </Section>

      {doc.sections && doc.sections.length > 0 && (
        <Section className="!pt-0">
          <Container>
            <CatalogSections sections={doc.sections} />
          </Container>
        </Section>
      )}

      {doc.faqs && doc.faqs.length > 0 && (
        <Section className="!pt-0" aria-labelledby="catalog-faq">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
              <SectionHeading
                eyebrow="FAQ"
                title={<span id="catalog-faq">Questions about sourcing from {name}</span>}
                description="Straight answers on availability, documentation and how inquiries work."
              />
              <FaqAccordion faqs={doc.faqs} />
            </div>
          </Container>
        </Section>
      )}

      <Section className="!pt-0">
        <Container>
          <CatalogCta ctaLabel={labels.ctaLabel} listName={labels.listName} />
        </Container>
      </Section>
    </>
  )
}
