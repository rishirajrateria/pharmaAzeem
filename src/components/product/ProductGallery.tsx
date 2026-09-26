'use client'

import Image from 'next/image'
import { useState, type MouseEvent } from 'react'

import { MediaPlaceholder } from '@/components/Media'
import { Badge } from '@/components/ui'
import { cn } from '@/lib/utils'

import type { GalleryImage } from './labels'

type Props = {
  images: GalleryImage[]
  title: string
  /** Human-readable badge labels (already mapped). */
  badges?: string[]
  /** "Rx" | "OTC" */
  rx?: string | null
  className?: string
}

/**
 * Product image gallery. Main image sits in a glass frame with a CSS zoom on hover
 * (transform-origin follows the pointer); a thumbnail row switches the image.
 * Minimal client JS: one state value, one pointer handler that only touches CSS variables.
 */
export function ProductGallery({ images, title, badges = [], rx, className }: Props) {
  const [active, setActive] = useState(0)
  const current = images[active] ?? images[0]
  const many = images.length > 1

  // The zoom origin is written straight to the frame's CSS custom properties – no React state,
  // so a hover (dozens of mousemove events per second) never re-renders the gallery.
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    if (!r.width || !r.height) return
    el.style.setProperty('--zoom-x', `${((e.clientX - r.left) / r.width) * 100}%`)
    el.style.setProperty('--zoom-y', `${((e.clientY - r.top) / r.height) * 100}%`)
  }

  return (
    <div className={cn('relative', className)}>
      {/* Ambient decoration behind the frame */}
      <div
        className="pointer-events-none absolute -inset-6 -z-10 hidden sm:block"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-1/2 h-[115%] w-[115%] -translate-x-1/2 -translate-y-1/2 animate-spin-slower rounded-full border border-dashed border-brand-300/40" />
        <div className="absolute left-1/2 top-1/2 h-[104%] w-[104%] -translate-x-1/2 -translate-y-1/2 animate-spin-slow rounded-full border border-brand-200/50">
          <span className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-brand-600 shadow-[0_0_0_5px_rgb(225_29_46_/_0.15)]" />
        </div>
      </div>

      <figure className="m-0">
        <div className="gradient-border rounded-[2rem]">
          <div
            onMouseMove={current ? onMove : undefined}
            className="group relative aspect-square overflow-hidden rounded-[2rem] glass-strong glass-edge shadow-glass-lg [--zoom-x:50%] [--zoom-y:50%]"
          >
            <div
              className="pointer-events-none absolute inset-0 dots-pattern opacity-40 fade-mask-y"
              aria-hidden="true"
            />
            {current ? (
              <div className="relative h-full w-full bg-white/60">
                <Image
                  key={current.src}
                  src={current.src}
                  alt={current.alt}
                  fill
                  priority={active === 0}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-6 transition-transform duration-700 ease-[var(--ease-out-expo)] [transform-origin:var(--zoom-x)_var(--zoom-y)] group-hover:scale-150 sm:p-10"
                />
              </div>
            ) : (
              <MediaPlaceholder className="h-full w-full" label={`${title} – image coming soon`} />
            )}

            {/* Overlays */}
            {(badges.length > 0 || rx) && (
              <div className="pointer-events-none absolute inset-x-4 top-4 flex items-start justify-between gap-2 sm:inset-x-5 sm:top-5">
                <div className="flex flex-wrap gap-1.5">
                  {badges.slice(0, 3).map((b, i) => (
                    <Badge key={b} tone={i === 0 ? 'brand' : 'glass'}>
                      {b}
                    </Badge>
                  ))}
                </div>
                {rx && (
                  <span className="rounded-full glass px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-800">
                    {rx}
                  </span>
                )}
              </div>
            )}
            {current && (
              <span
                className="pointer-events-none absolute bottom-4 right-4 hidden rounded-full glass px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:block"
                aria-hidden="true"
              >
                Hover to zoom
              </span>
            )}
            {many && (
              <span
                className="pointer-events-none absolute bottom-4 left-4 rounded-full glass px-2.5 py-1 font-mono text-[10px] tracking-[0.18em] text-ink-600"
                aria-live="polite"
              >
                {active + 1} / {images.length}
              </span>
            )}
          </div>
        </div>
        {current && <figcaption className="sr-only">{current.alt}</figcaption>}
      </figure>

      {many && (
        <div
          className="mt-4 flex gap-3 overflow-x-auto pb-1 scrollbar-thin"
          role="group"
          aria-label={`${title} images`}
        >
          {images.map((img, i) => {
            const selected = i === active
            return (
              <button
                key={img.src + i}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={selected}
                aria-label={`Show image ${i + 1} of ${images.length}`}
                className={cn(
                  'relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-white/80 transition-all duration-300',
                  selected
                    ? 'glass-red ring-2 ring-brand-500/60 ring-offset-2 ring-offset-white'
                    : 'glass hover:border-brand-300 hover:shadow-glass-lg',
                )}
              >
                <Image src={img.thumb} alt="" fill sizes="80px" className="object-contain p-2" />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
