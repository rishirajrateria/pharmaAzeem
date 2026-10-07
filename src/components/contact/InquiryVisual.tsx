import { FileCheck, Globe, ShieldCheck } from 'lucide-react'

import { HudRings } from '@/components/visuals/MoleculeField'

/**
 * Decorative "quotation preview" mock for the inquiry hero (no CMS image needed).
 * Pure HTML/CSS – aria-hidden because it carries no information the copy lacks.
 */
export function InquiryVisual({ listName }: { listName: string }) {
  const rows = [
    { w: 'w-28', qty: '× 5,000' },
    { w: 'w-20', qty: '× 2,400' },
    { w: 'w-32', qty: '× 12,000' },
  ]
  return (
    <div className="relative mx-auto max-w-md py-8 lg:max-w-none" aria-hidden="true">
      <HudRings className="hidden opacity-70 sm:flex" />
      <div className="relative">
        <div className="gradient-border glass-strong -rotate-2 p-5 shadow-glass-lg animate-float-slow sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="eyebrow">{listName}</p>
            <span className="chip !py-0.5 text-[10px]">3 products</span>
          </div>
          <ul className="mt-5 space-y-2.5">
            {rows.map((r, i) => (
              <li
                key={i}
                className="flex items-center gap-3 border border-white/80 bg-white/70 px-3 py-2.5"
              >
                <span className="h-9 w-9 shrink-0 bg-gradient-to-br from-brand-100 to-brand-50" />
                <span className="flex-1 space-y-1.5">
                  <span className={`block h-2 bg-ink-200 ${r.w}`} />
                  <span className="block h-1.5 w-16 bg-ink-100" />
                </span>
                <span className="text-[10px] text-ink-500">{r.qty}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 bg-brand-gradient p-4 text-white shadow-[0_12px_32px_-12px_rgb(225_29_46_/_0.8)]">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/70">
              Quotation
            </p>
            <div className="mt-2 grid grid-cols-3 gap-2 text-center">
              {['Pricing', 'MOQ', 'Lead time'].map((k) => (
                <span
                  key={k}
                  className="bg-white/15 px-2 py-2 text-[11px] font-semibold"
                >
                  {k}
                </span>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-white/80">Prepared for your market</p>
          </div>
        </div>

        <div className="absolute -left-2 -top-3 flex items-center gap-2 glass px-3.5 py-2.5 text-xs font-semibold text-ink-900 shadow-glass animate-float sm:-left-6">
          <ShieldCheck className="h-4 w-4 text-brand-600" /> No payment required
        </div>
        <div className="absolute -bottom-3 -right-2 flex items-center gap-2 glass px-3.5 py-2.5 text-xs font-semibold text-ink-900 shadow-glass animate-float [animation-delay:-3s] sm:-right-6">
          <Globe className="h-4 w-4 text-brand-600" /> Worldwide export
        </div>
        <div className="absolute -right-3 top-1/3 hidden items-center gap-2 glass px-3.5 py-2.5 text-xs font-semibold text-ink-900 shadow-glass animate-float-slow [animation-delay:-6s] lg:flex xl:-right-8">
          <FileCheck className="h-4 w-4 text-brand-600" /> Registration documents
        </div>
      </div>
    </div>
  )
}
