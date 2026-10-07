import { Container, Section, SectionHeading } from '@/components/ui'
import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import type { ManufacturingPage } from '@/payload-types'

import { pad2 } from './facilities'

type Capability = NonNullable<ManufacturingPage['capabilities']>[number]

/** "What we can make" – icon cards in a 2/3 column glass grid with a numbered mono index. */
export function CapabilitiesGrid({ capabilities }: { capabilities?: Capability[] | null }) {
  if (!capabilities?.length) return null
  return (
    <Section aria-labelledby="manufacturing-capabilities-title" className="overflow-hidden pt-0">
      <Container>
        <SectionHeading
          eyebrow="Capabilities"
          title={
            <span id="manufacturing-capabilities-title">
              Dosage forms and technologies we manufacture
            </span>
          }
          description="Purpose-built blocks for each dosage form, segregated where regulation demands it, and packaging lines that adapt to every market presentation."
        />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {capabilities.map((c, i) => (
            <Reveal
              as="li"
              key={c.id || i}
              delay={i * 60}
              className="group glass-card glass-edge relative flex h-full flex-col overflow-hidden p-6 sm:p-7"
            >
              <div className="relative flex items-start justify-between gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-brand-50 text-brand-700">
                  <Icon name={c.icon} className="h-5 w-5" />
                </span>
                <span className="text-[11px] uppercase tracking-[0.2em] text-ink-400">
                  {pad2(i + 1)}
                </span>
              </div>
              <h3 className="relative mt-5 text-lg font-semibold leading-snug text-ink-950">
                {c.title}
              </h3>
              {c.description && (
                <p className="relative mt-2 text-sm leading-relaxed text-ink-600">
                  {c.description}
                </p>
              )}
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
