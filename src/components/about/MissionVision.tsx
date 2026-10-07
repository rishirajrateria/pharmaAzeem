import { Eye, Target } from 'lucide-react'

import { Container, Section, SectionHeading } from '@/components/ui'
import { Reveal } from '@/components/ui/Reveal'
import type { AboutPage } from '@/payload-types'

type Props = { mission: AboutPage['mission'] }

/** Mission and vision side by side: a light glass card and a dark mesh card for rhythm. */
export function MissionVision({ mission }: Props) {
  if (!mission?.mission && !mission?.vision) return null
  return (
    <Section aria-labelledby="about-purpose">
      <Container>
        <SectionHeading
          eyebrow="Purpose"
          title={<span id="about-purpose">Mission &amp; vision</span>}
          description="Why we exist and where we are headed – the commitments that guide every decision, from sourcing an API to shipping a container."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {mission.mission && (
            <Reveal
              as="article"
              className="glass-card glass-edge relative overflow-hidden p-8 sm:p-10"
            >
              <span
                className="pointer-events-none absolute -right-2 -top-4 select-none text-8xl font-semibold text-brand-100/80"
                aria-hidden="true"
              >
                01
              </span>
              <span className="relative flex h-14 w-14 items-center justify-center bg-brand-gradient text-white shadow-[0_12px_28px_-10px_rgb(225_29_46_/_0.8)]">
                <Target className="h-6 w-6" aria-hidden="true" />
              </span>
              <p className="eyebrow mt-8">Our mission</p>
              <h3 className="heading-3 mt-2">What we work for every day</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-600 sm:text-base">
                {mission.mission}
              </p>
            </Reveal>
          )}
          {mission.vision && (
            <Reveal
              as="article"
              delay={90}
              className="mesh-bg-dark relative overflow-hidden p-8 text-white sm:p-10"
            >
              <div
                className="pointer-events-none absolute inset-0 dots-pattern opacity-30"
                aria-hidden="true"
              />
              <span
                className="pointer-events-none absolute -right-2 -top-4 select-none text-8xl font-semibold text-white/10"
                aria-hidden="true"
              >
                02
              </span>
              <span className="glass-dark relative flex h-14 w-14 items-center justify-center text-brand-300">
                <Eye className="h-6 w-6" aria-hidden="true" />
              </span>
              <p className="relative mt-8 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-brand-300">
                <span
                  className="inline-block h-1.5 w-1.5 bg-brand-400"
                  aria-hidden="true"
                />
                Our vision
              </p>
              <h3 className="heading-3 relative mt-2 text-white">Where we are headed</h3>
              <p className="relative mt-4 text-[15px] leading-relaxed text-white/75 sm:text-base">
                {mission.vision}
              </p>
            </Reveal>
          )}
        </div>
      </Container>
    </Section>
  )
}
