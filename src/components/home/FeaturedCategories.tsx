import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import type { CategoryNode } from '@/lib/data'

import { Container } from '../ui'
import { Icon } from '../ui/Icon'

/** "Shop by category" – compact store tiles for every top-level therapeutic category. */
export function FeaturedCategories({
  categories,
  totalProducts,
}: {
  categories: CategoryNode[]
  totalProducts: number
}) {
  if (!categories.length) return null
  return (
    <section className="py-12 sm:py-14" aria-labelledby="shop-categories-title">
      <Container>
        <div className="flex items-end justify-between gap-4 border-b border-ink-200 pb-4">
          <div>
            <h2 id="shop-categories-title" className="text-2xl font-semibold text-ink-950">
              Shop by category
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              {totalProducts} products across {categories.length} therapeutic categories
            </p>
          </div>
          <Link
            href="/categories"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline"
          >
            View all <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {categories.map((c) => (
            <li key={c.id}>
              <Link
                prefetch={false}
                href={`/categories/${c.path}`}
                className="group flex h-full flex-col items-center border border-ink-200 bg-white px-3 py-5 text-center transition-colors hover:border-brand-700"
              >
                <span className="flex h-14 w-14 items-center justify-center bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-700 group-hover:text-white">
                  <Icon name={c.icon} className="h-6 w-6" />
                </span>
                <span className="mt-3 text-sm font-semibold leading-snug text-ink-950">
                  {c.title}
                </span>
                <span className="mt-1 text-xs text-ink-500">{c.productCount} products</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
