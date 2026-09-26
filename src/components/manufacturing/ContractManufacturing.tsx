import { ArrowRight, Check } from 'lucide-react'

import { Button, Container, Eyebrow, Section } from '@/components/ui'
import { Reveal } from '@/components/ui/Reveal'
import { MoleculeField } from '@/components/visuals/MoleculeField'
import type { ManufacturingPage } from '@/payload-types'

const HOW = [
  { title: 'Share your brief', text: 'Product profile, target markets and volumes.' },
  { title: 'Feasibility in a week', text: 'Formulation, regulatory route and indicative costing.' },
  { title: 'Develop & register', text: 'Artwork, stability, dossier and pilot batches.' },
  { title: 'Scale production', text: 'Commercial batches released under our quality system.' },
]

/** Contract / third-party manufacturing offer in a red-tinted glass panel with bullets and CTA. */
export function ContractManufacturing({ data }: { data?: ManufacturingPage['contractManufacturing'] }) {
  if (!data?.heading && !data?.body) return null
  const bullets = data?.bullets || []
  return (
    <Section id="contract-manufacturing" aria-labelledby="manufacturing-contract-title" className="pt-0">
      <Container>
        <Reveal>
          <div className="glass-red glass-edge relative overflow-hidden rounded-[2rem] p-6 sm:p-10 lg:p-14">
            <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,rgb(255_102_117_/_0.35),transparent)]" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-10 -right-6 hidden w-[24rem] opacity-40 lg:block" aria-hidden="true">
              <MoleculeField animated={false} />
            </div>
            <div className="relative grid gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-6">
                <Eyebrow className="mb-4">Contract manufacturing</Eyebrow>
                <h2 id="manufacturing-contract-title" className="heading-2">
                  {data?.heading || 'Contract & third-party manufacturing'}
                </h2>
                {data?.body && <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-700 sm:text-lg">{data.body}</p>}
                {bullets.length > 0 && (
                  <ul className="mt-7 grid gap-3 sm:grid-cols-2" role="list">
                    {bullets.map((b, i) => (
                      <li key={b.id || i} className="flex items-start gap-3 text-[15px] text-ink-800">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white shadow-[0_6px_14px_-6px_rgb(225_29_46_/_0.7)]">
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                        <span>{b.text}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button href="/contact">
                    Start a contract manufacturing project <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button href="#facilities" variant="secondary">
                    See our facilities
                  </Button>
                </div>
              </div>
              <div className="lg:col-span-6">
                <div className="glass-strong glass-edge rounded-[1.6rem] p-5 sm:p-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">How a project runs</p>
                  <ol className="mt-4 space-y-4" aria-label="Contract manufacturing steps">
                    {HOW.map((h, i) => (
                      <li key={h.title} className="flex gap-4">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand-200 bg-white font-mono text-xs font-semibold text-brand-700">{i + 1}</span>
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
