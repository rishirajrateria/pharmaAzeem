import { ArrowRight } from 'lucide-react'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Media } from '@/components/Media'
import { Button, Container, Eyebrow } from '@/components/ui'
import { cn, mediaAlt } from '@/lib/utils'
import type { AboutPage, SiteSetting } from '@/payload-types'

type Cta = { label?: string | null; url?: string | null } | undefined
const resolveCta = (cta: Cta, fallback: { label: string; url: string }) =>
  cta?.label && cta?.url ? { label: cta.label, url: cta.url } : fallback

type Props = {
  /** May be missing at runtime when the about-page global has never been saved. */
  hero?: AboutPage['hero'] | null
  settings: SiteSetting
  facilityCount: number
  certification?: string | null
}

/**
 * About page hero: breadcrumbs, eyebrow, h1, lead paragraph, CTAs and key facts on the left;
 * the hero photograph on the right (copy spans max-w-3xl when there is no image).
 * Server component – zero JS.
 */
export function AboutHero({ hero, settings, facilityCount, certification }: Props) {
  const title = hero?.title || `About ${settings.siteName}`
  const primary = resolveCta(hero?.primaryCta, { label: 'Talk to our team', url: '/contact' })
  const secondary = resolveCta(hero?.secondaryCta, {
    label: 'Explore manufacturing',
    url: '/manufacturing',
  })
  const imageAlt = `${settings.siteName} team and facilities`
  const hasImage = Boolean(hero?.image && typeof hero.image === 'object')
  const hq = [settings.contact?.address?.city, settings.contact?.address?.country]
    .filter(Boolean)
    .join(', ')

  const facts = [
    settings.foundingYear ? { label: 'Since', value: String(settings.foundingYear) } : null,
    settings.contact?.address?.city ? { label: 'Headquarters', value: hq } : null,
    certification ? { label: 'Certified', value: certification } : null,
    facilityCount > 0
      ? {
          label: 'Infrastructure',
          value: `${facilityCount} ${facilityCount === 1 ? 'facility' : 'facilities'}`,
        }
      : null,
  ].filter((f): f is { label: string; value: string } => Boolean(f))

  return (
    <section
      className="border-b border-white/60 bg-white/35 pb-14 pt-6 sm:pb-20 sm:pt-10"
      aria-labelledby="about-hero-title"
    >
      <Container>
        <Breadcrumbs crumbs={[{ name: 'About', path: '/about' }]} className="mb-8 sm:mb-10" />
        <div className={cn('grid items-center gap-12', hasImage && 'lg:grid-cols-12')}>
          <div className={cn(hasImage ? 'lg:col-span-6' : 'max-w-3xl')}>
            {hero?.eyebrow && <Eyebrow className="mb-4">{hero.eyebrow}</Eyebrow>}
            <h1 id="about-hero-title" className="display-2">
              {title}
            </h1>
            {hero?.subtitle && <p className="lead mt-5 max-w-2xl">{hero.subtitle}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={primary.url}>
                {primary.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button href={secondary.url} variant="secondary">
                {secondary.label}
              </Button>
            </div>

            {facts.length > 0 && (
              <dl className="mt-10 grid gap-6 border-t border-ink-200 pt-6 sm:grid-cols-2">
                {facts.map((f) => (
                  <div key={f.label}>
                    <dt className="text-xs uppercase tracking-wider text-ink-500">{f.label}</dt>
                    <dd className="mt-1 text-sm font-semibold text-ink-950">{f.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          {hasImage && (
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] overflow-hidden glass">
                <Media
                  media={hero?.image}
                  size="large"
                  fill
                  priority
                  alt={mediaAlt(hero?.image, imageAlt)}
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
