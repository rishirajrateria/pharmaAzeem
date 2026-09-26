import { ArrowRight, ClipboardList, Mail } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

import { MoleculeField } from '../../visuals/MoleculeField'

/** Dark glass call-to-action band closing every catalogue page. */
export function CatalogCta({ ctaLabel, listName, title, description, className }: { ctaLabel: string; listName: string; title?: string; description?: string; className?: string }) {
  return (
    <div className={cn('mesh-bg-dark relative overflow-hidden rounded-[2.25rem] noise', className)}>
      <div className="absolute inset-0 grid-pattern opacity-40" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-10 -top-10 hidden w-[28rem] opacity-40 md:block" aria-hidden="true">
        <MoleculeField />
      </div>
      <div className="relative grid gap-8 p-8 sm:p-12 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:p-16">
        <div>
          <p className="eyebrow !text-brand-300">One inquiry, every product</p>
          <h2 className="heading-2 mt-4 text-white">{title || 'Add products to your list and request a single quotation'}</h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70">
            {description ||
              'Collect every formulation you are interested in, then send one inquiry. Our export team replies with pricing, minimum order quantities, lead times and registration documents for your market.'}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/inquiry" className="btn-primary">
              {ctaLabel} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/contact" className="btn-secondary !bg-white/10 !text-white hover:!text-white">
              <Mail className="h-4 w-4" aria-hidden="true" /> Contact export team
            </Link>
          </div>
        </div>
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {[
            { icon: ClipboardList, term: `Step 1 · Build your ${listName.toLowerCase()}`, desc: 'Use the “+” on any product card or the add button on a product page.' },
            { icon: Mail, term: `Step 2 · ${ctaLabel}`, desc: 'Add your company details and destination country – our export team replies with a quotation.' },
          ].map((s) => (
            <div key={s.term} className="glass-dark rounded-2xl p-4">
              <dt className="flex items-center gap-2 text-sm font-semibold text-white">
                <s.icon className="h-4 w-4 text-brand-300" aria-hidden="true" />
                {s.term}
              </dt>
              <dd className="mt-1 text-xs leading-relaxed text-white/60">{s.desc}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
