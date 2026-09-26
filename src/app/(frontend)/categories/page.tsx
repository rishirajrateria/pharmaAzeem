import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { FaqAccordion } from '@/components/FaqAccordion'
import { CategoryCard } from '@/components/catalog/CategoryCard'
import { CatalogCta } from '@/components/catalog/filters/CatalogCta'
import { CatalogHero } from '@/components/catalog/filters/CatalogHero'
import { countDescendants, flatten, joinProse } from '@/components/catalog/filters/tree'
import { JsonLd } from '@/components/seo/JsonLd'
import { Container, Section, SectionHeading } from '@/components/ui'
import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import { getCommerceLabels } from '@/lib/commerce'
import { getAllProductsSlim, getCategoryTree, getProductFacets, getSiteSettings } from '@/lib/data'
import { buildMetadata, graph, itemListJsonLd, siteName, webPageJsonLd } from '@/lib/seo'
import { mediaUrl } from '@/lib/utils'

export const revalidate = 3600

const BASE = '/categories'
const TITLE = 'Medicine categories'

const FAQS = [
  {
    question: 'How is the product catalogue organised?',
    answer:
      'Products are grouped by therapeutic area (for example Antibiotics, Cardiovascular or Diabetes) and then into sub-categories by drug class. Every category page lists all products in that area, including those in its sub-categories, with filters for dosage form, prescription status and route of administration.',
  },
  {
    question: 'Can a product appear in more than one category?',
    answer:
      'Yes. A fixed-dose combination or a multi-indication molecule can be assigned to several categories so you find it wherever you look. Each product still has a single canonical product page.',
  },
  {
    question: 'What if I cannot find a molecule or dosage form?',
    answer:
      'Not every formulation in our portfolio is published online. Send the molecule, strength, dosage form and destination market through the contact page and our export team will confirm availability or evaluate development.',
  },
]

export async function generateMetadata(): Promise<Metadata> {
  const [settings, tree, all] = await Promise.all([getSiteSettings(), getCategoryTree(), getAllProductsSlim()])
  const name = siteName(settings)
  return buildMetadata({
    settings,
    path: BASE,
    title: `${TITLE} – Browse ${name} products by therapeutic area`,
    description: `Explore ${all.length} ${name} medicines across ${tree.length} therapeutic categories and ${countDescendants(tree)} sub-categories – ${joinProse(tree.slice(0, 5).map((c) => c.title.toLowerCase()), 5)} and more.`,
  })
}

/** /categories – overview of the whole category tree. Static, revalidated hourly and on content change. */
export default async function CategoriesIndexPage() {
  const [settings, tree, all, facets] = await Promise.all([getSiteSettings(), getCategoryTree(), getAllProductsSlim(), getProductFacets()])
  const labels = getCommerceLabels(settings)
  const name = siteName(settings)
  const subCount = countDescendants(tree)
  const forms = joinProse(
    facets.dosageForm.map((f) => f.value.toLowerCase()),
    4,
  )
  const description = `${name} manufactures and exports ${all.length} generic medicines organised into ${tree.length} therapeutic categories and ${subCount} sub-categories${forms ? `, available as ${forms}` : ''}. Choose a category to see its products, filters and documentation.`
  const lastModified = flatten(tree)
    .map((c) => c.updatedAt)
    .sort()
    .at(-1)

  return (
    <>
      <JsonLd
        data={graph(
          webPageJsonLd({ path: BASE, name: TITLE, description, type: 'CollectionPage', dateModified: lastModified }),
          itemListJsonLd(
            tree.map((c) => ({ name: c.title, path: `/categories/${c.path}`, image: mediaUrl(c.image, 'card') })),
            `${name} product categories`,
          ),
        )}
      />

      <CatalogHero
        crumbs={[
          { name: 'Products', path: '/products' },
          { name: 'Categories', path: BASE },
        ]}
        eyebrow="Catalogue"
        title={TITLE}
        lead={`Browse ${name}'s portfolio by therapeutic area – every category has its own filters, documentation and specialist contact.`}
        stats={[
          { value: tree.length, label: 'therapeutic categories' },
          { value: subCount, label: 'sub-categories' },
          { value: all.length, label: 'products' },
        ]}
        ctas={[
          { label: 'View all products', url: '/products', variant: 'primary' },
          { label: labels.ctaLabel, url: '/inquiry', variant: 'secondary' },
        ]}
        icon="layers"
      >
        <p className="max-w-2xl text-[15px] leading-relaxed text-ink-600">{description}</p>
      </CatalogHero>

      <Section className="!pt-0" aria-labelledby="categories-grid-title">
        <Container>
          <SectionHeading eyebrow="Therapeutic areas" title={<span id="categories-grid-title">Choose a category</span>} description="Each tile shows the number of products in that area and its most important sub-categories." />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tree.map((c, i) => (
              <Reveal key={c.id} as="li" delay={Math.min(i, 8) * 60}>
                <CategoryCard category={c} className="h-full" />
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      <Section className="!pt-0" aria-labelledby="category-index-title">
        <Container>
          <div className="glass relative overflow-hidden rounded-[2.25rem] p-6 sm:p-10 lg:p-12">
            <div className="absolute inset-0 grid-pattern opacity-40 fade-mask-y" aria-hidden="true" />
            <div className="relative">
              <SectionHeading eyebrow="Complete index" title={<span id="category-index-title">Every category and sub-category</span>} description="A full A–Z map of the catalogue – useful when you already know the drug class you are sourcing." />
              <div className="mt-10 columns-1 gap-8 sm:columns-2 lg:columns-3 [&>*]:break-inside-avoid">
                {tree.map((c) => (
                  <div key={c.id} className="mb-8">
                    <h3 className="flex items-center gap-2.5 text-base font-semibold text-ink-950">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white">
                        <Icon name={c.icon} className="h-4 w-4" />
                      </span>
                      <Link href={`/categories/${c.path}`} className="hover:text-brand-700">
                        {c.title}
                      </Link>
                      <span className="font-mono text-[11px] font-medium text-ink-400">{c.productCount}</span>
                    </h3>
                    {c.children.length > 0 && (
                      <ul className="mt-2.5 space-y-1.5 border-l border-brand-200/70 pl-4">
                        {c.children.map((s) => (
                          <li key={s.id}>
                            <Link href={`/categories/${s.path}`} className="inline-flex items-center gap-2 text-sm text-ink-700 hover:text-brand-700">
                              {s.title}
                              <span className="font-mono text-[10px] text-ink-400">{s.productCount}</span>
                            </Link>
                            {s.children.length > 0 && (
                              <ul className="mt-1 space-y-1 pl-4">
                                {s.children.map((t) => (
                                  <li key={t.id}>
                                    <Link href={`/categories/${t.path}`} className="text-xs text-ink-600 hover:text-brand-700">
                                      {t.title}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
              <Link href="/products" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline">
                Or browse the whole catalogue with filters <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="!pt-0" aria-labelledby="categories-faq-title">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <SectionHeading eyebrow="FAQ" title={<span id="categories-faq-title">How the catalogue works</span>} description="Quick answers for buyers navigating the range for the first time." />
            <FaqAccordion faqs={FAQS} />
          </div>
        </Container>
      </Section>

      <Section className="!pt-0">
        <Container>
          <CatalogCta ctaLabel={labels.ctaLabel} listName={labels.listName} />
        </Container>
      </Section>
    </>
  )
}
