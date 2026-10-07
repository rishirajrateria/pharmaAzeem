import { Check, ChevronDown, MessageCircleQuestion, X } from 'lucide-react'
import Link from 'next/link'

import type { Facets } from '@/lib/data'
import { cn } from '@/lib/utils'

import {
  clearHref,
  facetValueLabel,
  removeHref,
  toggleHref,
  visibleFacetGroups,
  type FacetParam,
  type ParsedFilters,
} from './parseFilters'

const VISIBLE_OPTIONS = 7

/**
 * Faceted filter sidebar. Pure server markup: every option is a link that toggles
 * a query param, groups are native <details> (collapsible without JS) and the
 * active filters row lets visitors remove one filter at a time.
 */
export function FilterSidebar({
  basePath,
  filters,
  facets,
  className,
}: {
  basePath: string
  filters: ParsedFilters
  facets: Facets
  className?: string
}) {
  const groups = visibleFacetGroups(facets)
  const activeCount = filters.active.length

  return (
    <div className={cn('glass p-5', className)}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-900">
          Filters
          {activeCount > 0 && (
            <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center bg-brand-gradient px-1.5 text-[10px] text-white">
              {activeCount}
            </span>
          )}
        </h2>
        {filters.hasFilters && (
          <Link
            href={clearHref(basePath, filters)}
            className="text-xs font-medium text-brand-700 underline-offset-4 hover:underline"
          >
            Clear all
          </Link>
        )}
      </div>

      {filters.active.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Active filters">
          {filters.active.map((a) => (
            <li key={`${a.param}-${a.value}`}>
              <Link
                href={removeHref(basePath, filters, a)}
                className="chip !bg-brand-600 !border-brand-600 !text-white hover:!bg-brand-700"
                aria-label={`Remove filter: ${a.group} ${a.label}`}
              >
                <span className="max-w-[10rem] truncate">{a.label}</span>
                <X className="h-3 w-3" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      )}

      {groups.length === 0 ? (
        <p className="mt-5 text-xs text-ink-500">No filters are available for this selection.</p>
      ) : (
        <div className="mt-5 divide-y divide-ink-100">
          {groups.map((g) => {
            const options = facets[g.facet]
            const selected = filters.values[g.param as FacetParam]
            const head = options.slice(0, VISIBLE_OPTIONS)
            const tail = options.slice(VISIBLE_OPTIONS)
            return (
              <details key={g.param} open className="group/facet py-4 first:pt-0 last:pb-0">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-ink-950">
                  <span>
                    {g.label}
                    {selected.length > 0 && (
                      <span className="ml-2 text-[10px] font-medium text-brand-600">
                        {selected.length} selected
                      </span>
                    )}
                  </span>
                  <ChevronDown
                    className="h-4 w-4 text-ink-400 transition-transform duration-300 group-open/facet:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <ul className="mt-3 space-y-1">
                  {head.map((o) => (
                    <FacetOption
                      key={o.value}
                      basePath={basePath}
                      filters={filters}
                      param={g.param as FacetParam}
                      value={o.value}
                      count={o.count}
                      selected={selected.includes(o.value)}
                    />
                  ))}
                </ul>
                {tail.length > 0 && (
                  <details className="group/more mt-1">
                    <summary className="cursor-pointer list-none py-1.5 text-xs font-medium text-brand-700 hover:underline">
                      <span className="group-open/more:hidden">Show {tail.length} more</span>
                      <span className="hidden group-open/more:inline">Show fewer</span>
                    </summary>
                    <ul className="space-y-1">
                      {tail.map((o) => (
                        <FacetOption
                          key={o.value}
                          basePath={basePath}
                          filters={filters}
                          param={g.param as FacetParam}
                          value={o.value}
                          count={o.count}
                          selected={selected.includes(o.value)}
                        />
                      ))}
                    </ul>
                  </details>
                )}
              </details>
            )
          })}
        </div>
      )}

      <div className="glass-red mt-5 p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-ink-950">
          <MessageCircleQuestion className="h-4 w-4 text-brand-600" aria-hidden="true" />
          Need help choosing?
        </p>
        <p className="mt-1 text-xs leading-relaxed text-ink-600">
          Tell our export team the molecules, strengths and market you need – we will shortlist the
          right formulations and dossiers.
        </p>
        <Link
          href="/contact"
          className="mt-3 inline-flex text-xs font-semibold text-brand-700 underline-offset-4 hover:underline"
        >
          Talk to a specialist →
        </Link>
      </div>
    </div>
  )
}

function FacetOption({
  basePath,
  filters,
  param,
  value,
  count,
  selected,
}: {
  basePath: string
  filters: ParsedFilters
  param: FacetParam
  value: string
  count: number
  selected: boolean
}) {
  const label = facetValueLabel(value)
  return (
    <li>
      <Link
        href={toggleHref(basePath, filters, param, value)}
        aria-current={selected ? 'true' : undefined}
        aria-label={`${selected ? 'Remove' : 'Add'} filter ${label} (${count})`}
        className={cn(
          'group/opt flex items-center gap-2.5 px-2 py-1.5 text-sm transition',
          selected
            ? 'bg-white/80 font-medium text-brand-700'
            : 'text-ink-700 hover:bg-white/60 hover:text-ink-950',
        )}
      >
        <span
          className={cn(
            'flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition',
            selected
              ? 'border-brand-600 bg-brand-gradient text-white'
              : 'border-ink-300 bg-white group-hover/opt:border-brand-400',
          )}
          aria-hidden="true"
        >
          {selected && <Check className="h-3 w-3" strokeWidth={3} />}
        </span>
        <span className="flex-1 truncate">{label}</span>
        <span className="text-[11px] text-ink-400">{count}</span>
      </Link>
    </li>
  )
}
