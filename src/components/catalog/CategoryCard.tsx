import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

import type { Category } from '@/payload-types'
import { cn } from '@/lib/utils'

import { Media } from '../Media'
import { Icon } from '../ui/Icon'

type Props = {
  category: Category & {
    productCount?: number
    children?: { id: number; title: string; path?: string | null }[]
  }
  className?: string
  compact?: boolean
}

/** Glass category tile with icon, product count and sub-category chips. */
export function CategoryCard({ category, className, compact }: Props) {
  const href = `/categories/${category.path}`
  return (
    <article
      className={cn('group glass-card relative flex flex-col overflow-hidden !p-0', className)}
    >
      {!compact && category.image && (
        <Link
          href={href}
          className="relative block aspect-[16/9] overflow-hidden"
          aria-hidden="true"
          tabIndex={-1}
        >
          <Media media={category.image} size="card" fill sizes="(max-width: 768px) 100vw, 33vw" />
        </Link>
      )}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-brand-gradient text-white rounded-lg">
            <Icon name={category.icon} className="h-5 w-5" />
          </span>
          <span className="inline-flex h-9 w-9 items-center justify-center border border-ink-100 bg-white/60 text-ink-500 transition group-hover:border-brand-300 group-hover:bg-brand-600 group-hover:text-white rounded-lg">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-ink-950">
          <Link href={href} className="after:absolute after:inset-0 after:content-['']">
            {category.title}
          </Link>
        </h3>
        {category.shortDescription && (
          <p className="mt-1.5 line-clamp-2 text-sm text-ink-600">{category.shortDescription}</p>
        )}
        {typeof category.productCount === 'number' && (
          <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-brand-600">
            {category.productCount} products
          </p>
        )}
        {category.children && category.children.length > 0 && (
          <ul className="relative z-10 mt-4 flex flex-wrap gap-1.5">
            {category.children.slice(0, 4).map((s) => (
              <li key={s.id}>
                <Link
                  href={`/categories/${s.path}`}
                  className="chip !py-0.5 hover:border-brand-400 hover:bg-white"
                >
                  {s.title}
                </Link>
              </li>
            ))}
            {category.children.length > 4 && (
              <li className="chip !py-0.5 text-ink-500">+{category.children.length - 4} more</li>
            )}
          </ul>
        )}
      </div>
    </article>
  )
}
