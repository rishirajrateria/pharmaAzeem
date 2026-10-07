import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'

import { FaqAccordion } from '@/components/FaqAccordion'
import { RichText } from '@/components/RichText'
import { CatalogCta } from '@/components/catalog/filters/CatalogCta'
import { CatalogHero } from '@/components/catalog/filters/CatalogHero'
import { CatalogResults } from '@/components/catalog/filters/CatalogResults'
import { CategoryStrip } from '@/components/catalog/filters/CategoryStrip'
import {
  canonicalPath,
  describeFilters,
  parseFilters,
  type CatalogSearchParams,
} from '@/components/catalog/filters/parseFilters'
import { findNode, joinProse } from '@/components/catalog/filters/tree'
import { JsonLd } from '@/components/seo/JsonLd'
import { Container, Section, SectionHeading } from '@/components/ui'
import { getCommerceLabels } from '@/lib/commerce'
import {
  getAllCategories,
  getCategoryAncestors,
  getCategoryByPath,
  getCategoryBySlug,
  getCategoryDescendantIds,
  getCategoryTree,
  getFeaturedProducts,
  getProductFacets,
  getProducts,
  getSiteSettings,
} from '@/lib/data'
import { buildMetadata, categoryJsonLd, graph, siteName } from '@/lib/seo'
import { absUrl, relId, richTextToPlain, truncate } from '@/lib/utils'

type Props = { params: Promise<{ slug: string[] }>; searchParams: Promise<CatalogSearchParams> }

export const dynamicParams = true

export async function generateStaticParams() {
  const cats = await getAllCategories()
  return cats.filter((c) => c.path).map((c) => ({ slug: (c.path as string).split('/') }))
}

/**
 * Resolves `/categories/a/b` by its stored path. A URL that only matches by the last slug
 * (e.g. a category that was moved under a new parent) is permanently redirected to the
 * canonical nested path so old links and backlinks keep working.
 */
