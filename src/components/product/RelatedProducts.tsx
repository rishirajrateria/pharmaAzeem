import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { ProductCard } from '@/components/catalog/ProductCard'
import { Container, Section, SectionHeading } from '@/components/ui'
import { Reveal } from '@/components/ui/Reveal'
import type { CommerceLabels } from '@/lib/commerce'
import type { Category, Product } from '@/payload-types'

/** "You may also need" – hand-picked or same-category suggestions. */
export function RelatedProducts({
  products,
  labels,
}: {
  products: Product[]
  labels: CommerceLabels
}) {
  if (!products.length) return null
  return (
    <Section aria-labelledby="related-heading" className="!pt-0">
      <Container>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Related products"
            title={<span id="related-heading">You may also need</span>}
            description="Related products from the same therapeutic range."
          />
          <Link href="/products" className="btn-secondary shrink-0">
            Browse full catalogue <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <ul className="grid grid-cols-2 gap-2.5 sm:gap-5 md:grid-cols-3 xl:grid-cols-4" role="list">
          {products.map((p, i) => (
            <Reveal as="li" key={p.id} delay={i * 60}>
              <ProductCard product={p} labels={labels} className="h-full" />
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  )
}

/** "More in {category}" – link row to every category the product belongs to (plus parents). */
export function MoreInCategory({ categories }: { categories: Category[] }) {
  const cats = categories.filter((c) => c.path)
  if (!cats.length) return null
  return (
    <Section aria-labelledby="more-in-heading" className="!pt-0">
      <Container>
        <div className="glass glass-edge relative overflow-hidden p-5 sm:p-6">
          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 id="more-in-heading" className="text-sm font-semibold text-ink-950">
              Explore more from the range
            </h2>
            <ul className="flex flex-wrap gap-2" role="list">
              {cats.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/categories/${c.path}`}
                    className="chip !py-1.5 hover:border-brand-400 hover:bg-white"
                  >
                    More in {c.title} <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/products"
                  className="chip !border-ink-200 !py-1.5 !text-ink-700 hover:!border-brand-400 hover:bg-white"
                >
                  All products
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  )
}
