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
 * Product image gallery. Main image sits in a plain bordered frame with a CSS zoom on hover
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
      <figure className="m-0">
        <div
          onMouseMove={current ? onMove : undefined}
          className="group relative aspect-square overflow-hidden border border-ink-200 bg-white [--zoom-x:50%] [--zoom-y:50%]"
        >
          {current ? (
            <div className="relative h-full w-full">
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
                <span className="glass px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink-800">
                  {rx}
                </span>
              )}
            </div>
          )}
          {current && (
            <span
              className="pointer-events-none absolute bottom-4 right-4 hidden glass px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-ink-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:block"
              aria-hidden="true"
            >
              Hover to zoom
            </span>
          )}
          {many && (
            <span
              className="pointer-events-none absolute bottom-4 left-4 glass px-2.5 py-1 text-[10px] tracking-[0.18em] text-ink-600"
              aria-live="polite"
            >
              {active + 1} / {images.length}
            </span>
          )}
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
                  'relative h-20 w-20 shrink-0 overflow-hidden border bg-white transition-colors',
                  selected ? 'border-brand-700' : 'border-ink-200 hover:border-ink-400',
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
