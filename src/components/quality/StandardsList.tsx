import { Check } from 'lucide-react'

import { Container, Section, SectionHeading } from '@/components/ui'
import { Reveal } from '@/components/ui/Reveal'
import { MoleculeField } from '@/components/visuals/MoleculeField'
import type { QualityPage } from '@/payload-types'

type Standard = NonNullable<QualityPage['standards']>[number]

/** "Standards & guidelines" – two-column definition list inside a glass panel, with a molecule motif beside it. */
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
            <div className="relative isolate mt-10 hidden lg:block">
              <div
                className="absolute inset-0 -z-10 rounded-[2rem] bg-[radial-gradient(closest-side,rgb(255_199_205_/_0.5),transparent)]"
                aria-hidden="true"
              />
              <MoleculeField className="max-w-sm opacity-90" />
            </div>
          </div>
          <Reveal className="lg:col-span-8">
            <div className="relative overflow-hidden rounded-[2rem] glass-strong glass-edge p-6 sm:p-10">
              <div
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgb(255_102_117_/_0.18),transparent)]"
                aria-hidden="true"
              />
              <dl className="relative grid gap-x-10 sm:grid-cols-2">
                {standards.map((s, i) => (
                  <div
                    key={s.id || i}
                    className="flex gap-4 border-b border-ink-100/80 py-5 first:pt-0 last:border-b-0 sm:nth-2:pt-0 sm:nth-last-2:border-b-0"
                  >
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full glass-red text-brand-700">
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
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
