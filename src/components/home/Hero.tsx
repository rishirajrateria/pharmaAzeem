import { ArrowRight, BadgeCheck, Globe, ShieldCheck, type LucideIcon } from 'lucide-react'

import type { Certification, Homepage } from '@/payload-types'
import { cn } from '@/lib/utils'

import { Media } from '../Media'
import { Button, Container } from '../ui'
import { HudRings, MoleculeField } from '../visuals/MoleculeField'
import { Orbs } from '../visuals/Orbs'
import { Highlight } from './Highlight'

type Props = {
  hero: Homepage['hero']
  stats?: Homepage['stats']
  certifications: Certification[]
  countryCount: number
}

/** "WHO-GMP Certificate" → "WHO-GMP" for compact trust chips. */
const shortCertName = (title: string) => title.replace(/\s*(certificate|certification)\s*$/i, '').trim()

const FLOAT_POSITIONS = [
  '-left-2 top-[10%] sm:-left-8',
  '-right-2 top-[44%] sm:-right-8 [&>div]:[animation-delay:-3s]',
  'left-[6%] -bottom-3 sm:left-[2%] [&>div]:[animation-delay:-6s]',
]

/**
 * Home hero – full-viewport glass composition. Server component: the only motion is CSS.
 * The image is the single `priority` image on the page (LCP candidate).
 */
export function Hero({ hero, stats, certifications, countryCount }: Props) {
  const primary = hero.primaryCta?.label && hero.primaryCta.url ? hero.primaryCta : null
  const secondary = hero.secondaryCta?.label && hero.secondaryCta.url ? hero.secondaryCta : null

  const countryStat = stats?.find((s) => /countr/i.test(s.label))
  const trust: { icon: LucideIcon; label: string }[] = certifications.slice(0, 2).map((c) => ({ icon: ShieldCheck, label: shortCertName(c.title) }))
  if (trust.length === 0) trust.push({ icon: ShieldCheck, label: 'WHO-GMP certified' }, { icon: BadgeCheck, label: 'ISO 9001:2015' })
  trust.push({
    icon: Globe,
    label: countryStat ? `${countryStat.value}${countryStat.suffix ?? ''} ${countryStat.label.toLowerCase()}` : `${countryCount}+ countries served`,
  })

  const floating = (stats || []).slice(0, 3)

  return (
    <section className="noise relative overflow-hidden" aria-labelledby="hero-title">
      <Orbs variant="intense" />
      <div className="grid-pattern fade-mask-y absolute inset-0 -z-10 opacity-50" aria-hidden="true" />

      <Container className="flex min-h-[88vh] items-center py-14 sm:py-20 lg:py-24">
        <div className="grid w-full items-center gap-16 lg:grid-cols-12 lg:gap-8">
          {/* Copy */}
          <div className="max-w-2xl lg:col-span-6 xl:col-span-6">
            {hero.eyebrow && (
              <p className="chip animate-fade-up !py-1.5 !pl-2 !pr-3.5 shadow-glass">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="absolute inset-0 animate-pulse-ring rounded-full bg-brand-500" />
                  <span className="relative h-2 w-2 rounded-full bg-brand-600" />
                </span>
                {hero.eyebrow}
              </p>
            )}
            <h1 id="hero-title" className="display-1 mt-6 text-ink-950">
              <Highlight text={hero.title} highlight={hero.highlight} />
            </h1>
            {hero.subtitle && <p className="lead mt-6 max-w-xl animate-fade-up [animation-delay:120ms]">{hero.subtitle}</p>}

            {(primary || secondary) && (
              <div className="mt-8 flex flex-wrap items-center gap-3 animate-fade-up [animation-delay:200ms]">
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

            <div className="mt-10 animate-fade-up [animation-delay:280ms]">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-400">Certified, audited and trusted worldwide</p>
              <ul className="mt-3 flex flex-wrap items-center gap-2" aria-label="Certifications and reach">
                {trust.map((t) => (
                  <li key={t.label} className="chip !bg-white/70 !py-1.5 shadow-glass">
                    <t.icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {t.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Visual composition */}
          <div className="relative lg:col-span-6">
            <div className="relative mx-auto aspect-[5/6] w-full max-w-[22rem] sm:max-w-[28rem] lg:max-w-[32rem]">
              <div className="absolute inset-0 scale-[0.72] sm:scale-90 lg:scale-100" aria-hidden="true">
                <HudRings />
              </div>
              <MoleculeField className="absolute -right-6 -top-8 w-52 opacity-80 sm:-right-10 sm:w-72" />
              <div className="absolute -bottom-6 -left-8 h-40 w-40 rounded-full bg-brand-gradient opacity-20 blur-2xl" aria-hidden="true" />

              {/* Rotated glass frame with hero image */}
              <div className="absolute inset-x-[9%] top-[5%] bottom-[5%] animate-float-slow">
                <div className="gradient-border glass h-full rotate-[-4deg] rounded-[2rem] p-2.5 shadow-glass-lg sm:p-3">
                  <div className="relative h-full overflow-hidden rounded-[1.5rem] bg-white">
                    <Media
                      media={hero.image}
                      size="large"
                      fill
                      priority
                      sizes="(max-width: 640px) 85vw, (max-width: 1024px) 60vw, 34vw"
                      className="h-full w-full"
                      imgClassName="object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-white/10" aria-hidden="true" />
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" aria-hidden="true" />
                  </div>
                </div>
              </div>

              {/* Floating stat chips */}
              {floating.map((s, i) => (
                <div key={s.id || i} className={cn('absolute z-10', FLOAT_POSITIONS[i])}>
                  <div className="glass-strong glass-edge animate-float rounded-2xl px-4 py-3 shadow-glass-lg">
                    <p className="text-gradient text-2xl font-semibold leading-none tracking-tight sm:text-3xl">
                      {s.value}
                      {s.suffix}
                    </p>
                    <p className="mt-1.5 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
