import {
  ArrowRight,
  Building2,
  Check,
  Factory,
  FlaskConical,
  Microscope,
  TestTubes,
  Warehouse,
  type LucideIcon,
} from 'lucide-react'

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

/** Manufacturing split section: CMS copy + bullets on the left, photograph and facility counts on the right. */
export function ManufacturingTeaser({
  section,
  facilities,
}: {
  section?: Homepage['manufacturingSection']
  facilities: Facility[]
}) {
  if (!section?.heading && !section?.body) return null
  const counts = new Map<Facility['type'], number>()
  facilities.forEach((f) => counts.set(f.type, (counts.get(f.type) ?? 0) + 1))
  const typeCounts = (Object.keys(FACILITY_TYPE) as Facility['type'][])
    .filter((t) => counts.has(t))
    .map((t) => ({ type: t, count: counts.get(t)!, ...FACILITY_TYPE[t] }))
  const counters = [
    {
      type: 'total',
      icon: Building2,
      count: facilities.length,
      label: ['Facility', 'Facilities'] as [string, string],
    },
    ...typeCounts,
  ]
  const bullets = section?.bullets || []

  return (
    <Section aria-label="Manufacturing">
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
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
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

          <Reveal delay={120}>
            <div className="relative aspect-[4/3] overflow-hidden border border-ink-200 bg-white">
              <Media
                media={section?.image}
                size="large"
                fill
                sizes="(max-width: 1024px) 92vw, 44vw"
                className="h-full w-full"
                imgClassName="object-cover"
              />
            </div>
            {facilities.length > 0 && (
              <dl className="mt-4 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:grid-cols-3">
                {counters.map((t) => (
                  <div
                    key={t.type}
                    className="flex items-center gap-3 border border-ink-200 bg-white px-3.5 py-3"
                  >
                    <t.icon className="h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />
                    <div className="flex flex-col">
                      <dt className="order-2 mt-1 text-xs text-ink-500">
                        {t.count === 1 ? t.label[0] : t.label[1]}
                      </dt>
                      <dd className="order-1 text-lg font-semibold leading-none text-ink-950">
                        {t.count}
                      </dd>
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
