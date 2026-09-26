import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import type { Country } from '@/payload-types'

import { countryPath, regionAnchor } from './regions'

/** Row of small flag + name links to sibling markets – strengthens internal linking between country pages. */
export function MarketLinks({ countries, regionKey, regionLabel, title }: { countries: Country[]; regionKey: string; regionLabel: string; title: string }) {
  if (!countries.length) return null
  return (
    <nav aria-label={title} className="glass rounded-3xl p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-ink-950">{title}</h2>
        <Link href={`/global-presence#${regionAnchor(regionKey)}`} className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline">
          All markets in {regionLabel} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
      <ul className="mt-4 flex flex-wrap gap-2" role="list">
        {countries.map((c) => (
          <li key={c.id}>
            <Link href={countryPath(c)} className="chip !py-1.5 !text-ink-800 hover:border-brand-400 hover:bg-white hover:text-brand-700">
              <span aria-hidden="true" className="text-base leading-none">
                {c.flag}
              </span>
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
