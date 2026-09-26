import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import type { CommerceLabels } from '@/lib/commerce'
import type { Product } from '@/payload-types'

import { ProductCard } from '../catalog/ProductCard'
import { Button, Container, SectionHeading } from '../ui'
import { Reveal } from '../ui/Reveal'

/** Featured formulations – 1 / 2 / 3 / 4 column glass grid (single column on the narrowest phones). */
export function FeaturedProducts({ products, labels }: { products: Product[]; labels: CommerceLabels }) {
  if (!products.length) return null
  return (
    <section aria-label="Featured products" className="relative pb-16 pt-2 sm:pb-20 lg:pb-28 lg:pt-4">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Featured products"
            title="Formulations our partners order most"
            description="Export-ready generics with complete dossiers, stability data and certificates of analysis available on request."
          />
          <Button variant="secondary" href="/products" className="shrink-0">
            View all products <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
          {products.map((p, i) => (
            <Reveal as="li" key={p.id} delay={(i % 4) * 60} className="flex">
              <ProductCard product={p} labels={labels} className="w-full" />
            </Reveal>
          ))}
        </ul>

        <p className="mt-8 text-center text-sm text-ink-500">
          Add products to your {labels.listName.toLowerCase()} and{' '}
          <Link href="/inquiry" className="font-semibold text-brand-700 underline decoration-brand-300 underline-offset-4 hover:decoration-brand-600">
            request a quotation
          </Link>{' '}
          for pricing, minimum order quantities and lead times.
        </p>
      </Container>
    </section>
  )
}
