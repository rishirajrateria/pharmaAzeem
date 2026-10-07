import type { PriceDisplay } from '@/lib/commerce'
import { cn } from '@/lib/utils'

/** Shows a price, or the "Inquire for pricing" label when prices are hidden. */
export function PriceTag({
  price,
  size = 'md',
  className,
}: {
  price: PriceDisplay
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  if (price.kind === 'inquire') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 font-medium text-brand-700',
          size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-lg' : 'text-sm',
          className,
        )}
      >
        <span className="h-1.5 w-1.5 bg-brand-500 rounded-full" />
        {price.label}
      </span>
    )
  }
  return (
    <span className={cn('inline-flex flex-wrap items-baseline gap-x-2', className)}>
      <span
        className={cn(
          'font-semibold text-ink-950',
          size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-3xl' : 'text-lg',
        )}
      >
        {price.formatted}
      </span>
      {price.compareAt && <s className="text-xs text-ink-400">{price.compareAt}</s>}
      {price.unit && <span className="text-xs text-ink-500">{price.unit}</span>}
    </span>
  )
}
