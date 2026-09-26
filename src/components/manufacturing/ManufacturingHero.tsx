import { ArrowRight } from 'lucide-react'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Media } from '@/components/Media'
import { Button, Container, Eyebrow } from '@/components/ui'
import { Icon } from '@/components/ui/Icon'
import { HudRings, MoleculeField } from '@/components/visuals/MoleculeField'
import { Orbs } from '@/components/visuals/Orbs'
import type { Crumb } from '@/lib/seo'
import { cn } from '@/lib/utils'
import type { Media as MediaDoc } from '@/payload-types'

type Cta = { label?: string | null; url?: string | null } | null | undefined

export type HeroChip = { icon: string; label: string; value: string }

const CHIP_POSITIONS = [
  '-left-2 top-8 sm:-left-8 sm:top-12',
  '-right-2 bottom-10 sm:-right-8 sm:bottom-16',
  'left-8 -bottom-5 sm:left-12',
]
const CHIP_DELAYS = ['[animation-delay:-2s]', '[animation-delay:-5s]', '[animation-delay:-8s]']

/**
 * Manufacturing hero: ambient orbs + grid, breadcrumbs, eyebrow, h1, lead summary, CTAs and
 * the hero image inside a floating glass frame decorated with a molecule lattice and HUD rings.
 * Server component – zero JS.
 */
export function ManufacturingHero({
  crumbs,
  eyebrow,
  title,
  subtitle,
  image,
  primaryCta,
  secondaryCta,
  fallbackPrimary,
  fallbackSecondary,
  chips = [],
}: {
  crumbs: Crumb[]
  eyebrow?: string | null
  title: string
  subtitle?: string | null
  image?: MediaDoc | number | null
  primaryCta?: Cta
  secondaryCta?: Cta
  fallbackPrimary: { label: string; url: string }
  fallbackSecondary?: { label: string; url: string }
  chips?: HeroChip[]
}) {
  const pick = (cta: Cta, fallback?: { label: string; url: string }) =>
    cta?.label && cta.url ? { label: cta.label, url: cta.url } : fallback
  const primary = pick(primaryCta, fallbackPrimary)
  const secondary = pick(secondaryCta, fallbackSecondary)
  const hasImage = Boolean(image && typeof image === 'object')

  return (
    <section
      className="relative overflow-hidden pb-16 pt-6 sm:pb-24 sm:pt-10 lg:pb-32"
      aria-labelledby="manufacturing-hero-title"
    >
      <Orbs variant="intense" />
      <div
        className="pointer-events-none absolute inset-0 -z-10 grid-pattern fade-mask-y opacity-70"
        aria-hidden="true"
      />
      <Container>
        <Breadcrumbs crumbs={crumbs} className="mb-8 sm:mb-12" />
        <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            {eyebrow && <Eyebrow className="mb-5">{eyebrow}</Eyebrow>}
            <h1 id="manufacturing-hero-title" className="display-2">
              <span className="text-gradient-ink">{title}</span>
            </h1>
            {subtitle && <p className="mt-6 max-w-2xl lead">{subtitle}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              {primary && (
                <Button href={primary.url}>
                  {primary.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              )}
              {secondary && (
                <Button href={secondary.url} variant="secondary">
                  {secondary.label}
                </Button>
              )}
            </div>
          </div>

          <div className="relative lg:col-span-6">
            <HudRings className="hidden lg:flex" />
            {/* Molecule lattice peeking out behind the frame – the "engineered" motif of this page */}
            <div
              className="pointer-events-none absolute -right-10 -top-16 hidden w-72 opacity-60 sm:block lg:-right-16 lg:w-80"
              aria-hidden="true"
            >
              <MoleculeField />
            </div>
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              <div className="glass glass-edge -rotate-2 animate-float-slow rounded-[2rem] p-2.5 shadow-glass-lg sm:p-3">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.6rem] bg-gradient-to-br from-brand-50 via-white to-brand-100">
                  {hasImage ? (
                    <Media
                      media={image}
                      size="large"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="h-full w-full"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                      <div className="absolute inset-0 dots-pattern opacity-70" />
                      <MoleculeField className="relative max-h-full" />
                    </div>
                  )}
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent"
                    aria-hidden="true"
                  />
                  {/* HUD corner ticks */}
                  <span
                    className="pointer-events-none absolute left-3 top-3 h-4 w-4 border-l border-t border-white/80"
                    aria-hidden="true"
                  />
                  <span
                    className="pointer-events-none absolute right-3 top-3 h-4 w-4 border-r border-t border-white/80"
                    aria-hidden="true"
                  />
                  <span
                    className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b border-l border-white/80"
                    aria-hidden="true"
                  />
                  <span
                    className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b border-r border-white/80"
                    aria-hidden="true"
                  />
                </div>
              </div>

              {chips.slice(0, 3).map((chip, i) => (
                <div
                  key={chip.label}
                  className={cn(
                    'absolute z-10 flex items-center gap-3 rounded-2xl glass-strong px-3.5 py-2.5 shadow-glass-lg animate-float',
                    CHIP_POSITIONS[i],
                    CHIP_DELAYS[i],
                  )}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-[0_8px_20px_-8px_rgb(225_29_46_/_0.8)]">
                    <Icon name={chip.icon} className="h-4 w-4" />
                  </span>
                  <span className="pr-1">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                      {chip.label}
                    </span>
                    <span className="block text-sm font-semibold leading-tight text-ink-950">
                      {chip.value}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
