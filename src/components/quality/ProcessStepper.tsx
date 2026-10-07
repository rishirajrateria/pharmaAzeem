import { Container, Section, SectionHeading } from '@/components/ui'
import { Reveal } from '@/components/ui/Reveal'
import type { QualityPage } from '@/payload-types'

import { pad2 } from './certifications'

type Step = NonNullable<QualityPage['process']>[number]

/**
 * Numbered quality-control stepper. Vertical timeline on small screens (hairline down
 * the left), three-column horizontal flow on large screens with connectors between steps.
 */
export function ProcessStepper({
  steps,
  eyebrow = 'Quality control process',
  title,
  description,
}: {
  steps?: Step[] | null
  eyebrow?: string
  title?: string
  description?: string
}) {
  if (!steps?.length) return null
  return (
    <Section aria-labelledby="process-title" className="isolate overflow-hidden">
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={<span id="process-title">{title || 'From raw material to released batch'}</span>}
          description={
            description ||
            'The controlled sequence each batch follows, from incoming materials to released product.'
          }
        />
        <ol
          className="relative mt-12 grid gap-8 before:absolute before:bottom-8 before:left-6 before:top-8 before:w-px before:bg-ink-200 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14 lg:before:hidden"
          aria-label="Quality control steps"
        >
          {steps.map((s, i) => (
            <Reveal
              key={s.id || i}
              as="li"
              delay={i * 70}
              className="group relative pl-16 lg:flex lg:flex-col lg:pl-0"
            >
              <span className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center bg-brand-gradient text-sm font-semibold text-white shadow-glow ring-4 ring-white lg:relative lg:mb-5 rounded-lg">
                {pad2(i + 1)}
              </span>
              <span
                className="pointer-events-none absolute left-14 top-6 hidden h-px w-[calc(100%-1.5rem)] bg-ink-200 group-last:hidden group-[:nth-child(3n)]:hidden lg:block"
                aria-hidden="true"
              />
              <div className="glass-card p-6 lg:flex-1">
                <h3 className="text-lg font-semibold leading-snug text-ink-950">{s.title}</h3>
                {s.description && (
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{s.description}</p>
                )}
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  )
}
