import { ArrowRight, ClipboardList, Mail } from 'lucide-react'

import { cn } from '@/lib/utils'

import { Button } from '../../ui'

/** Solid brand call-to-action band closing every catalogue page. */
export function CatalogCta({
  ctaLabel,
  listName,
  title,
  description,
  className,
}: {
  ctaLabel: string
  listName: string
  title?: string
  description?: string
  className?: string
}) {
  return (
    <div className={cn('bg-brand-band text-white', className)}>
      <div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:p-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-100">
            One inquiry, every product
          </p>
          <h2 className="heading-2 mt-3 text-white">
            {title || 'Add products to your list and request a single quotation'}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85">
            {description ||
              'Collect every formulation you are interested in, then send one inquiry. Our export team replies with pricing, minimum order quantities, lead times and registration documents for your market.'}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/inquiry" variant="light">
              {ctaLabel} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button href="/contact" variant="outline-light">
              <Mail className="h-4 w-4" aria-hidden="true" /> Contact export team
            </Button>
          </div>
        </div>
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {[
            {
              icon: ClipboardList,
              term: `Step 1 · Build your ${listName.toLowerCase()}`,
              desc: 'Use the “+” on any product card or the add button on a product page.',
            },
            {
              icon: Mail,
              term: `Step 2 · ${ctaLabel}`,
              desc: 'Add your company details and destination country – our export team replies with a quotation.',
            },
          ].map((s) => (
            <div key={s.term} className="border border-white/30 p-4 rounded-lg">
              <dt className="flex items-center gap-2 text-sm font-semibold text-white">
                <s.icon className="h-4 w-4" aria-hidden="true" />
                {s.term}
              </dt>
              <dd className="mt-1 text-xs leading-relaxed text-white/80">{s.desc}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
