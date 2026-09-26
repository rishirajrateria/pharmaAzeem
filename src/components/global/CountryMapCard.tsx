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
 * Glass card showing the shared dotted world map zoomed in on one country.
 * The static SVG is translated/scaled around the pin (pure CSS transform, no JS);
 * neighbouring markets in the same region appear as small linked pins for context.
 */
export function CountryMapCard({ country, siblings = [], className }: { country: Country; siblings?: Country[]; className?: string }) {
  const hasPin = typeof country.lat === 'number' && typeof country.lng === 'number'
  const mapAspect = mapMeta.width / mapMeta.height
  const h = FRAME_ASPECT / mapAspect // un-scaled map height as a fraction of the frame height
  const sh = ZOOM * h // scaled map height in frame units

  const pos = hasPin ? projectPin(country.lat as number, country.lng as number) : { left: '50%', top: '50%' }
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
    <div className={cn('glass-strong glass-edge relative overflow-hidden rounded-4xl p-2 shadow-glass-lg sm:p-3', className)}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-to-br from-white/80 via-brand-50/60 to-white/60">
        <div className="pointer-events-none absolute inset-0 grid-pattern opacity-50" aria-hidden="true" />
        <div className="fade-mask-y absolute inset-0 flex items-center" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/world-dots.svg"
            alt=""
            width={mapMeta.width * 8}
            height={mapMeta.height * 8}
            className="h-auto w-full select-none opacity-90"
            style={{ transform, transformOrigin }}
            loading="lazy"
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
            <span className="absolute inset-0.5 rounded-full bg-brand-500/70 shadow-[0_0_0_2px_white] transition group-hover:bg-brand-600" />
            <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-full glass px-2 py-0.5 text-[10px] font-medium text-ink-800 opacity-0 transition group-hover:opacity-100">{s.name}</span>
          </Link>
        ))}

        {hasPin && (
          <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${(tx * 100).toFixed(2)}%`, top: `${(ty * 100).toFixed(2)}%` }}>
            <span className="relative block h-5 w-5">
              <span className="absolute inset-0 rounded-full bg-brand-500/60 animate-pulse-ring" />
              <span className="absolute inset-0 rounded-full bg-brand-500/40 animate-pulse-ring" style={{ animationDelay: '-1.2s' }} />
              <span className="absolute inset-1 rounded-full bg-brand-600 shadow-[0_0_0_3px_white,0_0_18px_rgb(225_29_46_/_0.8)]" />
            </span>
            <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full glass-strong px-3 py-1 text-xs font-semibold text-ink-950 shadow-glass">
              <span aria-hidden="true">{country.flag} </span>
              {country.name}
            </span>
          </div>
        )}

        {!hasPin && (
          <p className="absolute inset-x-0 bottom-4 text-center text-xs text-ink-500">Map coordinates not set for {country.name} yet.</p>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 px-2 pb-1 pt-3 text-[11px] text-ink-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-brand-600 shadow-[0_0_0_2px_white]" /> {country.name}
        </span>
        {neighbours.length > 0 && (
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-500/70 shadow-[0_0_0_2px_white]" /> Other markets nearby
          </span>
        )}
      </div>
    </div>
  )
}
