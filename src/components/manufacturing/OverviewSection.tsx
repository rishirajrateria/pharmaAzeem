import { RichText } from '@/components/RichText'
import { Stats } from '@/components/Stats'
import { Container, Eyebrow, Section } from '@/components/ui'
import type { Facility, ManufacturingPage } from '@/payload-types'

import { countByType } from './facilities'

/**
 * Intro rich text (left: eyebrow + h2, right: prose) followed by the count-up <Stats> band
 * and a compact "facility mix" strip derived from the facilities collection.
 */
export function OverviewSection({ intro, stats, facilities }: { intro?: ManufacturingPage['intro']; stats?: ManufacturingPage['stats']; facilities: Facility[] }) {
  if (!intro && !stats?.length) return null
  const mix = countByType(facilities)
  return (
    <Section className="pt-0" aria-labelledby="manufacturing-overview-title">
      <Container>
        {intro ? (
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <Eyebrow className="mb-4">Overview</Eyebrow>
              <h2 id="manufacturing-overview-title" className="heading-2">
                Every dosage form, one quality system
              </h2>
              {mix.length > 0 && (
                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Facility mix">
                  {mix.map((m) => (
                    <li key={m.type} className="chip !py-1">
                      <m.icon className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="font-mono">{m.count}</span> {m.count === 1 ? m.label : m.plural}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="lg:col-span-8">
              <RichText data={intro} className="[&_p]:text-base [&_p]:leading-relaxed sm:[&_p]:text-lg" />
            </div>
          </div>
        ) : (
          <h2 id="manufacturing-overview-title" className="sr-only">
            Manufacturing at a glance
          </h2>
        )}
        <Stats stats={stats} className={intro ? 'mt-12' : undefined} />
      </Container>
    </Section>
  )
}
