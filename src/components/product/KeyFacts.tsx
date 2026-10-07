import type { Product } from '@/payload-types'
import { cn } from '@/lib/utils'

import { Icon } from '../ui/Icon'
import { AVAILABILITY_LABEL, rxLongLabel } from './labels'

export type KeyFact = { label: string; value: string; icon: string }

/** Builds the at-a-glance facts from a product, skipping empty fields. */
export function buildKeyFacts(product: Product): KeyFact[] {
  const facts: (KeyFact | false)[] = [
    { label: 'Generic name', value: product.genericName, icon: 'dna' },
    !!product.therapeuticClass && {
      label: 'Therapeutic class',
      value: product.therapeuticClass,
      icon: 'activity',
    },
    !!product.dosageForm && { label: 'Dosage form', value: product.dosageForm, icon: 'pill' },
    !!product.strength && { label: 'Strength', value: product.strength, icon: 'gauge' },
    !!product.route && { label: 'Route of administration', value: product.route, icon: 'route' },
    !!rxLongLabel(product.prescriptionStatus) && {
      label: 'Prescription status',
      value: rxLongLabel(product.prescriptionStatus) as string,
      icon: 'clipboard-check',
    },
    !!product.packSize && { label: 'Pack size', value: product.packSize, icon: 'package' },
    !!product.packaging && { label: 'Packaging', value: product.packaging, icon: 'boxes' },
    !!product.shelfLife && { label: 'Shelf life', value: product.shelfLife, icon: 'timer' },
    !!product.storage && { label: 'Storage', value: product.storage, icon: 'thermometer' },
    !!product.minOrderQuantity && {
      label: 'Minimum order',
      value: `${product.minOrderQuantity.toLocaleString('en')} ${product.minOrderQuantity === 1 ? 'unit' : 'units'}`,
      icon: 'layers',
    },
    !!product.availability && {
      label: 'Availability',
      value: AVAILABILITY_LABEL[product.availability],
      icon: 'package-check',
    },
    !!product.sku && { label: 'SKU', value: product.sku, icon: 'fingerprint' },
  ]
  return facts.filter((f): f is KeyFact => Boolean(f))
}

/**
 * Definition list of product facts in a glass panel. Real <dt>/<dd> labels so search
 * engines and LLMs can extract "Strength: 200 mg" style pairs verbatim.
 */
export function KeyFacts({
  facts,
  className,
  id,
}: {
  facts: KeyFact[]
  className?: string
  id?: string
}) {
  if (!facts.length) return null
  return (
    <dl
      id={id}
      className={cn(
        'grid gap-px overflow-hidden border border-white/70 bg-brand-100/40 shadow-glass sm:grid-cols-2',
        className,
      )}
    >
      {facts.map((f) => (
        <div key={f.label} className="flex gap-3 bg-white px-4 py-3.5 sm:px-5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-brand-50 text-brand-600 ring-1 ring-brand-100">
            <Icon name={f.icon} className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0">
            <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-500">
              {f.label}
            </dt>
            <dd className="mt-0.5 text-sm font-medium leading-snug text-ink-950">{f.value}</dd>
          </div>
        </div>
      ))}
    </dl>
  )
}
