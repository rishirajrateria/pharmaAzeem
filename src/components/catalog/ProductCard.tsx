import Link from 'next/link'

import type { Product } from '@/payload-types'
import { getCommerceLabels, resolvePrice, type CommerceLabels } from '@/lib/commerce'
import { cn, mediaUrl } from '@/lib/utils'

import { Media } from '../Media'
import { AddToInquiryButton } from '../inquiry/AddToInquiryButton'
import { Badge } from '../ui'
import { PriceTag } from './PriceTag'

const BADGE_LABEL: Record<string, string> = {
  new: 'New',
  'best-seller': 'Best seller',
  'who-gmp': 'WHO-GMP',
  'export-ready': 'Export ready',
  'sugar-free': 'Sugar free',
  pediatric: 'Pediatric',
}

export function toInquiryItem(product: Product) {
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    genericName: product.genericName,
    strength: product.strength || undefined,
    dosageForm: product.dosageForm || undefined,
    image: mediaUrl(product.images?.[0], 'thumbnail'),
  }
}

/**
 * Catalogue card. Server component (fast, no JS) except the small "add" button.
 * `labels` comes from Site Settings so wording ("Add to inquiry list" / "Add to cart") is configurable.
 */
export function ProductCard({
  product,
  labels,
  priority,
  className,
}: {
  product: Product
  labels: CommerceLabels | ReturnType<typeof getCommerceLabels>
  priority?: boolean
  className?: string
}) {
  const price = resolvePrice(product, labels)
  const href = `/products/${product.slug}`
  const category = product.categories?.find((c) => typeof c === 'object') as
    { title: string; path?: string | null } | undefined
  return (
    <article
      className={cn('group glass-card relative flex flex-col overflow-hidden !p-0', className)}
    >
      <Link
        href={href}
        className="relative block aspect-square overflow-hidden bg-white"
        aria-label={product.title}
      >
        <Media
          media={product.images?.[0]}
          size="card"
          fill
          sizes="(max-width: 420px) 92vw, (max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
          className="h-full w-full"
          imgClassName="transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
        />
        {(product.badges?.length || 0) > 0 && (
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {product.badges!.slice(0, 2).map((b) => (
              <Badge key={b} tone={b === 'new' || b === 'best-seller' ? 'brand' : 'glass'}>
                {BADGE_LABEL[b] || b}
              </Badge>
            ))}
          </div>
        )}
        {product.prescriptionStatus && (
          <span className="absolute right-3 top-3 glass px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink-700">
            {product.prescriptionStatus === 'otc' ? 'OTC' : 'Rx'}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {category && (
          <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-brand-600">
            {category.title}
          </p>
        )}
        <h3 className="text-base font-semibold leading-snug text-ink-950">
          <Link
            href={href}
            className="after:absolute after:inset-0 after:content-[''] hover:text-brand-700"
          >
            {product.title}
          </Link>
        </h3>
        <p className="mt-0.5 line-clamp-1 text-sm text-ink-600">{product.genericName}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {product.dosageForm && <span className="chip !py-0.5">{product.dosageForm}</span>}
          {product.strength && <span className="chip !py-0.5">{product.strength}</span>}
        </div>
        <div className="relative z-10 mt-4 flex items-center justify-between gap-3 border-t border-ink-100 pt-4">
          <PriceTag price={price} size="sm" />
          <AddToInquiryButton
            product={toInquiryItem(product)}
            label={labels.addLabel}
            addedLabel={labels.addedLabel}
            variant="icon"
          />
        </div>
      </div>
    </article>
  )
}
