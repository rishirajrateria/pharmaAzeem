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

/** Numbered steps – stacked on mobile, four columns from lg up. */
export function OnboardingSteps({ steps }: { steps?: Step[] | null }) {
  const list = steps?.length ? steps : DEFAULT_STEPS
  return (
    <ol className="grid gap-4 lg:grid-cols-4 lg:gap-6" role="list">
      {list.map((s, i) => (
        <Reveal as="li" key={s.id || s.title} delay={i * 90}>
          <article className="h-full glass p-6">
            <span className="flex h-10 w-10 items-center justify-center bg-brand-700 text-sm font-semibold text-white rounded-lg">
              {String(i + 1).padStart(2, '0')}
            </span>
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
