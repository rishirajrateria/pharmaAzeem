import {
  ArrowRight,
  Boxes,
  ClipboardList,
  FileCheck,
  Send,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'

import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/utils'

export type HowItWorksStep = { title: string; description: string; icon: LucideIcon }

/** The three-step inquiry flow. Also feeds the HowTo JSON-LD on /inquiry. */
export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    title: 'Add products',
    description:
      'Browse the catalogue and add every product you need to your inquiry list – any dosage form, any quantity. Nothing is purchased on this website.',
    icon: ClipboardList,
  },
  {
    title: 'Send inquiry',
    description:
      'Enter your contact details, target market and any packaging, private-label or registration requirements, then submit the list in one go.',
    icon: Send,
  },
  {
    title: 'Receive your quotation',
    description:
      'Our export team replies with pricing for your market, minimum order quantities, lead times and the documents you need for registration.',
    icon: FileCheck,
  },
]

export function HowItWorks({ className }: { className?: string }) {
  return (
    <ol className={cn('grid gap-4 md:grid-cols-3 md:gap-6', className)}>
      {HOW_IT_WORKS_STEPS.map((step, i) => {
        const Icon = step.icon
        const last = i === HOW_IT_WORKS_STEPS.length - 1
        return (
          <Reveal key={step.title} as="li" delay={i * 90} className="relative">
            <div className="glass-card glass-edge h-full p-6 sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-brand-gradient text-white rounded-lg">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink-400">
                  Step 0{i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-ink-950">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{step.description}</p>
            </div>
            {!last && (
              <span
                className="absolute -right-3 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center glass-strong text-brand-600 shadow-glass md:flex lg:-right-4 rounded-lg"
                aria-hidden="true"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            )}
          </Reveal>
        )
      })}
    </ol>
  )
}

const REASSURANCE: { icon: LucideIcon; label: string }[] = [
  { icon: ShieldCheck, label: 'No payment required' },
  { icon: Boxes, label: 'MOQ & lead times included' },
  { icon: FileCheck, label: 'Registration support' },
]

/** Trust chips shown near the inquiry form. */
export function ReassuranceChips({ className }: { className?: string }) {
  return (
    <ul className={cn('flex flex-wrap gap-2', className)} aria-label="What to expect">
      {REASSURANCE.map((r) => {
        const Icon = r.icon
        return (
          <li key={r.label} className="chip !px-3.5 !py-1.5 shadow-soft">
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {r.label}
          </li>
        )
      })}
    </ul>
  )
}
