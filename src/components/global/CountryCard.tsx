import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

import type { Category, Country } from '@/payload-types'
import { cn, truncate } from '@/lib/utils'

import { countryPath, regulatorShort } from './regions'

type Props = { country: Country; className?: string; compact?: boolean }

/**
 * Glass market card: big flag, name, "since" line, regulator and the categories in demand
 * (populated at depth ≥ 1 → linked to their category pages). Whole card is a link; chips stay clickable.
 */
export function CountryCard({ country, className, compact }: Props) {
  const href = countryPath(country)
  const cats = (country.popularCategories || []).filter(
    (c): c is Category => typeof c === 'object' && c !== null && Boolean(c.path),
  )
  const regulator = regulatorShort(country.regulatoryAuthority)
  return (
    <article
      className={cn(
        'group glass-card relative flex flex-col',
        compact ? 'p-4' : 'p-5 sm:p-6',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            'flex shrink-0 items-center justify-center bg-white leading-none shadow-glass ring-1 ring-brand-100',
            compact ? 'h-11 w-11 text-2xl' : 'h-14 w-14 text-3xl sm:text-4xl',
          )}
          aria-hidden="true"
        >
          {country.flag || country.isoCode}
        </span>
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-ink-100 bg-white/60 text-ink-500 transition group-hover:border-brand-300 group-hover:bg-brand-600 group-hover:text-white">
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <h3 className={cn('font-semibold text-ink-950', compact ? 'mt-3 text-base' : 'mt-4 text-lg')}>
        <Link
          href={href}
          className="after:absolute after:inset-0 after:content-[''] hover:text-brand-700"
        >
          {country.name}
        </Link>
      </h3>
      <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-brand-600">
        {country.sinceYear ? `Since ${country.sinceYear}` : 'Active market'}
        <span className="text-ink-300"> · </span>
        {country.isoCode}
      </p>
      {country.regulatoryAuthority && (
        <p className="mt-2 line-clamp-2 text-sm text-ink-600" title={country.regulatoryAuthority}>
          <span className="font-medium text-ink-800">Regulator:</span>{' '}
          {compact ? regulator : truncate(country.regulatoryAuthority, 72)}
        </p>
      )}
      {!compact && cats.length > 0 && (
        <ul
          className="relative z-10 mt-4 flex flex-wrap gap-1.5"
          aria-label={`Categories in demand in ${country.name}`}
        >
          {cats.slice(0, 3).map((c) => (
            <li key={c.id}>
              <Link
                href={`/categories/${c.path}`}
                className="chip !py-0.5 hover:border-brand-400 hover:bg-white"
              >
                {c.title}
              </Link>
            </li>
          ))}
          {cats.length > 3 && (
            <li className="chip !py-0.5 text-ink-500">+{cats.length - 3} more</li>
          )}
        </ul>
      )}
    </article>
  )
}
