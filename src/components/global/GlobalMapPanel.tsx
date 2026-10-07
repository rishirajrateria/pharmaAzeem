import { Globe2, MapPin } from 'lucide-react'

import type { Country } from '@/payload-types'

import { WorldMap, type MapPin as Pin } from '../visuals/WorldMap'
import { countryPath, earliestYear } from './regions'

export const countriesToPins = (countries: Country[]): Pin[] =>
  countries
    .filter((c) => typeof c.lat === 'number' && typeof c.lng === 'number')
    .map((c) => ({
      name: c.name,
      lat: c.lat as number,
      lng: c.lng as number,
      href: countryPath(c),
      featured: Boolean(c.featured),
    }))

/**
 * Full-width bordered panel with the dotted world map, a legend and key figures.
 * Every pin is a link to its country page (crawlable internal links).
 */
export function GlobalMapPanel({
  countries,
  regionCount,
  className,
  headingId = 'map-heading',
}: {
  countries: Country[]
  regionCount: number
  className?: string
  headingId?: string
}) {
  const pins = countriesToPins(countries)
  const featured = countries.filter((c) => c.featured).length
  const since = earliestYear(countries)
  return (
    <section aria-labelledby={headingId} className={className}>
      <div className="border border-ink-200 bg-white p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow mb-2">
              <Globe2 className="h-3.5 w-3.5" aria-hidden="true" /> Export map
            </p>
            <h2 id={headingId} className="heading-3">
              {countries.length} markets across {regionCount} regions
            </h2>
            <p className="mt-1 text-sm text-ink-600">
              Select a pin to open that country&apos;s regulatory and supply overview.
            </p>
          </div>
          <ul
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-600"
            aria-label="Map legend"
          >
            <li className="inline-flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-brand-700" />
              Key market
            </li>
            <li className="inline-flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-brand-500" />
              Active market
            </li>
          </ul>
        </div>

        <div className="mt-6 border-t border-ink-200 pt-6">
          <WorldMap pins={pins} showLabels />
        </div>

        <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-2 border-t border-ink-200 pt-4 text-sm text-ink-600">
          <li>
            <span className="font-semibold text-ink-950">{countries.length}</span> countries served
          </li>
          {featured > 0 && (
            <li>
              <span className="font-semibold text-ink-950">{featured}</span> key markets
            </li>
          )}
          {since && (
            <li className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-brand-700" aria-hidden="true" /> Exporting since{' '}
              <span className="font-semibold text-ink-950">{since}</span>
            </li>
          )}
        </ul>
      </div>
    </section>
  )
}
