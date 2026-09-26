import { ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'

import { breadcrumbJsonLd, type Crumb } from '@/lib/seo'
import { cn } from '@/lib/utils'

import { JsonLd } from './seo/JsonLd'

/** Visible breadcrumbs + BreadcrumbList JSON-LD. Pass crumbs WITHOUT the home entry. */
export function Breadcrumbs({ crumbs, className }: { crumbs: Crumb[]; className?: string }) {
  const all: Crumb[] = [{ name: 'Home', path: '/' }, ...crumbs]
  return (
    <nav aria-label="Breadcrumb" className={cn('text-xs text-ink-500', className)}>
      <JsonLd data={{ '@context': 'https://schema.org', ...breadcrumbJsonLd(all) }} />
      <ol className="flex flex-wrap items-center gap-1">
        {all.map((c, i) => {
          const last = i === all.length - 1
          return (
            <li key={c.path} className="inline-flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3 w-3 text-ink-300" aria-hidden="true" />}
              {last ? (
                <span className="font-medium text-ink-800" aria-current="page">
                  {c.name}
                </span>
              ) : (
                <Link href={c.path} className="inline-flex items-center gap-1 hover:text-brand-700">
                  {i === 0 && <Home className="h-3 w-3" aria-hidden="true" />}
                  {c.name}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
