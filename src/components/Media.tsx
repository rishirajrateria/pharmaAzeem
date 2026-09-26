import NextImage, { type ImageProps } from 'next/image'

import type { Media as MediaDoc } from '@/payload-types'
import { cn, mediaAlt, mediaDims, mediaUrl, type MediaSize } from '@/lib/utils'

type Props = {
  media?: MediaDoc | number | string | null
  size?: MediaSize
  alt?: string
  fill?: boolean
  className?: string
  imgClassName?: string
  sizes?: string
  priority?: boolean
  /** Rendered when no media is available. */
  fallback?: React.ReactNode
} & Omit<ImageProps, 'src' | 'alt' | 'fill' | 'sizes' | 'priority' | 'width' | 'height'>

/**
 * next/image wrapper for Payload uploads. Picks the right pre-generated size,
 * serves AVIF/WebP and lazy-loads by default.
 */
export function Media({
  media,
  size = 'large',
  alt,
  fill,
  className,
  imgClassName,
  sizes,
  priority,
  fallback,
  ...rest
}: Props) {
  const src = mediaUrl(media, size) || mediaUrl(media)
  if (!src) return fallback ? <>{fallback}</> : <MediaPlaceholder className={className} />
  const dims = mediaDims(media, size)
  const a = alt ?? mediaAlt(media)
  if (fill) {
    return (
      <div className={cn('relative overflow-hidden', className)}>
        <NextImage
          src={src}
          alt={a}
          fill
          sizes={sizes || '100vw'}
          priority={priority}
          className={cn('object-cover', imgClassName)}
          {...rest}
        />
      </div>
    )
  }
  return (
    <NextImage
      src={src}
      alt={a}
      width={dims.width || 1200}
      height={dims.height || 800}
      sizes={sizes || '(max-width: 768px) 100vw, 50vw'}
      priority={priority}
      className={cn(className, imgClassName)}
      {...rest}
    />
  )
}

/** Branded placeholder used when an image has not been uploaded yet. */
export function MediaPlaceholder({ className, label }: { className?: string; label?: string }) {
  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-brand-50 via-white to-brand-100',
        className,
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-0 dots-pattern opacity-60" />
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl glass">
        <svg
          viewBox="0 0 24 24"
          className="h-8 w-8 text-brand-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
          <path d="m8.5 8.5 7 7" />
        </svg>
      </div>
      {label && <span className="sr-only">{label}</span>}
    </div>
  )
}
