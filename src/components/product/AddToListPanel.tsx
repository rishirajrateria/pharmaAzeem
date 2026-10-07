'use client'

import {
  FileCheck,
  Globe,
  MessageSquareText,
  Minus,
  Plus,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { PriceTag } from '@/components/catalog/PriceTag'
import { AddToInquiryButton } from '@/components/inquiry/AddToInquiryButton'
import { useHasMounted } from '@/hooks/useHasMounted'
import type { PriceDisplay } from '@/lib/commerce'
import type { InquiryItem } from '@/store/inquiry'
import { cn } from '@/lib/utils'

type Props = {
  product: Omit<InquiryItem, 'quantity' | 'addedAt'>
  price: PriceDisplay
  labels: { addLabel: string; addedLabel: string }
  /** Anchor of the on-page inquiry form. */
  inquireHref?: string
  /** Renders a fixed bottom bar on small screens once the panel scrolls out of view. */
  stickyBar?: boolean
  /** Assurance chips under the buttons – pass CMS-sourced labels, never hard-coded claims. */
  trust?: TrustItem[]
  className?: string
}

export type TrustItem = { icon: 'shield' | 'file' | 'globe'; label: string }

const TRUST_ICON: Record<TrustItem['icon'], LucideIcon> = {
  shield: ShieldCheck,
  file: FileCheck,
  globe: Globe,
}

/**
 * The "buy box": price, quantity stepper, add-to-list button and a secondary
 * "Inquire about this product" link. Holds the quantity state so the fixed mobile
 * bar (portalled to <body>) adds the same quantity.
 */
export function AddToListPanel({
  product,
  price,
  labels,
  inquireHref = '#inquire',
  stickyBar = true,
  trust = [],
  className,
}: Props) {
  const [qty, setQty] = useState(1)
  const [showBar, setShowBar] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const mounted = useHasMounted()

  const clamp = (n: number) => Math.min(99999, Math.max(1, Math.floor(n) || 1))

  useEffect(() => {
    if (!stickyBar || typeof IntersectionObserver === 'undefined') return
    const panel = panelRef.current
    const form = document.querySelector(inquireHref) as HTMLElement | null
    if (!panel) return
    let panelAbove = false
    let formVisible = false
    const update = () => setShowBar(panelAbove && !formVisible)
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.target === panel) panelAbove = !e.isIntersecting && e.boundingClientRect.top < 0
          if (form && e.target === form)
            formVisible = e.isIntersecting || e.boundingClientRect.top < 0
        }
        update()
      },
      { threshold: 0 },
    )
    obs.observe(panel)
    if (form) obs.observe(form)
    return () => obs.disconnect()
  }, [stickyBar, inquireHref])

  const stepper = (size: 'md' | 'sm') => (
    <div
      className={cn('inline-flex items-center glass/90', size === 'md' ? 'h-12' : 'h-10')}
      role="group"
      aria-label="Quantity"
    >
      <button
        type="button"
        onClick={() => setQty((q) => clamp(q - 1))}
        disabled={qty <= 1}
        className={cn(
          'flex items-center justify-center text-ink-700 transition hover:bg-brand-50 hover:text-brand-700 disabled:opacity-40',
          size === 'md' ? 'h-12 w-11' : 'h-10 w-9',
        )}
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={99999}
        value={qty}
        onChange={(e) => setQty(clamp(Number(e.target.value)))}
        className={cn(
          'border-x border-ink-100 bg-transparent text-center text-sm font-semibold text-ink-950 focus-visible:ring-2 focus-visible:ring-brand-500 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none',
          size === 'md' ? 'h-12 w-16' : 'h-10 w-12',
        )}
        aria-label="Quantity"
      />
      <button
        type="button"
        onClick={() => setQty((q) => clamp(q + 1))}
        className={cn(
          'flex items-center justify-center text-ink-700 transition hover:bg-brand-50 hover:text-brand-700',
          size === 'md' ? 'h-12 w-11' : 'h-10 w-9',
        )}
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  )

  return (
    <>
      <div ref={panelRef} className={cn('glass-strong relative p-5 sm:p-6', className)}>
        <div className="relative">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink-500">
                {price.kind === 'price' ? 'Price' : 'Pricing'}
              </p>
              <PriceTag price={price} size="lg" className="mt-1" />
            </div>
            {price.kind === 'inquire' && (
              <p className="max-w-[16rem] text-xs leading-relaxed text-ink-500">
                Prices depend on quantity and destination – request a quotation.
              </p>
            )}
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-ink-600">Quantity</span>
              {stepper('md')}
            </div>
            <AddToInquiryButton
              product={product}
              label={labels.addLabel}
              addedLabel={labels.addedLabel}
              variant="full"
              quantity={qty}
              className="!py-3.5 sm:flex-1"
            />
          </div>

          <a href={inquireHref} className="btn-secondary mt-3 w-full">
            <MessageSquareText className="h-4 w-4 text-brand-600" aria-hidden="true" /> Inquire
            about this product
          </a>

          {trust.length > 0 && (
            <ul
              className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-ink-100 pt-4"
              aria-label="Assurances"
            >
              {trust.map(({ icon, label }) => {
                const I = TRUST_ICON[icon]
                return (
                  <li
                    key={label}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-700"
                  >
                    <I className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" /> {label}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>

      {stickyBar &&
        mounted &&
        createPortal(
          <div
            className={cn(
              'fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-transform duration-500 ease-[var(--ease-out-expo)] lg:hidden',
              showBar ? 'translate-y-0' : 'translate-y-[120%]',
            )}
            aria-hidden={!showBar}
            inert={!showBar}
          >
            <div className="glass-strong glass-edge flex items-center gap-3 py-2 pl-4 pr-2 shadow-glass-lg">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink-950">{product.title}</p>
                <PriceTag price={price} size="sm" />
              </div>
              <div className="hidden sm:block">{stepper('sm')}</div>
              <AddToInquiryButton
                product={product}
                label={labels.addLabel}
                addedLabel={labels.addedLabel}
                variant="icon"
                quantity={qty}
                className="h-11 w-11"
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
