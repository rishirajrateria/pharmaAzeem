'use client'

import { useState } from 'react'

import { Media } from '@/components/Media'
import { cn, mediaAlt } from '@/lib/utils'
import type { Media as MediaDoc } from '@/payload-types'

/**
 * Tiny gallery for facilities with more than one photo: the active image fills the frame,
 * the rest render as thumbnails in a glass strip. Only mounted when there are 2+ images;
 * single-image facilities render a static <Media> on the server.
 */
export function FacilityGallery({
  images,
  name,
  className,
}: {
  images: MediaDoc[]
  name: string
  className?: string
}) {
  const [active, setActive] = useState(0)
  const current = images[active] || images[0]
  return (
    <figure className={cn('relative h-full w-full', className)}>
      <div className="relative aspect-[4/3] h-full w-full overflow-hidden lg:aspect-auto">
        <Media
          key={current.id}
          media={current}
          size="large"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="absolute inset-0 h-full w-full animate-scale-in"
          imgClassName="object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/35 via-transparent to-transparent"
          aria-hidden="true"
        />
      </div>
      <figcaption className="sr-only">{mediaAlt(current, name)}</figcaption>
      <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
        <ul
          className="glass-strong flex gap-1.5 p-1.5 shadow-glass"
          aria-label={`${name} photos`}
          role="list"
        >
          {images.map((img, i) => {
            const isActive = i === active
            return (
              <li key={img.id}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={isActive}
                  aria-label={`Show photo ${i + 1} of ${images.length}${img.alt ? `: ${img.alt}` : ''}`}
                  className={cn(
                    'relative block h-12 w-12 overflow-hidden ring-2 transition-all duration-300 sm:h-14 sm:w-14',
                    isActive
                      ? 'ring-brand-600 shadow-glow'
                      : 'ring-transparent opacity-80 hover:opacity-100 hover:ring-brand-200',
                  )}
                >
                  <Media
                    media={img}
                    size="thumbnail"
                    fill
                    sizes="56px"
                    className="h-full w-full"
                    imgClassName="object-cover"
                  />
                </button>
              </li>
            )
          })}
        </ul>
        <span
          className="glass-strong px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-700"
          aria-hidden="true"
        >
          {active + 1} / {images.length}
        </span>
      </div>
    </figure>
  )
}
