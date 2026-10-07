import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import type { CommerceLabels } from '@/lib/commerce'
import type { Product } from '@/payload-types'

import { ProductCard } from '../catalog/ProductCard'
import { Container } from '../ui'

/** Best-selling products – store grid of 1 / 2 / 3 / 4 columns (single column on the narrowest phones). */
export function FeaturedProducts({
  products,
  labels,
}: {
  products: Product[]
  labels: CommerceLabels
}) {
  if (!products.length) return null
  return (
    <section aria-labelledby="featured-products-title" className="bg-surface-2 py-12 sm:py-14">
      <Container>
        <div className="flex items-end justify-between gap-4 border-b border-ink-200 pb-4">
          <div>
            <h2 id="featured-products-title" className="text-2xl font-semibold text-ink-950">
              Best-selling products
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              Export-ready generics with dossiers, stability data and CoA on request
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline"
          >
            Shop all products <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <ul className="mt-6 grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <li key={p.id} className="flex">
              <ProductCard product={p} labels={labels} className="w-full" />
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center text-sm text-ink-600">
          Add products to your {labels.listName.toLowerCase()} and{' '}
          <Link
            href="/inquiry"
            className="font-semibold text-brand-700 underline decoration-brand-300 underline-offset-4 hover:decoration-brand-600"
          >
            request a quote
          </Link>{' '}
          for pricing, minimum order quantities and lead times.
        </p>
      </Container>
    </section>
  )
}
