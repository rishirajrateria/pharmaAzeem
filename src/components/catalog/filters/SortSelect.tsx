'use client'

import { ArrowUpDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useId, useTransition } from 'react'

import type { ProductSort } from '@/lib/data'
import { cn } from '@/lib/utils'

type Option = { value: ProductSort; label: string }

/**
 * Sort control. Pushes `?sort=` to the router (keeping every other param).
 * Wrapped in a GET form so it still works with JavaScript disabled.
 */
export function SortSelect({
  basePath,
  value,
  options,
  baseParams,
  className,
}: {
  basePath: string
  value: ProductSort
  options: Option[]
  baseParams: [string, string][]
  className?: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const id = useId()

  const onChange = (sort: string) => {
    const next = new URLSearchParams(baseParams)
    if (sort !== options[0]?.value) next.set('sort', sort)
    const qs = next.toString()
    startTransition(() => router.push(qs ? `${basePath}?${qs}` : basePath, { scroll: false }))
  }

  return (
    <form method="get" action={basePath} className={cn('flex items-center gap-2', className)}>
      {baseParams.map(([k, v], i) => (
        <input key={`${k}-${i}`} type="hidden" name={k} value={v} />
      ))}
      <label
        htmlFor={id}
        className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-ink-500"
      >
        <ArrowUpDown className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">Sort by</span>
        <span className="sr-only sm:hidden">Sort by</span>
        <span className="sr-only"> (updates results automatically)</span>
      </label>
      <select
        key={value}
        id={id}
        name="sort"
        defaultValue={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={pending}
        className="input-glass !w-auto !py-2 pr-8 text-xs font-semibold text-ink-900 disabled:opacity-60"
        aria-busy={pending}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <noscript>
        <button type="submit" className="btn-secondary !py-2 text-xs">
          Apply
        </button>
      </noscript>
    </form>
  )
}
