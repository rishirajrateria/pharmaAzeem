'use client'

import { useEffect, useRef, type ComponentProps, type ElementType } from 'react'

import { cn } from '@/lib/utils'

/**
 * Scroll-reveal wrapper. Pure CSS transition triggered by a single shared IntersectionObserver.
 * Renders children immediately for crawlers (no JS = still visible, see globals.css reduced-motion rules).
 */
let observer: IntersectionObserver | null = null
const getObserver = () => {
  if (observer) return observer
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible')
          observer?.unobserve(e.target)
        }
      })
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  )
  return observer
}

export function Reveal({
  delay = 0,
  className,
  as: Tag = 'div',
  children,
  ...p
}: { delay?: number; as?: 'div' | 'section' | 'li' | 'article' | 'span' } & ComponentProps<'div'>) {
  const ref = useRef<HTMLElement | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible')
      return
    }
    const obs = getObserver()
    obs.observe(el)
    return () => obs.unobserve(el)
  }, [])
  const Comp = Tag as ElementType
  return (
    <Comp
      ref={ref}
      className={cn('reveal', className)}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
      {...p}
    >
      {children}
    </Comp>
  )
}
