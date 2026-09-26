import { ArrowRight, Check, Factory, FlaskConical, Microscope, TestTubes, Warehouse, type LucideIcon } from 'lucide-react'

import type { Facility, Homepage } from '@/payload-types'

import { Media } from '../Media'
import { Button, Container, Eyebrow, Section } from '../ui'
import { Reveal } from '../ui/Reveal'

const FACILITY_TYPE: Record<Facility['type'], { label: [string, string]; icon: LucideIcon }> = {
  formulation: { label: ['Formulation plant', 'Formulation plants'], icon: Factory },
  api: { label: ['API unit', 'API units'], icon: FlaskConical },
  rnd: { label: ['R&D centre', 'R&D centres'], icon: Microscope },
  'qc-lab': { label: ['QC laboratory', 'QC laboratories'], icon: TestTubes },
  warehouse: { label: ['Warehouse', 'Warehouses'], icon: Warehouse },
}

/** Manufacturing split section: CMS copy + bullets on the left, image and facility counters on the right. */
export function ManufacturingTeaser({ section, facilities }: { section?: Homepage['manufacturingSection']; facilities: Facility[] }) {
  if (!section?.heading && !section?.body) return null
  const counts = new Map<Facility['type'], number>()
  facilities.forEach((f) => counts.set(f.type, (counts.get(f.type) ?? 0) + 1))
  const typeCounts = (Object.keys(FACILITY_TYPE) as Facility['type'][]).filter((t) => counts.has(t)).map((t) => ({ type: t, count: counts.get(t)!, ...FACILITY_TYPE[t] }))
  const bullets = section?.bullets || []

  return (
    <Section aria-label="Manufacturing" className="overflow-hidden">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            {section?.eyebrow && <Eyebrow className="mb-4">{section.eyebrow}</Eyebrow>}
            {section?.heading && <h2 className="heading-2">{section.heading}</h2>}
            {section?.body && <p className="lead mt-5">{section.body}</p>}
            {bullets.length > 0 && (
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {bullets.map((b, i) => (
                  <li key={b.id || i} className="flex items-start gap-3 text-sm text-ink-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white">
                      <Check className="h-3 w-3" aria-hidden="true" />
                    </span>
                    {b.text}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="/manufacturing">
                Tour our facilities <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button href="/quality" variant="ghost">
                Quality &amp; compliance
              </Button>
            </div>
          </Reveal>

          <Reveal delay={120} className="relative">
            <div className="grid-pattern fade-mask-y absolute -inset-6 -z-10 opacity-60" aria-hidden="true" />
            <div className="glass relative rounded-[2rem] p-3 shadow-glass-lg rotate-[-2deg] transition-transform duration-700 hover:rotate-0">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-white">
                <Media media={section?.image} size="large" fill sizes="(max-width: 1024px) 92vw, 44vw" className="h-full w-full" imgClassName="object-cover" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent" aria-hidden="true" />
              </div>
              {facilities.length > 0 && (
                <div className="absolute -left-3 -top-4 glass-strong glass-edge rounded-2xl px-4 py-3 shadow-glass-lg sm:-left-6">
                  <p className="text-gradient text-2xl font-semibold leading-none tracking-tight">{facilities.length}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">{facilities.length === 1 ? 'Facility' : 'Facilities'}</p>
                </div>
              )}
            </div>
            {typeCounts.length > 0 && (
              <dl className="relative z-10 -mt-6 mx-2 grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2 sm:mx-4 sm:grid-cols-3">
                {typeCounts.map((t) => (
                  <div key={t.type} className="glass-strong glass-edge flex items-center gap-3 rounded-2xl px-3.5 py-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <t.icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="flex flex-col">
                      <dt className="order-2 mt-1 text-[11px] font-medium text-ink-500">{t.count === 1 ? t.label[0] : t.label[1]}</dt>
                      <dd className="order-1 text-lg font-semibold leading-none text-ink-950">{t.count}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            )}
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
