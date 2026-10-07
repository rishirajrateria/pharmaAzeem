'use client'

import { SlidersHorizontal, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, type ReactNode } from 'react'
import { create } from 'zustand'

import { cn } from '@/lib/utils'

/**
 * Below `lg` the filter sidebar lives in a slide-over. The trigger (in the results
 * toolbar) and the panel (wrapping the server-rendered sidebar) sit in different
 * places in the DOM, so they share a tiny store instead of duplicating the markup.
 * On `lg`+ the panel is static – the sidebar is rendered exactly once either way.
 */
const useMobileFilters = create<{ open: boolean; setOpen: (open: boolean) => void }>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}))

export function MobileFiltersTrigger({
  label = 'Filters',
  activeCount = 0,
  className,
}: {
  label?: string
  activeCount?: number
  className?: string
}) {
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
        <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center bg-brand-gradient px-1.5 text-[10px] font-semibold text-white">
          {activeCount}
        </span>
      )}
    </button>
  )
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])'

export function MobileFilters({
  children,
  title = 'Filters',
  resultsLabel,
  className,
}: {
  children: ReactNode
  title?: string
  resultsLabel?: string
  className?: string
}) {
  const open = useMobileFilters((s) => s.open)
  const setOpen = useMobileFilters((s) => s.setOpen)
  const pathname = usePathname()
  const panelRef = useRef<HTMLDivElement>(null)

  // Navigating to another page (e.g. a category link inside the sidebar) closes the sheet.
  useEffect(() => {
    setOpen(false)
  }, [pathname, setOpen])

  // While the sheet is open it behaves as a modal dialog: focus moves into the panel,
  // Tab cycles inside it, Escape closes it and focus returns to the trigger afterwards.
  useEffect(() => {
    if (!open || window.matchMedia('(min-width: 1024px)').matches) return
    const panel = panelRef.current
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const focusRaf = requestAnimationFrame(() =>
      (panel?.querySelector<HTMLElement>('button[aria-label="Close filters"]') ?? panel)?.focus({
        preventScroll: true,
      }),
    )
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }
      if (e.key !== 'Tab' || !panel) return
      const focusable = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null,
      )
      if (focusable.length === 0) {
        e.preventDefault()
        panel.focus()
        return
      }
      const first = focusable[0] as HTMLElement
      const last = focusable[focusable.length - 1] as HTMLElement
      const current = document.activeElement
      if (e.shiftKey && (current === first || current === panel)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && current === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      cancelAnimationFrame(focusRaf)
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
      previous?.focus({ preventScroll: true })
    }
  }, [open, setOpen])

  return (
    <div
      id="catalog-filters-panel"
      className={cn(
        'max-lg:fixed max-lg:inset-0 max-lg:z-[60] lg:contents',
        !open && 'max-lg:pointer-events-none',
        className,
      )}
    >
      {/* Backdrop – mobile only */}
      <div
        className={cn(
          'absolute inset-0 bg-ink-950/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          open ? 'opacity-100' : 'opacity-0',
        )}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        role={open ? 'dialog' : undefined}
        aria-modal={open ? true : undefined}
        aria-label={open ? title : undefined}
        className={cn(
          'outline-none max-lg:absolute max-lg:inset-y-0 max-lg:left-0 max-lg:flex max-lg:w-[min(22rem,92vw)] max-lg:flex-col max-lg:glass-strong max-lg:shadow-glass-lg',
          'max-lg:transition-[transform,visibility] max-lg:duration-500 max-lg:ease-[var(--ease-out-expo)]',
          open
            ? 'max-lg:visible max-lg:translate-x-0'
            : 'max-lg:invisible max-lg:-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4 lg:hidden">
          <p className="text-base font-semibold text-ink-950">{title}</p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex h-10 w-10 items-center justify-center hover:bg-brand-50"
            aria-label="Close filters"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="scrollbar-thin max-lg:flex-1 max-lg:overflow-y-auto max-lg:px-4 max-lg:py-4">
          {children}
        </div>
        <div className="border-t border-ink-100 p-4 lg:hidden">
          <button type="button" onClick={() => setOpen(false)} className="btn-primary w-full">
            {resultsLabel || 'Show results'}
          </button>
        </div>
      </div>
    </div>
  )
}
