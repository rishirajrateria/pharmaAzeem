import { BadgeCheck } from 'lucide-react'
import Link from 'next/link'

import { Container, Section, SectionHeading } from '@/components/ui'
import { Reveal } from '@/components/ui/Reveal'
import type { Certification, Facility } from '@/payload-types'

import { FacilityCard } from './FacilityCard'
import { FacilityNav, type FacilityNavItem } from './FacilityNav'
import { certificateHref, facilityAnchor, splitFacilityName } from './facilities'

/**
 * "Our facilities": section intro, a trust strip of featured certifications (links to /licenses),
 * the sticky facility sub-nav and one large alternating card per facility.
 */
export function FacilitiesSection({
  facilities,
  certifications,
}: {
  facilities: Facility[]
  certifications: Certification[]
}) {
  if (!facilities.length) return null
  const navItems: FacilityNavItem[] = facilities.map((f) => {
    const { code, rest } = splitFacilityName(f.name)
    return { anchor: facilityAnchor(f), code, label: rest, type: f.type }
  })
  const certs = certifications.slice(0, 6)

  return (
    <Section
      id="facilities"
      aria-labelledby="manufacturing-facilities-title"
      className="scroll-mt-24"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[60%] grid-pattern fade-mask-y opacity-50"
        aria-hidden="true"
      />
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Our facilities"
            title={
              <span id="manufacturing-facilities-title">Inside our manufacturing facilities</span>
            }
            description={`${facilities.length === 1 ? 'Our facility' : `Our ${facilities.length} facilities`} at a glance: capabilities, capacity, dosage forms and certifications for each site. Jump to a facility below or scroll through the full tour.`}
          />
          {certs.length > 0 && (
            <div className="lg:max-w-sm lg:shrink-0">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                Featured certifications
              </p>
              <ul
                className="flex flex-wrap gap-1.5"
                aria-label="Featured certifications"
                role="list"
              >
                {certs.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={certificateHref(c)}
                      className="chip !py-1 transition hover:border-brand-400 hover:bg-white hover:text-brand-800"
                      title={`${c.title} – ${c.issuer}`}
                    >
                      <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                      {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <FacilityNav items={navItems} className="mt-10" />

        <div className="mt-10 space-y-8 lg:space-y-12">
          {facilities.map((f, i) => (
            <Reveal key={f.id} delay={40}>
              <FacilityCard facility={f} index={i} flip={i % 2 === 1} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}
