'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

export type RegionNavItem = { key: string; label: string; count: number; anchor: string }

/**
 * Sticky pill navigation for the "Markets by region" section. Plain anchor links work
 * without JS; a single IntersectionObserver highlights the region currently in view.
 */
export function RegionNav({ items, className }: { items: RegionNavItem[]; className?: string }) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const sections = items
      .map((i) => document.getElementById(i.anchor))
      .filter((el): el is HTMLElement => Boolean(el))
    if (!sections.length) return
    const visible = new Map<string, number>()
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) visible.set(e.target.id, e.intersectionRatio)
          else visible.delete(e.target.id)
        })
        if (!visible.size) return
        // Prefer the section closest to the top of the viewport.
        const top = sections.find((s) => visible.has(s.id))
        if (top) setActive(top.id)
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.1, 0.5] },
    )
    sections.forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [items])

  return (
    <nav
      aria-label="Regions"
      className={cn('sticky top-28 z-30 -mx-4 px-4 sm:mx-0 sm:px-0', className)}
    >
      <ul className="scrollbar-thin glass-strong glass-edge flex snap-x gap-1 overflow-x-auto p-1.5 shadow-glass-lg">
        {items.map((item) => {
          const isActive = active === item.anchor
          return (
            <li key={item.key} className="snap-start">
              <a
                href={`#${item.anchor}`}
                aria-current={isActive ? 'location' : undefined}
                className={cn(
                  'inline-flex items-center gap-2 whitespace-nowrap px-3.5 py-2 text-xs font-semibold tracking-tight transition-all duration-300 sm:text-sm',
                  isActive
                    ? 'bg-brand-gradient text-white'
                    : 'text-ink-700 hover:bg-brand-50 hover:text-brand-700',
                )}
              >
                {item.label}
                <span
                  className={cn(
                    'px-1.5 py-0.5 text-[10px] leading-none',
                    isActive ? 'bg-white/20 text-white' : 'bg-brand-50 text-brand-700',
                  )}
                >
                  {item.count}
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
