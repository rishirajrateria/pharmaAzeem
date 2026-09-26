import Link from 'next/link'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { Icon } from '../ui/Icon'

export type Fact = { label: string; value: ReactNode; href?: string; icon?: string }

/** Definition list of key facts in a glass panel – real labels so search engines & LLMs can extract them. */
export function FactList({ facts, className, columns = 3 }: { facts: Fact[]; className?: string; columns?: 2 | 3 }) {
  return (
    <dl className={cn('grid gap-px overflow-hidden rounded-3xl border border-white/70 bg-brand-100/40 shadow-glass', columns === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2', className)}>
      {facts.map((f) => (
        <div key={f.label} className="bg-white/75 p-5 backdrop-blur">
          <dt className="flex items-center gap-3 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-ink-500">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100" aria-hidden="true">
              <Icon name={f.icon} className="h-4 w-4" />
            </span>
            {f.label}
          </dt>
          <dd className="mt-1 pl-12 text-sm font-medium leading-snug text-ink-950">
            {f.href ? (
              <Link href={f.href} className="text-brand-700 underline decoration-brand-300 underline-offset-4 hover:decoration-brand-600">
                {f.value}
              </Link>
            ) : (
              f.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  )
}
