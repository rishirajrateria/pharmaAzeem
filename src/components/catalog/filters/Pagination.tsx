import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

import { pageHref, type ParsedFilters } from './parseFilters'

/** Builds the compact page list: 1 … 4 5 [6] 7 8 … 20 */
const pageList = (current: number, total: number): (number | 'gap')[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = new Set<number>([1, total, current, current - 1, current + 1])
  if (current <= 3) [2, 3, 4].forEach((p) => pages.add(p))
  if (current >= total - 2) [total - 1, total - 2, total - 3].forEach((p) => pages.add(p))
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  const out: (number | 'gap')[] = []
  sorted.forEach((p, i) => {
    if (i > 0 && p - (sorted[i - 1] as number) > 1) out.push('gap')
    out.push(p)
  })
  return out
}

/** Server-rendered pagination. Links carry every active filter; prev/next get `rel` hints. */
export function Pagination({
  basePath,
  filters,
  page,
  totalPages,
  className,
}: {
  basePath: string
  filters: ParsedFilters
  page: number
  totalPages: number
  className?: string
}) {
  if (totalPages <= 1) return null
  const items = pageList(page, totalPages)
  const linkBase =
    'inline-flex h-10 min-w-10 items-center justify-center px-3 text-sm font-medium transition'
  return (
    <nav
      aria-label="Pagination"
      className={cn('flex flex-wrap items-center justify-between gap-3', className)}
    >
      <p className="text-xs text-ink-500">
        Page <span className="font-semibold text-ink-900">{page}</span> of {totalPages}
      </p>
      <ul className="flex flex-wrap items-center gap-1.5">
        <li>
          {page > 1 ? (
            <Link
              href={pageHref(basePath, filters, page - 1)}
              rel="prev"
              className={cn(linkBase, 'glass text-ink-800 hover:text-brand-700')}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              <span className="ml-1 hidden sm:inline">Previous</span>
            </Link>
          ) : (
            <span className={cn(linkBase, 'cursor-not-allowed text-ink-300')} aria-disabled="true">
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              <span className="ml-1 hidden sm:inline">Previous</span>
            </span>
          )}
        </li>
        {items.map((it, i) =>
          it === 'gap' ? (
            <li key={`gap-${i}`} className="px-1 text-ink-400" aria-hidden="true">
              …
            </li>
          ) : (
            <li key={it}>
              {it === page ? (
                <span className={cn(linkBase, 'bg-brand-gradient text-white')} aria-current="page">
                  {it}
                </span>
              ) : (
                <Link
                  href={pageHref(basePath, filters, it)}
                  rel={it === page - 1 ? 'prev' : it === page + 1 ? 'next' : undefined}
                  className={cn(linkBase, 'glass text-ink-800 hover:text-brand-700')}
                  aria-label={`Page ${it}`}
                >
                  {it}
                </Link>
              )}
            </li>
          ),
        )}
        <li>
          {page < totalPages ? (
            <Link
              href={pageHref(basePath, filters, page + 1)}
              rel="next"
              className={cn(linkBase, 'glass text-ink-800 hover:text-brand-700')}
              aria-label="Next page"
            >
              <span className="mr-1 hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          ) : (
            <span className={cn(linkBase, 'cursor-not-allowed text-ink-300')} aria-disabled="true">
              <span className="mr-1 hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </span>
          )}
        </li>
      </ul>
    </nav>
  )
}
