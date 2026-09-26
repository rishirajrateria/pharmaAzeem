import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'

import type { Media as MediaDoc } from '@/payload-types'
import type { Crumb } from '@/lib/seo'
import { cn } from '@/lib/utils'

import { Breadcrumbs } from '../../Breadcrumbs'
import { Media } from '../../Media'
import { Button, Eyebrow } from '../../ui'
import { Icon } from '../../ui/Icon'
import { MoleculeField, HudRings } from '../../visuals/MoleculeField'
import { Orbs } from '../../visuals/Orbs'

export type HeroStat = { value: string | number; label: string }
export type HeroCta = { label?: string | null; url?: string | null; variant?: 'primary' | 'secondary' }

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
  /** Icon name shown in the decorative panel when there is no image. */
  icon?: string | null
  className?: string
}

/**
 * Catalogue hero: breadcrumbs, eyebrow, display heading, factual lead, floating stat
 * chips and a glass-framed image (or a molecule panel when no image is set).
 */
export function CatalogHero({ crumbs, eyebrow, title, lead, children, stats = [], ctas = [], image, icon, className }: Props) {
  const hasImage = Boolean(image && typeof image === 'object')
  const actions = ctas.filter((c) => c.label && c.url)
  return (
    <section className={cn('relative overflow-hidden pt-6 pb-12 sm:pt-8 sm:pb-16 lg:pt-12 lg:pb-20', className)} aria-labelledby="catalog-hero-title">
      <Orbs />
      <div className="container-x">
        <Breadcrumbs crumbs={crumbs} />
        <div className="mt-8 grid items-center gap-10 lg:mt-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="max-w-3xl">
            {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
            <h1 id="catalog-hero-title" className="display-2">
              {title}
            </h1>
            {lead && <p className="lead mt-5">{lead}</p>}
            {children && <div className="mt-5">{children}</div>}
            {stats.length > 0 && (
              <dl className="mt-7 flex flex-wrap gap-2.5">
                {stats.map((s) => (
                  <div key={s.label} className="glass flex items-baseline gap-2 rounded-full px-4 py-2">
                    <dt className="order-2 text-xs font-medium text-ink-600">{s.label}</dt>
                    <dd className="order-1 text-base font-semibold text-gradient">{s.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {actions.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
                {actions.map((c, i) => (
                  <Button key={`${c.url}-${i}`} href={c.url as string} variant={c.variant || (i === 0 ? 'primary' : 'secondary')}>
                    {c.label}
                    {i === 0 && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
                  </Button>
                ))}
              </div>
            )}
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <HudRings className="opacity-70" />
            <div className="glass relative animate-float-slow overflow-hidden rounded-[2rem] p-2 shadow-glass-lg lg:rotate-[-2deg]">
              {hasImage ? (
                <Media media={image} size="large" fill priority sizes="(max-width: 1024px) 100vw, 40vw" className="aspect-[5/4] w-full rounded-[1.6rem]" />
              ) : (
                <div className="relative flex aspect-[5/4] w-full items-center justify-center overflow-hidden rounded-[1.6rem] bg-gradient-to-br from-brand-50 via-white to-brand-100">
                  <div className="absolute inset-0 dots-pattern opacity-60" aria-hidden="true" />
                  <MoleculeField className="absolute inset-0 h-full w-full opacity-70" />
                  <span className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-brand-gradient text-white shadow-glow">
                    <Icon name={icon} className="h-12 w-12" />
                  </span>
                </div>
              )}
              <div className="pointer-events-none absolute inset-2 rounded-[1.6rem] bg-gradient-to-t from-white/40 via-transparent to-transparent" aria-hidden="true" />
            </div>
            {stats[0] && (
              <div className="glass-strong absolute -left-3 top-8 hidden animate-float rounded-2xl px-4 py-3 shadow-glass-lg sm:block" aria-hidden="true">
                <p className="text-2xl font-semibold text-gradient">{stats[0].value}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">{stats[0].label}</p>
              </div>
            )}
            {stats[1] && (
              <div className="glass-strong absolute -right-2 bottom-8 hidden animate-float rounded-2xl px-4 py-3 shadow-glass-lg sm:block [animation-delay:-4s]" aria-hidden="true">
                <p className="text-2xl font-semibold text-gradient">{stats[1].value}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">{stats[1].label}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
