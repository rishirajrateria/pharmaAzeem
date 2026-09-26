'use client'

import { SlidersHorizontal, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'
import { create } from 'zustand'

import { cn } from '@/lib/utils'

/**
 * Below `lg` the filter sidebar lives in a slide-over. The trigger (in the results
 * toolbar) and the panel (wrapping the server-rendered sidebar) sit in different
 * places in the DOM, so they share a tiny store instead of duplicating the markup.
 * On `lg`+ the panel is static – the sidebar renders exactly once either way.
 */
const useMobileFilters = create<{ open: boolean; setOpen: (open: boolean) => void }>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}))

export function MobileFiltersTrigger({ label = 'Filters', activeCount = 0, className }: { label?: string; activeCount?: number; className?: string }) {
  const open = useMobileFilters((s) => s.open)
  const setOpen = useMobileFilters((s) => s.setOpen)
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={cn('btn-secondary !py-2.5 text-xs lg:hidden', className)}
      aria-expanded={open}
      aria-controls="catalog-filters-panel"
    >
      <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
      {label}
      {activeCount > 0 && (
        <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-gradient px-1.5 font-mono text-[10px] font-semibold text-white">
          {activeCount}
        </span>
      )}
    </button>
  )
}

export function MobileFilters({ children, title = 'Filters', resultsLabel, className }: { children: ReactNode; title?: string; resultsLabel?: string; className?: string }) {
  const open = useMobileFilters((s) => s.open)
  const setOpen = useMobileFilters((s) => s.setOpen)
  const pathname = usePathname()

  // A category link inside the sidebar navigates to another page – close the sheet.
  useEffect(() => {
    setOpen(false)
  }, [pathname, setOpen])

  useEffect(() => {
    if (!open) return
    const mq = window.matchMedia('(min-width: 1024px)')
    if (mq.matches) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [open, setOpen])

  return (
    <div id="catalog-filters-panel" className={cn('lg:contents', open ? 'fixed inset-0 z-[60]' : 'hidden', className)}>
      {/* Backdrop (mobile only) */}
      <div
        className={cn('absolute inset-0 bg-ink-950/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden', open ? 'opacity-100' : 'opacity-0')}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <div
        role={open ? 'dialog' : undefined}
        aria-modal={open ? true : undefined}
        aria-label={open ? title : undefined}
        className={cn(
          'absolute inset-y-0 left-0 flex w-[min(22rem,92vw)] flex-col glass-strong shadow-glass-lg transition-transform duration-500 ease-[var(--ease-out-expo)]',
          'lg:static lg:block lg:w-auto lg:bg-none lg:shadow-none lg:backdrop-blur-none lg:border-0 lg:transition-none',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4 lg:hidden">
          <p className="text-base font-semibold text-ink-950">{title}</p>
          <button type="button" onClick={() => setOpen(false)} className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-brand-50" aria-label="Close filters">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="scrollbar-thin flex-1 overflow-y-auto px-4 py-4 lg:overflow-visible lg:p-0">{children}</div>
        <div className="border-t border-ink-100 p-4 lg:hidden">
          <button type="button" onClick={() => setOpen(false)} className="btn-primary w-full">
            {resultsLabel || 'Show results'}
          </button>
        </div>
      </div>
    </div>
  )
}
