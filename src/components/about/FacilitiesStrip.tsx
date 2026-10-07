import {
  ArrowRight,
  Factory,
  FlaskConical,
  MapPin,
  Microscope,
  TestTubes,
  Warehouse,
  type LucideIcon,
} from 'lucide-react'
import Link from 'next/link'

import { Container, Section, SectionHeading } from '@/components/ui'
import { Reveal } from '@/components/ui/Reveal'
import type { Facility } from '@/payload-types'

const TYPE: Record<Facility['type'], { label: string; icon: LucideIcon }> = {
  formulation: { label: 'Formulation plant', icon: Factory },
  api: { label: 'API plant', icon: FlaskConical },
  rnd: { label: 'R&D centre', icon: Microscope },
  'qc-lab': { label: 'QC laboratory', icon: TestTubes },
  warehouse: { label: 'Warehouse & logistics', icon: Warehouse },
}

/** Compact overview of the company's facilities, linking to the manufacturing page. */
export function FacilitiesStrip({ facilities }: { facilities: Facility[] }) {
  if (!facilities.length) return null
  const cities = [...new Set(facilities.map((f) => f.city).filter(Boolean))].join(', ')
  const noun = facilities.length === 1 ? 'facility' : 'facilities'
  return (
    <Section className="!pt-0" aria-labelledby="about-facilities">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Infrastructure"
            title={<span id="about-facilities">Where our medicines are made</span>}
            description={`Our ${facilities.length} ${noun}${cities ? ` in ${cities}` : ''} at a glance – capabilities, capacities and certifications are detailed on the manufacturing page.`}
          />
          <Link href="/manufacturing" className="btn-secondary shrink-0">
            Explore manufacturing <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3" role="list">
          {facilities.map((f, i) => {
            const t = TYPE[f.type] || TYPE.formulation
            const TypeIcon = t.icon
            const place = [f.city, f.country].filter(Boolean).join(', ')
            const forms = (f.dosageForms || []).slice(0, 3)
            return (
              <Reveal
                as="li"
                key={f.id}
                delay={i * 60}
                className="glass-card glass-edge flex flex-col p-5 sm:p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-brand-50 text-brand-600 ring-1 ring-brand-100 rounded-lg">
                    <TypeIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-brand-600">
                    {t.label}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-ink-950">
                  <Link href="/manufacturing" className="hover:text-brand-700">
                    {f.name}
                  </Link>
                </h3>
                {place && (
                  <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-ink-500">
                    <MapPin className="h-3.5 w-3.5 text-brand-500" aria-hidden="true" />
                    {place}
                  </p>
                )}
                {f.summary && (
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-600">
                    {f.summary}
                  </p>
                )}
                {forms.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Dosage forms">
                    {forms.map((d) => (
                      <li key={d} className="chip !py-0.5">
                        {d}
                      </li>
                    ))}
                    {(f.dosageForms?.length || 0) > 3 && (
                      <li className="chip !py-0.5 text-ink-500">
                        +{(f.dosageForms?.length || 0) - 3} more
                      </li>
                    )}
                  </ul>
                )}
                {(f.establishedYear || f.areaSqm) && (
                  <dl className="mt-auto flex gap-6 border-t border-ink-100 pt-4 text-xs text-ink-500">
                    {f.establishedYear && (
                      <div>
                        <dt className="sr-only">Established</dt>
                        <dd>Est. {f.establishedYear}</dd>
                      </div>
                    )}
                    {f.areaSqm && (
                      <div>
                        <dt className="sr-only">Built-up area</dt>
                        <dd>{f.areaSqm.toLocaleString('en')} m²</dd>
                      </div>
                    )}
                  </dl>
                )}
              </Reveal>
            )
          })}
        </ul>
      </Container>
    </Section>
  )
}
