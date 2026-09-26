'use client'

import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

type Stat = { value: string; suffix?: string | null; label: string; id?: string | null }

/** Animated count-up stat. Renders the final value server-side so SEO/LLM crawlers read real numbers. */
function Counter({ value, suffix }: { value: string; suffix?: string | null }) {
  const numeric = Number(value.replace(/[^0-9.]/g, ''))
  const isNumber = !Number.isNaN(numeric) && /^[0-9.,]+$/.test(value.trim())
  const [display, setDisplay] = useState(value)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!isNumber || !ref.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = ref.current
    let raf = 0
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        obs.disconnect()
        const start = performance.now()
        const dur = 1400
        const decimals = (value.split('.')[1] || '').length
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / dur)
          const eased = 1 - Math.pow(1 - p, 4)
          setDisplay((numeric * eased).toFixed(decimals))
          if (p < 1) raf = requestAnimationFrame(tick)
          else setDisplay(value)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    obs.observe(el)
    return () => {
      obs.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [isNumber, numeric, value])
  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  )
}

export function Stats({ stats, className, variant = 'glass' }: { stats?: Stat[] | null; className?: string; variant?: 'glass' | 'plain' | 'dark' }) {
  if (!stats?.length) return null
  return (
    <dl className={cn('grid gap-4', stats.length >= 4 ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-3', className)}>
      {stats.map((s, i) => (
        <div key={s.id || i} className={cn('flex flex-col rounded-3xl px-5 py-6', variant === 'glass' && 'glass', variant === 'dark' && 'glass-dark', variant === 'plain' && 'border border-ink-100 bg-white')}>
          <dt className={cn('order-2 mt-1 text-xs font-medium uppercase tracking-[0.14em]', variant === 'dark' ? 'text-white/60' : 'text-ink-500')}>{s.label}</dt>
          <dd className={cn('order-1 text-3xl font-semibold tracking-tight sm:text-4xl', variant === 'dark' ? 'text-white' : 'text-gradient')}>
            <Counter value={s.value} suffix={s.suffix} />
          </dd>
        </div>
      ))}
    </dl>
  )
}
