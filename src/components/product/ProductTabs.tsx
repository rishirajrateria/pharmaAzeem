'use client'

import {
  useCallback,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type ReactNode,
} from 'react'

import { cn } from '@/lib/utils'

export type ProductTab = { id: string; label: string; content: ReactNode; count?: number }

const readHash = () => window.location.hash.replace('#', '')
const serverHash = () => ''

/**
 * Accessible tabs (WAI-ARIA tabs pattern with roving tabindex and arrow keys).
 * Every panel is rendered in the DOM – inactive ones carry the `hidden` attribute –
 * so all product content is crawlable and quotable without JavaScript.
 */
export function ProductTabs({
  tabs,
  label = 'Product information',
  className,
}: {
  tabs: ProductTab[]
  label?: string
  className?: string
}) {
  const [selected, setSelected] = useState<number | null>(null)
  const baseId = useId()
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  // Deep-link support: /products/x#faqs opens the FAQ tab (and a later hash change re-targets it).
  const subscribeHash = useCallback((onChange: () => void) => {
    const handler = () => {
      setSelected(null)
      onChange()
    }
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])
  const hash = useSyncExternalStore(subscribeHash, readHash, serverHash)
  const hashIndex = tabs.findIndex((t) => t.id === hash)
  const active = selected ?? (hashIndex >= 0 ? hashIndex : 0)
  const setActive = (i: number) => setSelected(i)

  const focusTab = (i: number) => {
    const n = (i + tabs.length) % tabs.length
    setActive(n)
    refs.current[n]?.focus()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault()
        focusTab(i + 1)
        break
      case 'ArrowLeft':
        e.preventDefault()
        focusTab(i - 1)
        break
      case 'Home':
        e.preventDefault()
        focusTab(0)
        break
      case 'End':
        e.preventDefault()
        focusTab(tabs.length - 1)
        break
    }
  }

  if (!tabs.length) return null

  return (
    <div className={cn('glass-strong glass-edge overflow-hidden rounded-[2rem]', className)}>
      <div className="relative border-b border-ink-100/80">
        <div
          role="tablist"
          aria-label={label}
          className="flex gap-1 overflow-x-auto px-3 pt-3 scrollbar-thin sm:px-5"
        >
          {tabs.map((t, i) => {
            const selected = i === active
            return (
              <button
                key={t.id}
                ref={(el) => {
                  refs.current[i] = el
                }}
                role="tab"
                type="button"
                id={`${baseId}-tab-${t.id}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel-${t.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={cn(
                  'relative inline-flex shrink-0 items-center gap-2 rounded-t-2xl px-4 py-3 text-sm font-semibold transition-colors',
                  selected ? 'text-brand-700' : 'text-ink-600 hover:text-ink-950',
                )}
              >
                {t.label}
                {typeof t.count === 'number' && t.count > 0 && (
                  <span
                    className={cn(
                      'rounded-full px-1.5 py-0.5 font-mono text-[10px]',
                      selected ? 'bg-brand-100 text-brand-700' : 'bg-ink-100 text-ink-500',
                    )}
                  >
                    {t.count}
                  </span>
                )}
                <span
                  className={cn(
                    'absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand-gradient transition-opacity duration-300',
                    selected ? 'opacity-100' : 'opacity-0',
                  )}
                  aria-hidden="true"
                />
              </button>
            )
          })}
        </div>
      </div>
      {tabs.map((t, i) => (
        <section
          key={t.id}
          role="tabpanel"
          id={`${baseId}-panel-${t.id}`}
          aria-labelledby={`${baseId}-tab-${t.id}`}
          tabIndex={0}
          hidden={i !== active}
          className="animate-fade-up p-5 sm:p-8 lg:p-10"
        >
          {/* Anchor so #faqs etc. resolve to the panel even before hydration */}
          <span id={t.id} className="block -mt-28 pt-28" aria-hidden="true" />
          {t.content}
        </section>
      ))}
    </div>
  )
}
