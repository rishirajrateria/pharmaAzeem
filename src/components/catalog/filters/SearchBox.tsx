import { Search, X } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

import { removeHref, type ParsedFilters } from './parseFilters'

/**
 * Plain GET search form – no JavaScript required. Active facets and sort are carried
 * along as hidden inputs so searching never drops the visitor's filters.
 */
export function SearchBox({ basePath, filters, placeholder = 'Search by product, generic name or SKU…', className }: { basePath: string; filters: ParsedFilters; placeholder?: string; className?: string }) {
  const hidden = [...filters.params.entries()].filter(([k]) => k !== 'q' && k !== 'page')
  const clear = filters.q ? removeHref(basePath, filters, { param: 'q', value: filters.q, label: '', group: '' }) : null
  return (
    <form role="search" method="get" action={basePath} className={cn('relative', className)}>
      {hidden.map(([k, v], i) => (
        <input key={`${k}-${i}`} type="hidden" name={k} value={v} />
      ))}
      <label htmlFor="catalog-search" className="sr-only">
        Search products
      </label>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
      <input
        id="catalog-search"
        type="search"
        name="q"
        defaultValue={filters.q}
        placeholder={placeholder}
        autoComplete="off"
        autoFocus={filters.focusSearch}
        enterKeyHint="search"
        maxLength={80}
        className="input-glass !rounded-full !py-2.5 !pl-11 !pr-24 text-sm"
      />
      <div className="absolute inset-y-0 right-1.5 flex items-center gap-1">
        {clear && (
          <Link href={clear} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-500 hover:bg-brand-50 hover:text-brand-700" aria-label="Clear search">
            <X className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
        <button type="submit" className="btn-primary !px-4 !py-1.5 text-xs">
          Search
        </button>
      </div>
    </form>
  )
}