async function resolveCategory(slugs: string[]) {
  const path = slugs.map((s) => s.toLowerCase()).join('/')
  const byPath = await getCategoryByPath(path)
  if (byPath) return byPath
  const last = slugs[slugs.length - 1]
  const bySlug = last ? await getCategoryBySlug(last.toLowerCase()) : null
  if (bySlug?.path && bySlug.path !== path) permanentRedirect(`/categories/${bySlug.path}`)
  notFound()
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const [{ slug }, sp, settings] = await Promise.all([params, searchParams, getSiteSettings()])
  const category = await resolveCategory(slug)
  const filters = parseFilters(sp)
  const basePath = `/categories/${category.path}`
  const baseTitle = category.meta?.title || `${category.title} – Products`
  const summary = describeFilters(filters)
  let title = summary ? `${summary} – ${baseTitle}` : baseTitle
  if (filters.page > 1) title += ` – page ${filters.page}`
  return buildMetadata({
    settings,
    path: canonicalPath(basePath, filters),
    title,
    description:
      category.meta?.description ||
      category.shortDescription ||
      truncate(richTextToPlain(category.description), 160),
    image: category.image,
    meta: { ...category.meta, title },
    modifiedTime: category.updatedAt,
  })
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const [{ slug }, sp] = await Promise.all([params, searchParams])
  const category = await resolveCategory(slug)
  const filters = parseFilters(sp)
  const basePath = `/categories/${category.path}`

  const [settings, ancestors, tree, descendantIds] = await Promise.all([
    getSiteSettings(),
    getCategoryAncestors(category),
    getCategoryTree(),
    getCategoryDescendantIds(category.id),
  ])
  const [result, facets] = await Promise.all([
    getProducts({ ...filters.query, categoryIds: descendantIds }),
    getProductFacets(descendantIds),
  ])
  if (result.totalPages > 0 && filters.page > result.totalPages) notFound()
  const suggestions = result.docs.length === 0 ? await getFeaturedProducts(4) : []

  const labels = getCommerceLabels(settings)
  const name = siteName(settings)
  const node = findNode(tree, category.id)
  const children = node?.children ?? []
  const parentId = relId(category.parent)
  const parentNode = parentId ? findNode(tree, parentId) : null
  const siblings = (parentNode ? parentNode.children : tree).filter((c) => c.id !== category.id)
  const totalInCategory = node?.productCount ?? result.totalDocs

  const crumbs = [
    { name: 'Products', path: '/products' },
    ...ancestors.map((c) => ({ name: c.title, path: `/categories/${c.path}` })),
  ]

  // Factual summary paragraph (quoted by search engines and AI assistants).
  const forms = joinProse(
    facets.dosageForm.map((f) => f.value.toLowerCase()),
    4,
  )
  const routes = joinProse(
    facets.route.map((r) => r.value.toLowerCase()),
    3,
  )
  const rxCount = facets.prescriptionStatus.find((p) => p.value === 'rx')?.count ?? 0
  const otcCount = facets.prescriptionStatus.find((p) => p.value === 'otc')?.count ?? 0
  const summary = [
    `${name} manufactures and exports ${totalInCategory} ${category.title.toLowerCase()} ${totalInCategory === 1 ? 'product' : 'products'}${
      children.length
        ? ` across ${children.length} sub-categories (${joinProse(
            children.map((c) => c.title),
            6,
          )})`
        : ''
    }.`,
    forms
      ? `Formulations are available as ${forms}${routes ? ` for ${routes} administration` : ''}.`
      : '',
    rxCount || otcCount
      ? `The range includes ${[rxCount ? `${rxCount} prescription-only (Rx)` : '', otcCount ? `${otcCount} over-the-counter (OTC)` : ''].filter(Boolean).join(' and ')} ${rxCount + otcCount === 1 ? 'medicine' : 'medicines'}; every product page lists composition, indications, pack size, shelf life and storage conditions.`
      : '',
  ]
    .filter(Boolean)
    .join(' ')

  const stats = [
    { value: totalInCategory, label: 'products' },
    ...(children.length ? [{ value: children.length, label: 'sub-categories' }] : []),
    ...(facets.dosageForm.length
      ? [{ value: facets.dosageForm.length, label: 'dosage forms' }]
      : []),
  ]

  // The WebPage node must point at the same URL as the canonical (`?page=N` for plain pagination).
  const [collectionPage, ...jsonLdRest] = categoryJsonLd(category, result.docs)
  const canonicalUrl = absUrl(canonicalPath(basePath, filters))
  const pageJsonLd = { ...collectionPage, '@id': `${canonicalUrl}#webpage`, url: canonicalUrl }

  return (
    <>
      <JsonLd data={graph(pageJsonLd, ...jsonLdRest)} />

      <CatalogHero
        compact
        crumbs={crumbs}
        title={category.title}
        lead={category.shortDescription || summary}
        stats={stats.slice(0, 2)}
      >
        {children.length > 0 && (
          <nav aria-label={`${category.title} sub-categories`}>
            <ul className="flex flex-wrap gap-2">
              {children.map((c) => (
                <li key={c.id}>
                  <Link
                    prefetch={false}
                    href={`/categories/${c.path}`}
                    className="inline-flex items-center gap-1.5 glass px-3 py-1.5 text-sm text-ink-800 transition-colors hover:border-brand-700 hover:text-brand-700"
                  >
                    {c.title}
                    <span className="text-xs text-ink-400">{c.productCount}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </CatalogHero>

      <Section className="!pt-8 sm:!pt-10" aria-label={`${category.title} products`}>
        <Container>
          <CatalogResults
            basePath={basePath}
            filters={filters}
            facets={facets}
            result={result}
            labels={labels}
            suggestions={suggestions}
            scopeLabel={`in ${category.title}`}
            priorityCount={4}
          />
        </Container>
      </Section>

      {category.description && (
        <Section className="!pt-0" aria-labelledby="category-about-title">
          <Container>
            <div className="glass relative overflow-hidden p-6 sm:p-10 lg:p-14">
              <div className="relative grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
                <SectionHeading
                  eyebrow="About this range"
                  title={
                    <span id="category-about-title">
                      {category.title} from {name}
                    </span>
                  }
                  titleClassName="!text-2xl sm:!text-3xl"
                />
                <RichText data={category.description} />
              </div>
            </div>
          </Container>
        </Section>
      )}

      {category.faqs && category.faqs.length > 0 && (
        <Section className="!pt-0" aria-labelledby="category-faq-title">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
              <SectionHeading
                eyebrow="FAQ"
                title={
                  <span id="category-faq-title">{category.title}: frequently asked questions</span>
                }
                description="Answers from our export and regulatory teams."
              />
              <FaqAccordion faqs={category.faqs} />
            </div>
          </Container>
        </Section>
      )}

      {siblings.length > 0 && (
        <Section className="!pt-0" aria-labelledby="related-categories-title">
          <Container>
            <SectionHeading
              eyebrow="Keep exploring"
              title={<span id="related-categories-title">Related categories</span>}
              titleClassName="!text-xl sm:!text-2xl"
              className="mb-5"
            />
            <CategoryStrip categories={siblings} activeId={category.id} showAll={false} />
          </Container>
        </Section>
      )}

      <Section className="!pt-0">
        <Container>
          <CatalogCta
            ctaLabel={labels.ctaLabel}
            listName={labels.listName}
            title={`Need ${category.title.toLowerCase()} for your market?`}
          />
        </Container>
      </Section>
    </>
  )
}
