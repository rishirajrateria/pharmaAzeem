import { ArrowRight, Check } from 'lucide-react'

import { Button, Container, Eyebrow, Section } from '@/components/ui'
import { Reveal } from '@/components/ui/Reveal'
import type { ManufacturingPage } from '@/payload-types'

const HOW = [
  { title: 'Share your brief', text: 'Product profile, target markets and volumes.' },
  { title: 'Feasibility review', text: 'Formulation, regulatory route and indicative costing.' },
  { title: 'Develop & register', text: 'Artwork, stability, dossier and pilot batches.' },
  { title: 'Scale production', text: 'Commercial batches released under our quality system.' },
]

/** Contract / third-party manufacturing offer: copy, bullets and CTAs beside a numbered "how it works" list. */
export function ContractManufacturing({
  data,
}: {
  data?: ManufacturingPage['contractManufacturing']
}) {
  if (!data?.heading && !data?.body) return null
  const bullets = data?.bullets || []
  return (
    <Section
      id="contract-manufacturing"
      aria-labelledby="manufacturing-contract-title"
      className="pt-0"
    >
      <Container>
        <Reveal>
          <div className="border border-ink-200 bg-surface-2 p-6 sm:p-10 lg:p-14">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-6">
                <Eyebrow className="mb-4">Contract manufacturing</Eyebrow>
                <h2 id="manufacturing-contract-title" className="heading-2">
                  {data?.heading || 'Contract & third-party manufacturing'}
                </h2>
                {data?.body && (
                  <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-700 sm:text-lg">
                    {data.body}
                  </p>
                )}
                {bullets.length > 0 && (
                  <ul className="mt-7 grid gap-3 sm:grid-cols-2" role="list">
                    {bullets.map((b, i) => (
                      <li
                        key={b.id || i}
                        className="flex items-start gap-3 text-[15px] text-ink-800"
                      >
                        <span className="mt-0.5 shrink-0 text-brand-700">
                          <Check className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span>{b.text}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button href="/contact">
                    Start a contract manufacturing project{' '}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button href="#facilities" variant="secondary">
                    See our facilities
                  </Button>
                </div>
              </div>
              <div className="lg:col-span-6">
                <div className="glass p-5 sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                    How a project runs
                  </p>
                  <ol className="mt-4 space-y-4" aria-label="Contract manufacturing steps">
                    {HOW.map((h, i) => (
                      <li key={h.title} className="flex gap-4">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-brand-700 text-xs font-semibold text-white">
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-ink-950">{h.title}</p>
                          <p className="mt-0.5 text-sm text-ink-600">{h.text}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
