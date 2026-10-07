import Link from 'next/link'

import mapMeta from '@/data/world-map.json'
import type { Country } from '@/payload-types'
import { cn } from '@/lib/utils'

import { projectPin } from '../visuals/WorldMap'
import { countryPath } from './regions'

const FRAME_ASPECT = 4 / 3
const ZOOM = 2.6

const pct = (s: string) => parseFloat(s) / 100
const clamp = (v: number, lo: number, hi: number) => (lo > hi ? 0.5 : Math.min(hi, Math.max(lo, v)))

/**
 * Bordered card showing the shared dotted world map zoomed in on one country.
 * The static SVG is translated/scaled around the pin (pure CSS transform, no JS);
 * neighbouring markets in the same region appear as small linked pins for context.
 */
export function CountryMapCard({
  country,
  siblings = [],
  className,
}: {
  country: Country
  siblings?: Country[]
  className?: string
}) {
  const hasPin = typeof country.lat === 'number' && typeof country.lng === 'number'
  const mapAspect = mapMeta.width / mapMeta.height
  const h = FRAME_ASPECT / mapAspect // un-scaled map height as a fraction of the frame height
  const sh = ZOOM * h // scaled map height in frame units

  const pos = hasPin
    ? projectPin(country.lat as number, country.lng as number)
    : { left: '50%', top: '50%' }
  const px = pct(pos.left)
  const py = pct(pos.top)
  // Keep the map covering the frame where possible, but never push the pin (and its label) into the frame edges.
  const tx = Math.min(0.82, Math.max(0.18, clamp(0.5, 1 - (1 - px) * ZOOM, px * ZOOM)))
  const ty = Math.min(0.8, Math.max(0.2, clamp(0.5, 1 - (1 - py) * sh, py * sh)))
  const yCur = (1 - h) / 2 + py * h
  const transform = `translate(${((tx - px) * 100).toFixed(3)}%, ${(((ty - yCur) / h) * 100).toFixed(3)}%) scale(${ZOOM})`
  const transformOrigin = `${(px * 100).toFixed(3)}% ${(py * 100).toFixed(3)}%`

  const neighbours = siblings
    .filter((s) => s.id !== country.id && typeof s.lat === 'number' && typeof s.lng === 'number')
    .map((s) => {
      const p = projectPin(s.lat as number, s.lng as number)
      const x = tx + (pct(p.left) - px) * ZOOM
      const y = ty + (pct(p.top) - py) * sh
      return { country: s, x, y }
    })
    .filter(({ x, y }) => x > 0.04 && x < 0.96 && y > 0.06 && y < 0.94)

  return (
    <div className={cn('overflow-hidden border border-ink-200 bg-white', className)}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/world-dots.svg"
            alt=""
            width={mapMeta.width * 8}
            height={mapMeta.height * 8}
            className="h-auto w-full select-none"
            style={{ transform, transformOrigin }}
            decoding="async"
            draggable={false}
          />
        </div>

        {neighbours.map(({ country: s, x, y }) => (
          <Link
            key={s.id}
            href={countryPath(s)}
            title={s.name}
            aria-label={`${s.name} market`}
            className="group absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ left: `${(x * 100).toFixed(2)}%`, top: `${(y * 100).toFixed(2)}%` }}
          >
            <span className="absolute inset-0.5 rounded-full border border-white bg-brand-500 transition-colors group-hover:bg-brand-700 group-focus-visible:bg-brand-700" />
            <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap border border-ink-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-ink-800 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100">
              {s.name}
            </span>
          </Link>
        ))}

        {hasPin && (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${(tx * 100).toFixed(2)}%`, top: `${(ty * 100).toFixed(2)}%` }}
          >
            <span className="block h-4 w-4 rounded-full border-2 border-white bg-brand-700" />
            <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap border border-ink-200 bg-white px-2.5 py-1 text-xs font-semibold text-ink-950">
              <span aria-hidden="true">{country.flag} </span>
              {country.name}
            </span>
          </div>
        )}

        {!hasPin && (
          <p className="absolute inset-x-0 bottom-4 text-center text-xs text-ink-500">
            Map coordinates not set for {country.name} yet.
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-ink-200 px-4 py-2.5 text-xs text-ink-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-brand-700" /> {country.name}
        </span>
        {neighbours.length > 0 && (
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-brand-500" /> Other markets nearby
          </span>
        )}
      </div>
    </div>
  )
}
