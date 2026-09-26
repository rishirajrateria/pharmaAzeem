import type { Product } from '@/payload-types'

import { buildKeyFacts } from './KeyFacts'

/**
 * Composition (active ingredients) and specification tables.
 * Plain semantic tables with <caption> and <th scope> so the data stays machine-readable.
 */
export function SpecTable({ product }: { product: Product }) {
  const ingredients = product.activeIngredients || []
  const specs = product.specifications || []
  const facts = buildKeyFacts(product)
  return (
    <div className="space-y-8">
      {ingredients.length > 0 && (
        <div>
          <h3 className="heading-3">Composition</h3>
          <p className="mt-1 text-sm text-ink-600">Each unit dose of {product.title} contains:</p>
          <div className="mt-4 overflow-hidden rounded-2xl border border-white/80 shadow-glass">
            <table className="w-full text-sm">
              <caption className="sr-only">Active ingredients in {product.title}</caption>
              <thead>
                <tr className="bg-brand-50 text-left">
                  <th scope="col" className="px-4 py-2.5 font-semibold text-ink-900">
                    Active ingredient
                  </th>
                  <th scope="col" className="px-4 py-2.5 font-semibold text-ink-900">
                    Strength
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/70">
                {ingredients.map((a, i) => (
                  <tr key={a.id || i} className="border-t border-ink-100">
                    <th scope="row" className="px-4 py-2.5 text-left font-medium text-ink-950">
                      {a.name}
                    </th>
                    <td className="px-4 py-2.5 text-ink-700">{a.strength || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div>
        <h3 className="heading-3">Specifications</h3>
        <p className="mt-1 text-sm text-ink-600">
          Technical data for tender and registration files.
        </p>
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/80 shadow-glass">
          <table className="w-full text-sm">
            <caption className="sr-only">Specifications of {product.title}</caption>
            <thead>
              <tr className="bg-brand-50 text-left">
                <th scope="col" className="w-2/5 px-4 py-2.5 font-semibold text-ink-900">
                  Parameter
                </th>
                <th scope="col" className="px-4 py-2.5 font-semibold text-ink-900">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/70">
              {facts.map((f) => (
                <tr key={f.label} className="border-t border-ink-100">
                  <th scope="row" className="px-4 py-2.5 text-left font-medium text-ink-950">
                    {f.label}
                  </th>
                  <td className="px-4 py-2.5 text-ink-700">{f.value}</td>
                </tr>
              ))}
              {specs.map((s, i) => (
                <tr key={s.id || i} className="border-t border-ink-100">
                  <th scope="row" className="px-4 py-2.5 text-left font-medium text-ink-950">
                    {s.label}
                  </th>
                  <td className="px-4 py-2.5 text-ink-700">{s.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-ink-500">
          Specifications conform to the current pharmacopoeial monograph (BP / USP / IP as
          applicable). Batch-specific values are stated on the Certificate of Analysis.
        </p>
      </div>
    </div>
  )
}
