import { ArrowRight, Layers } from 'lucide-react'
import Link from 'next/link'

import type { CategoryNode } from '@/lib/data'

import { CategoryCard } from '../catalog/CategoryCard'
import { Button, Container, Section, SectionHeading } from '../ui'
import { Reveal } from '../ui/Reveal'

const MAX_TILES = 9

/** Top-level therapeutic categories as glass tiles + a "browse everything" tile. */
export function FeaturedCategories({
  categories,
  totalProducts,
}: {
  categories: CategoryNode[]
  totalProducts: number
}) {
  if (!categories.length) return null
  const shown = categories.slice(0, MAX_TILES)
  const hidden = categories.length - shown.length
  return (
    <Section aria-label="Product categories">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Product range"
            title="Therapeutic categories"
            description="Browse our portfolio by therapeutic area. Every category page lists dosage forms, strengths and registration-ready documentation."
          />
          <Button variant="secondary" href="/products" className="shrink-0">
            Browse all products <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((c, i) => (
            <Reveal as="li" key={c.id} delay={i * 60} className="flex">
              <CategoryCard category={c} compact className="w-full" />
            </Reveal>
          ))}
          <Reveal as="li" delay={shown.length * 60} className="flex">
            <Link
              href="/products"
              className="glass-red group relative flex w-full flex-col justify-between overflow-hidden rounded-3xl p-6 transition-transform duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 sm:p-8"
            >
              <div className="dots-pattern absolute inset-0 opacity-40" aria-hidden="true" />
              <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-[0_10px_24px_-10px_rgb(225_29_46_/_0.8)]">
                <Layers className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="relative mt-8">
                <span className="block text-lg font-semibold text-ink-950">
                  {hidden > 0
                    ? `${hidden} more ${hidden === 1 ? 'category' : 'categories'}`
                    : 'Full catalogue'}
                </span>
                <span className="mt-1 block text-sm text-ink-600">
                  Filter {totalProducts > 0 ? `${totalProducts}+ ` : ''}formulations by dosage form,
                  route and prescription status.
                </span>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                  Explore the catalogue{' '}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </span>
            </Link>
          </Reveal>
        </ul>
      </Container>
    </Section>
  )
}
