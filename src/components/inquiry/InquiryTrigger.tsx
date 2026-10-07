'use client'

import { ClipboardList } from 'lucide-react'

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
      className="relative inline-flex h-10 items-center gap-2 px-3 text-sm font-medium text-ink-800 transition hover:bg-brand-50 hover:text-brand-700"
      aria-label={`Open ${label.toLowerCase()} (${n} items)`}
    >
      <ClipboardList className="h-5 w-5" />
      <span className="hidden whitespace-nowrap 2xl:inline">{label}</span>
      <span
        className={`absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center bg-brand-gradient px-1 text-[10px] font-bold text-white shadow transition-transform ${n ? 'scale-100' : 'scale-0'}`}
        aria-hidden="true"
      >
        {n}
      </span>
    </button>
  )
}
