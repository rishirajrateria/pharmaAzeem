import { ArrowRight, SearchX } from 'lucide-react'
import Link from 'next/link'

import type { Product } from '@/payload-types'
import type { CommerceLabels } from '@/lib/commerce'
import { cn } from '@/lib/utils'

import { Reveal } from '../../ui/Reveal'
import { ProductCard } from '../ProductCard'
import { clearHref, type ParsedFilters } from './parseFilters'

type Props = {
  products: Product[]
  labels: CommerceLabels
  basePath: string
  filters: ParsedFilters
  /** Shown in the empty state so visitors always have somewhere to go. */
  suggestions?: Product[]
  /** Mark the first N card images as high priority (only when nothing else is above the fold). */
  priorityCount?: number
  className?: string
}

/** Responsive 1 / 2 / 3 / 4 column grid of product cards (single column below 420px) with a helpful empty state. */
export function ProductGrid({ products, labels, basePath, filters, suggestions = [], priorityCount = 0, className }: Props) {
  if (products.length === 0) {
    return (
      <div className={cn('space-y-10', className)}>
        <div className="glass relative overflow-hidden rounded-3xl p-8 text-center sm:p-12">
          <div className="absolute inset-0 dots-pattern opacity-50" aria-hidden="true" />
          <div className="relative">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl glass-red text-brand-600">
              <SearchX className="h-7 w-7" aria-hidden="true" />
            </span>
            <h3 className="heading-3 mt-5">No products match {filters.q ? <>“{filters.q}”</> : 'these filters'}</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-600">
              Try a broader search, remove a filter, or tell us what you are looking for – not every formulation in the portfolio is listed online.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {filters.hasFilters && (
                <Link href={clearHref(basePath, filters)} className="btn-primary">
                  Clear all filters
                </Link>
              )}
              <Link href="/products" className="btn-secondary">
                Browse all products
              </Link>
              <Link href="/contact" className="btn-ghost">
                Request a product <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
        {suggestions.length > 0 && (
          <section aria-labelledby="catalog-suggestions">
            <h3 id="catalog-suggestions" className="heading-3">
              You may be looking for
            </h3>
            <ul className="mt-5 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
              {suggestions.slice(0, 4).map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} labels={labels} className="h-full" />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    )
  }

  return (
    <ul className={cn('grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-5 md:grid-cols-3 xl:grid-cols-4', className)} aria-label="Products">
      {products.map((p, i) => (
        <Reveal key={p.id} as="li" delay={Math.min(i, 7) * 60}>
          <ProductCard product={p} labels={labels} priority={i < priorityCount} className="h-full" />
        </Reveal>
      ))}
    </ul>
  )
}
