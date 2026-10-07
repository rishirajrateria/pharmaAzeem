import { ArrowRight, Globe, ShieldCheck, type LucideIcon } from 'lucide-react'

import type { Certification, Homepage } from '@/payload-types'

import { Media } from '../Media'
import { Button, Container, Eyebrow } from '../ui'
import { Highlight } from './Highlight'

type Props = {
  hero: Homepage['hero']
  stats?: Homepage['stats']
  certifications: Certification[]
  countryCount: number
}

/** "WHO-GMP Certificate" → "WHO-GMP" for compact trust labels. */
const shortCertName = (title: string) =>
  title.replace(/\s*(certificate|certification)\s*$/i, '').trim()

/**
 * Home hero – copy on the left, the hero photograph on the right. Server component.
 * The image is the single `priority` image on the page (LCP candidate).
 */
export function Hero({ hero, stats, certifications, countryCount }: Props) {
  const primary = hero.primaryCta?.label && hero.primaryCta.url ? hero.primaryCta : null
  const secondary = hero.secondaryCta?.label && hero.secondaryCta.url ? hero.secondaryCta : null

  // Trust labels come only from CMS data (featured certifications + the countries stat) – never hard-coded claims.
  const countryStat = stats?.find((s) => /countr/i.test(s.label))
  const trust: { icon: LucideIcon; label: string }[] = certifications
    .slice(0, 2)
    .map((c) => ({ icon: ShieldCheck, label: shortCertName(c.title) }))
  if (countryStat)
    trust.push({
      icon: Globe,
      label: `${countryStat.value}${countryStat.suffix ?? ''} ${countryStat.label.toLowerCase()}`,
    })
  else if (countryCount > 0) trust.push({ icon: Globe, label: `${countryCount}+ countries served` })

  return (
    <section className="border-b border-ink-200 bg-surface-2" aria-labelledby="hero-title">
      <Container className="py-14 sm:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            {hero.eyebrow && <Eyebrow>{hero.eyebrow}</Eyebrow>}
            <h1 id="hero-title" className="display-1 mt-4">
              <Highlight text={hero.title} highlight={hero.highlight} />
            </h1>
            {hero.subtitle && <p className="lead mt-5 max-w-xl">{hero.subtitle}</p>}

            {(primary || secondary) && (
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {primary && (
                  <Button href={primary.url!} size="lg">
                    {primary.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                )}
                {secondary && (
                  <Button href={secondary.url!} variant="secondary" size="lg">
                    {secondary.label}
                  </Button>
                )}
              </div>
            )}

            {trust.length > 0 && (
              <ul
                className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-ink-200 pt-6 text-sm text-ink-600"
                aria-label="Certifications and reach"
              >
                {trust.map((t) => (
                  <li key={t.label} className="inline-flex items-center gap-2">
                    <t.icon className="h-4 w-4 text-brand-700" aria-hidden="true" />
                    {t.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden border border-ink-200 bg-white">
              <Media
                media={hero.image}
                size="large"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-full w-full"
                imgClassName="object-cover"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
