import { LayoutGrid } from 'lucide-react'
import Link from 'next/link'

import type { CategoryNode } from '@/lib/data'
import { cn } from '@/lib/utils'

import { Icon } from '../../ui/Icon'

/**
 * "Browse by category" chip strip. Horizontal scroll on small screens, wraps on larger ones.
 * `activeId` highlights the current category (none on /products).
 */
export function CategoryStrip({
  categories,
  activeId,
  showAll = true,
  className,
}: {
  categories: CategoryNode[]
  activeId?: number
  showAll?: boolean
  className?: string
}) {
  if (!categories.length) return null
  return (
    <nav
      aria-label={showAll ? 'Browse by category' : 'Related categories'}
      className={cn('relative', className)}
    >
      <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden">
        {showAll && (
          <li className="shrink-0">
            <Link
              href="/products"
              className={cn(
                'inline-flex items-center gap-2 border px-3.5 py-2 text-sm font-medium transition',
                !activeId
                  ? 'border-brand-600 bg-brand-gradient text-white shadow-[0_8px_20px_-8px_rgb(225_29_46_/_0.8)]'
                  : 'glass text-ink-800 hover:border-brand-300 hover:text-brand-700',
              )}
              aria-current={!activeId ? 'page' : undefined}
            >
              <LayoutGrid className="h-4 w-4" aria-hidden="true" />
              All products
            </Link>
          </li>
        )}
        {categories.map((c) => {
          const active = c.id === activeId
          return (
            <li key={c.id} className="shrink-0">
              <Link
                href={`/categories/${c.path}`}
                className={cn(
                  'inline-flex items-center gap-2 border px-3.5 py-2 text-sm font-medium transition',
                  active
                    ? 'border-brand-600 bg-brand-gradient text-white shadow-[0_8px_20px_-8px_rgb(225_29_46_/_0.8)]'
                    : 'glass text-ink-800 hover:border-brand-300 hover:text-brand-700',
                )}
                aria-current={active ? 'page' : undefined}
              >
                <Icon
                  name={c.icon}
                  className={cn('h-4 w-4', active ? 'text-white' : 'text-brand-600')}
                />
                {c.title}
                <span
                  className={cn('text-[10px]', active ? 'text-white/80' : 'text-ink-400')}
                >
                  {c.productCount}
                </span>
              </Link>
            </li>
          )
        })}
        <li className="shrink-0">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 border border-dashed border-brand-300 px-3.5 py-2 text-sm font-medium text-brand-700 transition hover:bg-brand-50"
          >
            All categories →
          </Link>
        </li>
      </ul>
    </nav>
  )
}
