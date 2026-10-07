import { cn } from '@/lib/utils'

/**
 * Google Maps (or any) embed in a glass frame. Lazy-loaded, so it costs
 * nothing until the visitor scrolls to it. Renders nothing when no URL is set.
 */
export function MapEmbed({
  src,
  title,
  className,
}: {
  src?: string | null
  title: string
  className?: string
}) {
  if (!src) return null
  return (
    <div className={cn('glass p-2 shadow-glass-lg sm:p-3', className)}>
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-50 sm:aspect-[16/9] lg:aspect-[21/9]">
        <iframe
          src={src}
          title={title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    </div>
  )
}
