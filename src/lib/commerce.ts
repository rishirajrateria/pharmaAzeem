import type { Product, SiteSetting } from '@/payload-types'

/**
 * Commerce mode helpers.
 *
 * Today the site runs in "inquiry" mode: visitors collect products in an inquiry
 * list and request a quote. All price/stock fields already exist on products, so
 * switching to a real cart + checkout later only requires:
 *   1. Site Settings → Commerce → mode = "ecommerce" & showPrices = true
 *   2. Adding a /checkout route + payment provider (see README "Going e-commerce").
 * Nothing in the catalogue, cards or product pages needs to change.
 */
export type CommerceLabels = {
  mode: 'inquiry' | 'ecommerce'
  showPrices: boolean
  currency: string
  priceFallbackLabel: string
  listName: string
  addLabel: string
  addedLabel: string
  ctaLabel: string
}

export const getCommerceLabels = (settings?: SiteSetting | null): CommerceLabels => {
  const c = settings?.commerce
  const mode = (c?.mode as CommerceLabels['mode']) || 'inquiry'
  const isShop = mode === 'ecommerce'
  return {
    mode,
    showPrices: Boolean(c?.showPrices),
    currency: c?.currency || 'USD',
    priceFallbackLabel: c?.priceFallbackLabel || 'Inquire for pricing',
    listName: c?.listName || (isShop ? 'Cart' : 'Inquiry list'),
    addLabel: c?.addLabel || (isShop ? 'Add to cart' : 'Add to inquiry list'),
    addedLabel: isShop ? 'In cart' : 'Added to list',
    ctaLabel: c?.ctaLabel || (isShop ? 'Checkout' : 'Inquire now'),
  }
}

export const formatPrice = (amount: number, currency = 'USD') => {
  try {
    return new Intl.NumberFormat('en', { style: 'currency', currency, maximumFractionDigits: 2 }).format(amount)
  } catch {
    return `${currency} ${amount.toFixed(2)}`
  }
}

export type PriceDisplay =
  | { kind: 'inquire'; label: string }
  | { kind: 'price'; amount: number; formatted: string; compareAt?: string; unit?: string; currency: string }

/** Decides whether a product shows a price or the "Inquire for pricing" label. */
export const resolvePrice = (product: Pick<Product, 'price' | 'compareAtPrice' | 'priceUnit' | 'showPrice'>, labels: CommerceLabels): PriceDisplay => {
  const override = product.showPrice || 'default'
  const hasPrice = typeof product.price === 'number' && product.price > 0
  const show = override === 'always' ? hasPrice : override === 'never' ? false : labels.showPrices && hasPrice
  if (!show) return { kind: 'inquire', label: labels.priceFallbackLabel }
  return {
    kind: 'price',
    amount: product.price as number,
    formatted: formatPrice(product.price as number, labels.currency),
    compareAt:
      typeof product.compareAtPrice === 'number' && product.compareAtPrice > (product.price as number)
        ? formatPrice(product.compareAtPrice, labels.currency)
        : undefined,
    unit: product.priceUnit || undefined,
    currency: labels.currency,
  }
}
