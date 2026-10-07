import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'

import type { Media as MediaDoc } from '@/payload-types'
import type { Crumb } from '@/lib/seo'
import { cn } from '@/lib/utils'

import { Breadcrumbs } from '../../Breadcrumbs'
import { Media } from '../../Media'
import { Button, Container, Eyebrow } from '../../ui'

export type HeroStat = { value: string | number; label: string }
export type HeroCta = {
  label?: string | null
  url?: string | null
  variant?: 'primary' | 'secondary'
}

type Props = {
  crumbs: Crumb[]
  eyebrow?: string | null
  title: string
  /** One-sentence lead directly under the h1. */
  lead?: string | null
  /** Optional longer summary / intro (rich text, chips…) rendered under the lead. */
  children?: ReactNode
  stats?: HeroStat[]
  ctas?: HeroCta[]
  image?: MediaDoc | number | null
  /** Store-style title bar for listing pages: no image or CTAs, products start right below. */
  compact?: boolean
  className?: string
}

/**
 * Catalogue hero: breadcrumbs, eyebrow, display heading, factual lead, CTAs and a key-figures
 * row on the left; the hero photograph on the right (copy only when no image is set).
 */
export function CatalogHero({
  crumbs,
  eyebrow,
  title,
  lead,
  children,
  stats = [],
  ctas = [],
  image,
  compact,
  className,
}: Props) {
  if (compact) {
    return (
      <section
        className={cn('border-b border-white/60 bg-white/35 py-5 sm:py-6', className)}
        aria-labelledby="catalog-hero-title"
      >
        <Container>
          <Breadcrumbs crumbs={crumbs} className="mb-3" />
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-8">
            <div className="max-w-3xl">
              <h1
                id="catalog-hero-title"
                className="text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl"
              >
                {title}
              </h1>
              {lead && <p className="mt-1.5 line-clamp-2 text-sm text-ink-600">{lead}</p>}
            </div>
            {stats.length > 0 && (
              <p className="shrink-0 text-sm text-ink-500">
                {stats.map((s, i) => (
                  <span key={s.label}>
                    {i > 0 && <span className="px-2 text-ink-300">|</span>}
                    <span className="font-semibold text-ink-900">{s.value}</span> {s.label}
                  </span>
                ))}
              </p>
            )}
          </div>
          {children && <div className="mt-4">{children}</div>}
        </Container>
      </section>
    )
  }
  const hasImage = Boolean(image && typeof image === 'object')
  const actions = ctas.filter((c) => c.label && c.url)
  return (
    <section
      className={cn('border-b border-white/60 bg-white/35 pb-14 pt-6 sm:pb-20 sm:pt-10', className)}
      aria-labelledby="catalog-hero-title"
    >
      <Container>
        <Breadcrumbs crumbs={crumbs} className="mb-8 sm:mb-10" />
        <div className={cn('grid items-center gap-12', hasImage && 'lg:grid-cols-12')}>
          <div className={cn(hasImage ? 'lg:col-span-6' : 'max-w-3xl')}>
            {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
            <h1 id="catalog-hero-title" className="display-2">
              {title}
            </h1>
            {lead && <p className="lead mt-5 max-w-2xl">{lead}</p>}
            {children && <div className="mt-5">{children}</div>}
            {actions.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
                {actions.map((c, i) => (
                  <Button
                    key={`${c.url}-${i}`}
                    href={c.url as string}
                    variant={c.variant || (i === 0 ? 'primary' : 'secondary')}
                  >
                    {c.label}
                    {i === 0 && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
                  </Button>
                ))}
              </div>
            )}
            {stats.length > 0 && (
              <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-ink-200 pt-6">
                {stats.map((s) => (
                  <div key={s.label} className="flex flex-col">
                    <dt className="order-2 mt-1 text-xs uppercase tracking-wider text-ink-500">
                      {s.label}
                    </dt>
                    <dd className="order-1 text-2xl font-semibold text-ink-950">{s.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          {hasImage && (
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] overflow-hidden glass">
                <Media
                  media={image}
                  size="large"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="h-full w-full"
                />
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
