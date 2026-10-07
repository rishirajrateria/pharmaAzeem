import { ArrowRight, Building2, ShieldCheck, Users, type LucideIcon } from 'lucide-react'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Media } from '@/components/Media'
import { Button, Container, Eyebrow } from '@/components/ui'
import { HudRings } from '@/components/visuals/MoleculeField'
import { Orbs } from '@/components/visuals/Orbs'
import { cn, mediaAlt } from '@/lib/utils'
import type { AboutPage, SiteSetting } from '@/payload-types'

type Cta = { label?: string | null; url?: string | null } | undefined
const resolveCta = (cta: Cta, fallback: { label: string; url: string }) =>
  cta?.label && cta?.url ? { label: cta.label, url: cta.url } : fallback

function FloatChip({
  icon: IconCmp,
  label,
  value,
  className,
}: {
  icon: LucideIcon
  label: string
  value: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'glass glass-edge absolute z-10 flex items-center gap-3 px-4 py-3 shadow-glass-lg',
        className,
      )}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-brand-gradient text-white shadow-[0_8px_20px_-8px_rgb(225_29_46_/_0.8)]">
        <IconCmp className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="leading-tight">
        <span className="block text-[10px] uppercase tracking-[0.18em] text-ink-500">
          {label}
        </span>
        <span className="block text-sm font-semibold text-ink-950">{value}</span>
      </span>
    </div>
  )
}

type Props = {
  /** May be missing at runtime when the about-page global has never been saved. */
  hero?: AboutPage['hero'] | null
  settings: SiteSetting
  facilityCount: number
  certification?: string | null
}

/**
 * About page hero: eyebrow, h1, lead paragraph, CTAs and the hero image in a floating glass
 * frame with HUD rings and glass "stat chips".
 */
export function AboutHero({ hero, settings, facilityCount, certification }: Props) {
  const title = hero?.title || `About ${settings.siteName}`
  const primary = resolveCta(hero?.primaryCta, { label: 'Talk to our team', url: '/contact' })
  const secondary = resolveCta(hero?.secondaryCta, {
    label: 'Explore manufacturing',
    url: '/manufacturing',
  })
  const imageAlt = `${settings.siteName} team and facilities`

  return (
    <section className="relative overflow-hidden pt-6 sm:pt-10" aria-labelledby="about-hero-title">
      <Orbs variant="intense" />
      <div
        className="pointer-events-none absolute inset-0 -z-10 grid-pattern fade-mask-y opacity-70"
        aria-hidden="true"
      />
      <Container>
        <Breadcrumbs crumbs={[{ name: 'About', path: '/about' }]} />
        <div className="mt-8 grid items-center gap-14 pb-16 sm:pb-20 lg:grid-cols-12 lg:gap-10 lg:pb-28">
          <div className="lg:col-span-6 xl:col-span-6">
            {hero?.eyebrow && <Eyebrow className="animate-fade-up">{hero.eyebrow}</Eyebrow>}
            <h1
              id="about-hero-title"
              className="display-2 mt-4 animate-fade-up [animation-delay:80ms]"
            >
              {title}
            </h1>
            {hero?.subtitle && (
              <p className="lead mt-5 max-w-2xl animate-fade-up [animation-delay:160ms]">
                {hero.subtitle}
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-3 animate-fade-up [animation-delay:240ms]">
              <Button href={primary.url}>
                {primary.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button href={secondary.url} variant="secondary">
                {secondary.label}
              </Button>
            </div>
            <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm animate-fade-up [animation-delay:320ms]">
              {settings.foundingYear && (
                <div className="flex items-baseline gap-2">
                  <dt className="text-[10px] uppercase tracking-[0.18em] text-ink-500">
                    Since
                  </dt>
                  <dd className="font-semibold text-ink-900">{settings.foundingYear}</dd>
                </div>
              )}
              {settings.contact?.address?.city && (
                <div className="flex items-baseline gap-2">
                  <dt className="text-[10px] uppercase tracking-[0.18em] text-ink-500">
                    HQ
                  </dt>
                  <dd className="font-semibold text-ink-900">
                    {[settings.contact.address.city, settings.contact.address.country]
                      .filter(Boolean)
                      .join(', ')}
                  </dd>
                </div>
              )}
              {settings.legalName && (
                <div className="flex items-baseline gap-2">
                  <dt className="text-[10px] uppercase tracking-[0.18em] text-ink-500">
                    Legal entity
                  </dt>
                  <dd className="font-semibold text-ink-900">{settings.legalName}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="relative lg:col-span-6">
            <HudRings className="opacity-80" />
            <div className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-lg">
              <div className="glass glass-edge relative rotate-[-2.5deg] animate-float-slow p-2.5 shadow-glass-lg">
                <Media
                  media={hero?.image}
                  size="large"
                  fill
                  priority
                  alt={mediaAlt(hero?.image, imageAlt)}
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 60vw, 40vw"
                  className="aspect-[4/5] bg-white"
                />
                <div
                  className="pointer-events-none absolute inset-2.5 ring-1 ring-inset ring-white/70"
                  aria-hidden="true"
                />
              </div>
              {certification && (
                <FloatChip
                  icon={ShieldCheck}
                  label="Certified"
                  value={certification}
                  className="left-0 top-6 animate-float sm:-left-8"
                />
              )}
              {settings.employeeCount && (
                <FloatChip
                  icon={Users}
                  label="Team"
                  value={`${settings.employeeCount} people`}
                  className="-right-1 bottom-16 animate-float-slow [animation-delay:-5s] sm:-right-8"
                />
              )}
              {facilityCount > 0 && (
                <FloatChip
                  icon={Building2}
                  label="Infrastructure"
                  value={`${facilityCount} ${facilityCount === 1 ? 'facility' : 'facilities'}`}
                  className="-bottom-5 left-6 animate-float [animation-delay:-3s] sm:left-10"
                />
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
