'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'
import type { Facility } from '@/payload-types'

import { FACILITY_TYPE } from './facilities'

export type FacilityNavItem = { anchor: string; code: string | null; label: string; type: Facility['type'] }

/**
 * Sticky glass pill bar listing every facility. Plain anchor links (work without JS);
 * one IntersectionObserver highlights the facility currently in view.
 */
export function FacilityNav({ items, className }: { items: FacilityNavItem[]; className?: string }) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const targets = items.map((i) => document.getElementById(i.anchor)).filter((el): el is HTMLElement => Boolean(el))
    if (!targets.length) return
    const visible = new Set<string>()
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id)))
        const first = targets.find((t) => visible.has(t.id))
        if (first) setActive(first.id)
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.05, 0.25] },
    )
    targets.forEach((t) => obs.observe(t))
    return () => obs.disconnect()
  }, [items])

  useEffect(() => {
    // Keep the active pill in view inside the scrollable bar (mobile).
    if (!active) return
    const el = document.querySelector<HTMLElement>(`[data-facility-pill="${active}"]`)
    el?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [active])

  if (items.length < 2) return null

  return (
    <nav aria-label="Facilities" className={cn('sticky top-28 z-30 -mx-4 px-4 sm:mx-0 sm:px-0', className)}>
      <ul className="scrollbar-thin glass-strong glass-edge flex snap-x gap-1 overflow-x-auto rounded-full p-1.5 shadow-glass-lg">
        {items.map((item) => {
          const isActive = active === item.anchor
          const TypeIcon = (FACILITY_TYPE[item.type] || FACILITY_TYPE.formulation).icon
          return (
            <li key={item.anchor} className="snap-start" data-facility-pill={item.anchor}>
              <a
                href={`#${item.anchor}`}
                aria-current={isActive ? 'location' : undefined}
                className={cn(
                  'inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-semibold tracking-tight transition-all duration-300 sm:text-sm',
                  isActive ? 'bg-brand-gradient text-white shadow-[0_8px_20px_-8px_rgb(225_29_46_/_0.8)]' : 'text-ink-700 hover:bg-brand-50 hover:text-brand-700',
                )}
              >
                <TypeIcon className={cn('h-3.5 w-3.5', isActive ? 'text-white' : 'text-brand-600')} aria-hidden="true" />
                {item.code && <span className={cn('font-mono text-[10px] uppercase tracking-[0.16em]', isActive ? 'text-white/80' : 'text-brand-600')}>{item.code}</span>}
                <span>{item.label}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
