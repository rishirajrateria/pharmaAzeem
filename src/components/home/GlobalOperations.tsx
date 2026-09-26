import { ArrowRight, Globe, MapPin } from 'lucide-react'
import Link from 'next/link'

import type { Country, Homepage } from '@/payload-types'

import { Button, Container } from '../ui'
import { Reveal } from '../ui/Reveal'
import { WorldMap, type MapPin as Pin } from '../visuals/WorldMap'
import { REGION_ORDER, regionLabel } from './regions'

/** Dark "worldwide operations" band with the interactive dotted map, region chips and featured country links. */
export function GlobalOperations({
  section,
  countries,
}: {
  section?: Homepage['globalSection']
  countries: Country[]
}) {
  if (!countries.length && !section?.heading) return null

  const pins: Pin[] = countries
    .filter((c) => typeof c.lat === 'number' && typeof c.lng === 'number')
    .map((c) => ({
      name: c.name,
      lat: c.lat as number,
      lng: c.lng as number,
      href: `/global-presence/${c.slug}`,
      featured: Boolean(c.featured),
    }))

  const regionCounts = new Map<string, number>()
  countries.forEach((c) => regionCounts.set(c.region, (regionCounts.get(c.region) ?? 0) + 1))
  const regions = [...regionCounts.entries()].sort(
    (a, b) => REGION_ORDER.indexOf(a[0]) - REGION_ORDER.indexOf(b[0]),
  )
  const featured = countries.filter((c) => c.featured).slice(0, 10)

  return (
    <section
      className="mesh-bg-dark relative overflow-hidden text-white"
      aria-labelledby="global-title"
    >
      <div className="dots-pattern absolute inset-0 opacity-30" aria-hidden="true" />
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/60 to-transparent"
        aria-hidden="true"
      />

      <Container className="section-y relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-5">
            <p className="inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-brand-300">
              <Globe className="h-3.5 w-3.5" aria-hidden="true" />
              {section?.eyebrow || 'Worldwide operations'}
            </p>
            <h2 id="global-title" className="heading-2 mt-4 text-white">
              {section?.heading || `Delivering quality medicines to ${countries.length}+ countries`}
            </h2>
            {section?.body && (
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">{section.body}</p>
            )}

            <dl className="mt-8 grid grid-cols-2 gap-3 sm:max-w-sm">
              <div className="glass-dark flex flex-col rounded-2xl px-4 py-3">
                <dt className="order-2 mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">
                  Countries served
                </dt>
                <dd className="order-1 text-3xl font-semibold tracking-tight text-white">
                  {countries.length}
                </dd>
              </div>
              <div className="glass-dark flex flex-col rounded-2xl px-4 py-3">
                <dt className="order-2 mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">
                  Regions
                </dt>
                <dd className="order-1 text-3xl font-semibold tracking-tight text-white">
                  {regions.length}
                </dd>
              </div>
            </dl>

            <div className="mt-8">
              <Button href="/global-presence">
                Explore our global presence <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-7">
            <div className="glass-dark relative rounded-[2rem] p-3 sm:p-5">
              <div
                className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
                aria-hidden="true"
              />
              <WorldMap pins={pins} showLabels />
              <p className="mt-3 flex items-center justify-center gap-2 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">
                <MapPin className="h-3 w-3" aria-hidden="true" /> Highlighted markets link to a
                dedicated country page
              </p>
            </div>
          </Reveal>
        </div>

        {regions.length > 0 && (
          <Reveal delay={160} className="mt-12">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
              Regions we export to
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {regions.map(([region, count]) => (
                <li key={region}>
                  <Link
                    href="/global-presence"
                    className="glass-dark inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-white/90 transition hover:border-brand-400/60 hover:text-white"
                  >
                    {regionLabel(region)}
                    <span className="rounded-full bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-white/70">
                      {count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {featured.length > 0 && (
          <Reveal delay={220} className="mt-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
              Key markets
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {featured.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/global-presence/${c.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/85 transition hover:border-brand-400/70 hover:bg-brand-600/20 hover:text-white"
                  >
                    {c.flag && (
                      <span aria-hidden="true" className="text-sm leading-none">
                        {c.flag}
                      </span>
                    )}
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </Container>
    </section>
  )
}
