import { Check } from 'lucide-react'

import { Container, Section, SectionHeading } from '@/components/ui'
import { Reveal } from '@/components/ui/Reveal'
import type { QualityPage } from '@/payload-types'

type Standard = NonNullable<QualityPage['standards']>[number]

/** "Standards & guidelines" – heading on the left, a two-column definition list in a bordered panel on the right. */
export function StandardsList({ standards }: { standards?: Standard[] | null }) {
  if (!standards?.length) return null
  return (
    <Section aria-labelledby="standards-title">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <SectionHeading
              eyebrow="Standards & guidelines"
              title={
                <span id="standards-title">The frameworks we manufacture and test against</span>
              }
              description="Our procedures, specifications and validation protocols are written to these international and national standards, so regulators and partners in any market can audit against a familiar reference."
            />
          </div>
          <Reveal className="lg:col-span-8">
            <div className="border border-ink-200 bg-white p-6 sm:p-10">
              <dl className="grid gap-x-10 sm:grid-cols-2">
                {standards.map((s, i) => (
                  <div
                    key={s.id || i}
                    className="flex gap-4 border-b border-ink-200 py-5 first:pt-0 last:border-b-0 sm:nth-2:pt-0 sm:nth-last-2:border-b-0"
                  >
                    <Check className="mt-1 h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
                    <div>
                      <dt className="font-semibold text-ink-950">{s.name}</dt>
                      {s.description && (
                        <dd className="mt-1 text-sm leading-relaxed text-ink-600">
                          {s.description}
                        </dd>
                      )}
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
