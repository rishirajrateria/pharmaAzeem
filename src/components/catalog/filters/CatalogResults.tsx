import type { PaginatedDocs } from 'payload'

import type { Product } from '@/payload-types'
import type { CommerceLabels } from '@/lib/commerce'
import type { Facets } from '@/lib/data'
import { cn } from '@/lib/utils'

import { FilterSidebar } from './FilterSidebar'
import { MobileFilters, MobileFiltersTrigger } from './MobileFilters'
import { Pagination } from './Pagination'
import {
  describeFilters,
  PAGE_SIZE,
  resultRange,
  SORT_OPTIONS,
  type ParsedFilters,
} from './parseFilters'
import { ProductGrid } from './ProductGrid'
import { SearchBox } from './SearchBox'
import { SortSelect } from './SortSelect'

type Props = {
  /** Path the filter links are built on (`/products` or `/categories/<path>`). */
  basePath: string
  filters: ParsedFilters
  facets: Facets
  result: PaginatedDocs<Product>
  labels: CommerceLabels
  /** Fallback products for the empty state. */
  suggestions?: Product[]
  /** e.g. "in Antibiotics" – appended to the results sentence. */
  scopeLabel?: string
  priorityCount?: number
  id?: string
  className?: string
}

/**
 * The e-commerce style two-column results block shared by /products and every
 * category page: sticky glass sidebar (slide-over on mobile), toolbar with
 * search + sort + result count, product grid and pagination.
 */
export function CatalogResults({
  basePath,
  filters,
  facets,
  result,
  labels,
  suggestions,
  scopeLabel,
  priorityCount,
  id = 'catalog',
  className,
}: Props) {
  const { totalDocs, totalPages, docs } = result
  const page = result.page ?? filters.page
  const limit = result.limit ?? PAGE_SIZE
  const { from, to } = resultRange(page, limit, totalDocs)
  const summary = describeFilters(filters)
  const sortOptions = SORT_OPTIONS.filter((o) => !o.priced || labels.showPrices)
  const sortBaseParams = [...filters.params.entries()].filter(([k]) => k !== 'sort' && k !== 'page')
  const noun = totalDocs === 1 ? 'product' : 'products'

  return (
    <div
      id={id}
      className={cn(
        'scroll-mt-28 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8',
        className,
      )}
    >
      <aside
        className="scrollbar-thin max-lg:contents lg:sticky lg:top-28 lg:-mx-1 lg:max-h-[calc(100dvh-8rem)] lg:self-start lg:overflow-y-auto lg:px-1 lg:pb-4"
        aria-label="Product filters"
      >
        <MobileFilters resultsLabel={`Show ${totalDocs} ${noun}`}>
          <FilterSidebar basePath={basePath} filters={filters} facets={facets} />
        </MobileFilters>
      </aside>

      <div className="min-w-0">
        <div className="glass p-3 sm:p-4">
          <SearchBox basePath={basePath} filters={filters} />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink-600" role="status">
              {totalDocs > 0 ? (
                <>
                  Showing{' '}
                  <span className="font-semibold text-ink-950">
                    {from}–{to}
                  </span>{' '}
                  of <span className="font-semibold text-ink-950">{totalDocs}</span> {noun}
                  {scopeLabel ? ` ${scopeLabel}` : ''}
                </>
              ) : (
                <>
                  No {noun} found{scopeLabel ? ` ${scopeLabel}` : ''}
                </>
              )}
              {summary && (
                <span className="block text-xs text-ink-500 sm:inline sm:before:mx-2 sm:before:content-['·']">
                  {summary}
                </span>
              )}
            </p>
            <div className="flex items-center gap-2">
              <MobileFiltersTrigger activeCount={filters.active.length} />
              <SortSelect
                basePath={basePath}
                value={filters.sort}
                options={sortOptions}
                baseParams={sortBaseParams}
              />
            </div>
          </div>
        </div>

        <ProductGrid
          products={docs}
          labels={labels}
          basePath={basePath}
          filters={filters}
          suggestions={suggestions}
          priorityCount={priorityCount}
          className="mt-6"
        />

        <Pagination
          basePath={basePath}
          filters={filters}
          page={page}
          totalPages={totalPages}
          className="mt-10"
        />
      </div>
    </div>
  )
}
