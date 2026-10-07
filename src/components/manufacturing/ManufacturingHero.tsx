import { ArrowRight } from 'lucide-react'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Media } from '@/components/Media'
import { Button, Container, Eyebrow } from '@/components/ui'
import { Icon } from '@/components/ui/Icon'
import type { Crumb } from '@/lib/seo'
import { cn } from '@/lib/utils'
import type { Media as MediaDoc } from '@/payload-types'

type Cta = { label?: string | null; url?: string | null } | null | undefined

export type HeroChip = { icon: string; label: string; value: string }

/**
 * Manufacturing hero: breadcrumbs, eyebrow, h1, lead summary, CTAs and key facts on the
 * left; the hero photograph on the right. Server component – zero JS.
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
  const facts = chips.slice(0, 3)

  return (
    <section
      className="border-b border-white/60 bg-white/35 pb-14 pt-6 sm:pb-20 sm:pt-10"
      aria-labelledby="manufacturing-hero-title"
    >
      <Container>
        <Breadcrumbs crumbs={crumbs} className="mb-8 sm:mb-10" />
        <div className={cn('grid items-center gap-12', hasImage && 'lg:grid-cols-12')}>
          <div className={cn(hasImage ? 'lg:col-span-6' : 'max-w-3xl')}>
            {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
            <h1 id="manufacturing-hero-title" className="display-2">
              {title}
            </h1>
            {subtitle && <p className="mt-5 max-w-2xl lead">{subtitle}</p>}
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

            {facts.length > 0 && (
              <dl className="mt-10 grid gap-6 border-t border-ink-200 pt-6 sm:grid-cols-3">
                {facts.map((chip) => (
                  <div key={chip.label} className="flex items-start gap-3">
                    <Icon name={chip.icon} className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-ink-500">
                        {chip.label}
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-ink-950">{chip.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            )}
          </div>

          {hasImage && (
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] overflow-hidden glass overflow-hidden">
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
