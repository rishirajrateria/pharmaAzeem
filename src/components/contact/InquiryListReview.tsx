'use client'

import { ArrowRight, ClipboardList, Minus, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { MediaPlaceholder } from '@/components/Media'
import { useHasMounted } from '@/hooks/useHasMounted'
import { useInquiry } from '@/store/inquiry'
import { cn } from '@/lib/utils'

type Props = { listName: string; addLabel: string; className?: string }

/**
 * Editable review of the visitor's inquiry list on /inquiry. Reads the persisted
 * zustand store, so it renders a neutral skeleton until hydration to avoid a
 * server/client mismatch, then the real list (or an empty state).
 */
export function InquiryListReview({ listName, addLabel, className }: Props) {
  const items = useInquiry((s) => s.items)
  const remove = useInquiry((s) => s.remove)
  const setQuantity = useInquiry((s) => s.setQuantity)
  const clear = useInquiry((s) => s.clear)
  const mounted = useHasMounted()
  const lower = listName.toLowerCase()

  if (!mounted) return <ListSkeleton className={className} />
  if (items.length === 0)
    return <EmptyState lower={lower} addLabel={addLabel} className={className} />

  const units = items.reduce((n, i) => n + i.quantity, 0)

  return (
    <div className={cn('glass-strong glass-edge overflow-hidden rounded-3xl', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 px-5 py-4 sm:px-6">
        <p className="text-sm text-ink-600" aria-live="polite">
          <span className="font-semibold text-ink-950">{items.length}</span>{' '}
          {items.length === 1 ? 'product' : 'products'}
          <span className="mx-2 text-ink-300" aria-hidden="true">
            ·
          </span>
          <span className="font-semibold text-ink-950">{units.toLocaleString('en')}</span>{' '}
          {units === 1 ? 'unit' : 'units'}
        </p>
        <button
          type="button"
          onClick={clear}
          className="text-xs text-ink-500 underline-offset-4 hover:text-brand-700 hover:underline"
        >
          Clear {lower}
        </button>
      </div>

      <ol className="divide-y divide-ink-100">
        {items.map((item) => {
          const href = `/products/${item.slug}`
          const details = [item.genericName, item.strength, item.dosageForm]
            .filter(Boolean)
            .join(' · ')
          return (
            <li key={item.id} className="flex gap-4 px-5 py-4 sm:px-6 sm:py-5">
              <Link
                href={href}
                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-ink-100 bg-white"
                aria-hidden="true"
                tabIndex={-1}
              >
                {item.image ? (
                  <Image src={item.image} alt="" fill sizes="80px" className="object-cover" />
                ) : (
                  <MediaPlaceholder className="h-full w-full" />
                )}
              </Link>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold leading-snug text-ink-950 sm:text-base">
                      <Link href={href} className="hover:text-brand-700">
                        {item.title}
                      </Link>
                    </h3>
                    {details && <p className="mt-0.5 text-xs text-ink-500 sm:text-sm">{details}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-400 transition hover:bg-brand-50 hover:text-brand-700"
                    aria-label={`Remove ${item.title} from ${lower}`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <div
                    className="inline-flex items-center rounded-full border border-ink-200 bg-white shadow-soft"
                    role="group"
                    aria-label={`Quantity for ${item.title}`}
                  >
                    <button
                      type="button"
                      onClick={() => setQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="flex h-9 w-9 items-center justify-center rounded-l-full text-ink-700 transition hover:bg-brand-50 hover:text-brand-700 disabled:opacity-40 disabled:hover:bg-transparent"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      inputMode="numeric"
                      value={item.quantity}
                      onChange={(e) => setQuantity(item.id, Number(e.target.value))}
                      className="w-16 border-x border-ink-100 bg-transparent py-1.5 text-center text-sm font-semibold text-ink-950 outline-none [appearance:textfield] focus-visible:bg-brand-50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      aria-label={`Quantity for ${item.title}`}
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(item.id, item.quantity + 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-r-full text-ink-700 transition hover:bg-brand-50 hover:text-brand-700"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                  <span className="text-xs text-ink-500">units / packs</span>
                </div>
              </div>
            </li>
          )
        })}
      </ol>

      <div className="flex flex-col gap-3 border-t border-ink-100 bg-white/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-xs text-ink-500">
          Quantities are indicative – mention preferred pack sizes or packaging in your message.
        </p>
        <Link href="/products" className="btn-secondary !py-2 text-xs">
          Add more products <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}

function EmptyState({
  lower,
  addLabel,
  className,
}: {
  lower: string
  addLabel: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'glass-strong glass-edge rounded-3xl px-6 py-10 text-center sm:px-10 sm:py-14',
        className,
      )}
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl glass-red text-brand-600">
        <ClipboardList className="h-7 w-7" aria-hidden="true" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-ink-950">Your {lower} is empty</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-600">
        Browse the catalogue and use “{addLabel}” on any product. You can also simply describe what
        you need in the form – our team will match it to our range.
      </p>
      <Link href="/products" className="btn-primary mt-6">
        Browse products <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  )
}

function ListSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('glass-strong glass-edge rounded-3xl', className)}
      aria-busy="true"
      aria-label="Loading your inquiry list"
    >
      <div className="border-b border-ink-100 px-5 py-4 sm:px-6">
        <span className="skeleton block h-3.5 w-40 rounded-full" />
      </div>
      <ul className="divide-y divide-ink-100" aria-hidden="true">
        {[0, 1].map((i) => (
          <li key={i} className="flex gap-4 px-5 py-4 sm:px-6 sm:py-5">
            <span className="skeleton h-20 w-20 shrink-0 rounded-2xl" />
            <span className="flex-1 space-y-2.5 py-1">
              <span className="skeleton block h-3.5 w-2/3 rounded-full" />
              <span className="skeleton block h-3 w-1/2 rounded-full" />
              <span className="skeleton mt-4 block h-9 w-32 rounded-full" />
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
