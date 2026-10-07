import type { GlobalPresencePage } from '@/payload-types'

import { Reveal } from '../ui/Reveal'

type Step = NonNullable<GlobalPresencePage['process']>[number]

const DEFAULT_STEPS: Step[] = [
  {
    title: 'Market assessment',
    description:
      'We review your product list against local registration requirements and our existing approvals.',
  },
  {
    title: 'Dossier & samples',
    description:
      'Regulatory affairs prepares dossiers, CoPPs and samples for submission by your licence holder.',
  },
  {
    title: 'Registration & artwork',
    description:
      'We respond to regulator queries and finalise market-specific artwork in your language.',
  },
  {
    title: 'First shipment',
    description:
      'Pre-shipment inspection, export documentation and dispatch to your nominated port or airport.',
  },
]

/** Numbered stepper – vertical on mobile, a connected horizontal track from lg up. */
export function OnboardingSteps({ steps }: { steps?: Step[] | null }) {
  const list = steps?.length ? steps : DEFAULT_STEPS
  return (
    <ol className="relative grid gap-4 lg:grid-cols-4 lg:gap-6" role="list">
      <div
        className="pointer-events-none absolute inset-x-12 top-9 hidden h-px bg-gradient-to-r from-transparent via-brand-300 to-transparent lg:block"
        aria-hidden="true"
      />
      {list.map((s, i) => (
        <Reveal as="li" key={s.id || s.title} delay={i * 90} className="relative">
          <article className="glass-card glass-edge relative h-full p-6">
            <div className="flex items-center gap-4">
              <span className="relative flex h-12 w-12 shrink-0 items-center justify-center bg-white text-sm font-semibold text-brand-700 shadow-glass ring-1 ring-brand-200">
                <span
                  className="absolute inset-0 bg-brand-500/20 animate-pulse-ring"
                  style={{ animationDelay: `${i * -0.6}s` }}
                  aria-hidden="true"
                />
                <span className="relative">{String(i + 1).padStart(2, '0')}</span>
              </span>
              <span className="hairline hidden flex-1 lg:block" aria-hidden="true" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-ink-950">{s.title}</h3>
            {s.description && (
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{s.description}</p>
            )}
          </article>
        </Reveal>
      ))}
    </ol>
  )
}
