import { Globe2, MapPin } from 'lucide-react'

import type { Country } from '@/payload-types'
import { cn } from '@/lib/utils'

import { WorldMap, type MapPin as Pin } from '../visuals/WorldMap'
import { countryPath, earliestYear } from './regions'

export const countriesToPins = (countries: Country[]): Pin[] =>
  countries
    .filter((c) => typeof c.lat === 'number' && typeof c.lng === 'number')
    .map((c) => ({ name: c.name, lat: c.lat as number, lng: c.lng as number, href: countryPath(c), featured: Boolean(c.featured) }))

/**
 * Full-width glass panel with the dotted world map, a legend and floating stat chips.
 * Every pin is a link to its country page (crawlable internal links).
 */
export function GlobalMapPanel({ countries, regionCount, className, headingId = 'map-heading' }: { countries: Country[]; regionCount: number; className?: string; headingId?: string }) {
  const pins = countriesToPins(countries)
  const featured = countries.filter((c) => c.featured).length
  const since = earliestYear(countries)
  return (
    <section aria-labelledby={headingId} className={cn('relative', className)}>
      <div className="glass-strong glass-edge noise relative overflow-hidden rounded-4xl p-4 shadow-glass-lg sm:p-6 lg:p-8">
        <div className="pointer-events-none absolute inset-0 dots-pattern opacity-40" aria-hidden="true" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow mb-2">
              <Globe2 className="h-3.5 w-3.5" aria-hidden="true" /> Live export map
            </p>
            <h2 id={headingId} className="heading-3">
              {countries.length} markets across {regionCount} regions
            </h2>
            <p className="mt-1 text-sm text-ink-600">Select a pin to open that country&apos;s regulatory and supply overview.</p>
          </div>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-600" aria-label="Map legend">
            <li className="inline-flex items-center gap-2">
              <span className="relative inline-flex h-3 w-3">
                <span className="absolute inset-0 rounded-full bg-brand-500/60 animate-pulse-ring" />
                <span className="absolute inset-0 rounded-full bg-brand-600 shadow-[0_0_0_2px_white]" />
              </span>
              Key market
            </li>
            <li className="inline-flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-brand-600/80 shadow-[0_0_0_2px_white]" />
              Active market
            </li>
          </ul>
        </div>

        <div className="relative mt-6 rounded-3xl border border-white/70 bg-white/40 p-2 sm:p-4">
          <WorldMap pins={pins} showLabels className="fade-mask-x" />
          {/* Floating stat chips */}
          <div className="pointer-events-none absolute inset-x-4 top-4 hidden justify-between md:flex" aria-hidden="true">
            <span className="glass animate-float rounded-2xl px-3.5 py-2 text-xs font-medium text-ink-800 shadow-glass">
              <span className="text-gradient text-lg font-semibold">{countries.length}</span> countries served
            </span>
            {featured > 0 && (
              <span className="glass animate-float-slow rounded-2xl px-3.5 py-2 text-xs font-medium text-ink-800 shadow-glass">
                <span className="text-gradient text-lg font-semibold">{featured}</span> key markets
              </span>
            )}
          </div>
          {since && (
            <div className="pointer-events-none absolute bottom-4 left-4 hidden md:block" aria-hidden="true">
              <span className="glass animate-float rounded-2xl px-3.5 py-2 text-xs font-medium text-ink-800 shadow-glass" style={{ animationDelay: '-6s' }}>
                <MapPin className="mr-1 inline h-3.5 w-3.5 text-brand-600" /> Exporting since <span className="font-semibold text-ink-950">{since}</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
