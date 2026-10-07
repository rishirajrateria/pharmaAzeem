'use client'

import { ShoppingCart } from 'lucide-react'

import { useHasMounted } from '@/hooks/useHasMounted'
import { useInquiry } from '@/store/inquiry'

/** Header button that opens the inquiry list drawer and shows the item count. */
export function InquiryTrigger({ label }: { label: string }) {
  const count = useInquiry((s) => s.items.length)
  const open = useInquiry((s) => s.open)
  const mounted = useHasMounted()
  const n = mounted ? count : 0
  return (
    <button
      type="button"
      onClick={open}
      className="inline-flex h-11 items-center gap-4 glass px-3 text-sm font-medium text-ink-900 transition-colors hover:border-brand-700 hover:text-brand-700"
      aria-label={`Open ${label.toLowerCase()} (${n} items)`}
    >
      <span className="relative">
        <ShoppingCart className="h-5 w-5" aria-hidden="true" />
        <span
          className="absolute -right-2.5 -top-2 flex h-4.5 min-w-4.5 items-center justify-center bg-brand-700 px-1 text-[10px] font-bold leading-none text-white"
          aria-hidden="true"
        >
          {n}
        </span>
      </span>
      <span className="hidden whitespace-nowrap sm:inline">{label}</span>
    </button>
  )
}
