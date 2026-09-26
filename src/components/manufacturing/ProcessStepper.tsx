import { Container, Section, SectionHeading } from '@/components/ui'
import { Reveal } from '@/components/ui/Reveal'
import type { ManufacturingPage } from '@/payload-types'

import { pad2 } from './facilities'

type Step = NonNullable<ManufacturingPage['process']>[number]

/**
 * "Production line" stepper: a glass track with numbered stage nodes. Vertical timeline on
 * small screens, three-column flow on large screens with gradient connectors. Rendered as an
 * ordered list so the sequence survives in plain HTML for crawlers.
 */
export function ProcessStepper({ steps }: { steps?: Step[] | null }) {
  if (!steps?.length) return null
  const total = steps.length
  return (
    <Section id="process" aria-labelledby="manufacturing-process-title" className="overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full dots-pattern fade-mask-y opacity-50" aria-hidden="true" />
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Manufacturing process"
            title={<span id="manufacturing-process-title">From dispensed material to released batch</span>}
            description="Every product follows the same validated sequence. Each stage has defined in-process controls and nothing moves forward until Quality Assurance signs off the previous one."
          />
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-500 lg:shrink-0 lg:pb-1">
            {pad2(total)} stages · one quality system
          </p>
        </div>

        <ol
          className="relative mt-12 grid gap-6 before:absolute before:bottom-10 before:left-6 before:top-10 before:w-px before:bg-gradient-to-b before:from-brand-300 before:via-brand-200 before:to-transparent md:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12 lg:before:hidden"
          aria-label="Manufacturing stages"
        >
          {steps.map((s, i) => {
            const n = i + 1
            return (
              <Reveal key={s.id || i} as="li" delay={i * 70} className="group relative pl-16 md:pl-0">
                <span className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full bg-brand-gradient font-mono text-sm font-semibold text-white shadow-glow ring-4 ring-white md:relative md:mb-5">
                  {pad2(n)}
                </span>
                <span
                  className="pointer-events-none absolute left-14 top-6 hidden h-px w-[calc(100%-1.5rem)] bg-gradient-to-r from-brand-300 via-brand-200 to-transparent group-last:hidden group-[:nth-child(3n)]:hidden lg:block"
                  aria-hidden="true"
                />
                <div className="glass-card glass-edge relative h-full overflow-hidden p-6">
                  <span className="pointer-events-none absolute -right-3 -top-4 select-none font-mono text-7xl font-semibold leading-none tracking-tighter text-brand-100/80" aria-hidden="true">
                    {pad2(n)}
                  </span>
                  <p className="relative font-mono text-[10px] uppercase tracking-[0.2em] text-brand-600">
                    Stage {n} of {total}
                  </p>
                  <h3 className="relative mt-2 text-lg font-semibold leading-snug text-ink-950">{s.title}</h3>
                  {s.description && <p className="relative mt-2 text-sm leading-relaxed text-ink-600">{s.description}</p>}
                  <span className="relative mt-5 block h-1 w-full overflow-hidden rounded-full bg-brand-100/70" aria-hidden="true">
                    <span className="block h-full rounded-full bg-brand-gradient" style={{ width: `${Math.round((n / total) * 100)}%` }} />
                  </span>
                </div>
              </Reveal>
            )
          })}
        </ol>
      </Container>
    </Section>
  )
}
