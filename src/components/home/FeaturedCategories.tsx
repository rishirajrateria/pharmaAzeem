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
    <section className="py-14 sm:py-20" aria-labelledby="shop-categories-title">
      <Container>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">Product range</p>
            <h2
              id="shop-categories-title"
              className="text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl"
            >
              Shop by category
            </h2>
            <p className="mt-2 text-base text-ink-500">
              {totalProducts} products across {categories.length} therapeutic categories
            </p>
          </div>
          <Link
            href="/categories"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-brand-700/20 bg-white/60 px-4 py-2 text-sm font-semibold text-brand-700 backdrop-blur transition hover:border-brand-700 hover:bg-white"
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
                className="glass-card lift group flex h-full flex-col items-center px-3 py-6 text-center"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 transition-all duration-300 group-hover:bg-brand-gradient group-hover:text-white group-hover:shadow-[0_12px_22px_-10px_rgb(175_2_1_/_0.7)]">
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
