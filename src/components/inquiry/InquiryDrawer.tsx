'use client'

import { ArrowRight, Minus, Plus, Trash2, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { useHasMounted } from '@/hooks/useHasMounted'
import { useInquiry } from '@/store/inquiry'
import { cn } from '@/lib/utils'

import { MediaPlaceholder } from '../Media'

type Props = { labels: { listName: string; ctaLabel: string; mode: 'inquiry' | 'ecommerce' } }

/**
 * Slide-over "cart". In inquiry mode the primary action leads to the /inquiry page
 * where the visitor submits the list with their contact details. No checkout.
 */
export function InquiryDrawer({ labels }: Props) {
  const { items, isOpen, close, remove, setQuantity, clear } = useInquiry()
  const mounted = useHasMounted()

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [isOpen, close])

  const list = mounted ? items : []

  return (
    <div
      className={cn('fixed inset-0 z-[70]', isOpen ? 'pointer-events-auto' : 'pointer-events-none')}
      aria-hidden={!isOpen}
    >
      <div
        className={cn(
          'absolute inset-0 bg-ink-950/30 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0',
        )}
        onClick={close}
      />
      <aside
        className={cn(
          'absolute inset-y-0 right-0 flex w-[min(28rem,94vw)] flex-col glass-strong shadow-glass-lg transition-transform duration-500 ease-[var(--ease-out-expo)]',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="inquiry-drawer-title"
      >
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
          <div>
            <h2 id="inquiry-drawer-title" className="text-lg font-semibold text-ink-950">
              {labels.listName}
            </h2>
            <p className="text-xs text-ink-500">
              {list.length} {list.length === 1 ? 'product' : 'products'}
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-brand-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="scrollbar-thin flex-1 overflow-y-auto px-5 py-4">
          {list.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl glass">
                <Plus className="h-6 w-6 text-brand-600" />
              </div>
              <p className="mt-4 text-sm font-medium text-ink-900">
                Your {labels.listName.toLowerCase()} is empty
              </p>
              <p className="mt-1 max-w-[16rem] text-xs text-ink-500">
                Browse the catalogue and add the products you need – then send us one inquiry for
                everything.
              </p>
              <Link href="/products" onClick={close} className="btn-secondary mt-5 text-xs">
                Browse products
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {list.map((item) => (
                <li key={item.id} className="glass flex gap-3 rounded-2xl p-3">
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={close}
                    className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white"
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <MediaPlaceholder className="h-full w-full" />
                    )}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={close}
                      className="line-clamp-1 text-sm font-semibold text-ink-950 hover:text-brand-700"
                    >
                      {item.title}
                    </Link>
                    <p className="line-clamp-1 text-xs text-ink-500">
                      {[item.genericName, item.strength, item.dosageForm]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-ink-200 bg-white">
                        <button
                          type="button"
                          onClick={() => setQuantity(item.id, item.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-l-full hover:bg-brand-50"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <QuantityInput
                          value={item.quantity}
                          onCommit={(q) => setQuantity(item.id, q)}
                        />
                        <button
                          type="button"
                          onClick={() => setQuantity(item.id, item.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-r-full hover:bg-brand-50"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(item.id)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full text-ink-400 hover:bg-brand-50 hover:text-brand-700"
                        aria-label={`Remove ${item.title}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {list.length > 0 && (
          <div className="space-y-2 border-t border-ink-100 p-5">
            <Link href="/inquiry" onClick={close} className="btn-primary w-full">
              {labels.ctaLabel} <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="text-center text-[11px] text-ink-500">
              {labels.mode === 'inquiry'
                ? 'No payment required – our team replies with a quotation, MOQs and lead times.'
                : 'Secure checkout'}
            </p>
            <button
              type="button"
              onClick={clear}
              className="mx-auto block text-xs text-ink-400 underline-offset-4 hover:text-brand-700 hover:underline"
            >
              Clear list
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}

/** Quantity field that keeps a local draft so clearing the box does not snap to 1 mid-edit. */
function QuantityInput({ value, onCommit }: { value: number; onCommit: (q: number) => void }) {
  const [draft, setDraft] = useState(String(value))
  const [last, setLast] = useState(value)
  if (last !== value) {
    setLast(value)
    setDraft(String(value))
  }
  return (
    <input
      type="number"
      inputMode="numeric"
      min={1}
      value={draft}
      onChange={(e) => {
        const v = e.target.value
        setDraft(v)
        const n = Number(v)
        if (v !== '' && Number.isInteger(n) && n >= 1) onCommit(n)
      }}
      onBlur={() => setDraft(String(value))}
      className="w-10 border-x border-ink-100 bg-transparent text-center text-xs font-semibold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
      aria-label="Quantity"
    />
  )
}
