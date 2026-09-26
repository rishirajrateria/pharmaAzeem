import { Container, Section, SectionHeading } from '@/components/ui'
import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import type { QualityPage } from '@/payload-types'

import { pad2 } from './certifications'

type Pillar = NonNullable<QualityPage['pillars']>[number]

/** "Quality pillars" – grid of glass cards with a gradient icon tile and mono index. */
export function QualityPillars({ pillars }: { pillars?: Pillar[] | null }) {
  if (!pillars?.length) return null
  return (
    <Section aria-labelledby="pillars-title">
      <Container>
        <SectionHeading
          eyebrow="Quality pillars"
          title={<span id="pillars-title">The disciplines behind every compliant batch</span>}
          description="Quality is not a final inspection – it is built into sourcing, manufacturing, testing and data handling. These are the pillars our quality system stands on."
        />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {pillars.map((p, i) => (
            <Reveal key={p.id || i} as="li" delay={i * 60} className="h-full">
              <article className="glass-card relative flex h-full flex-col overflow-hidden p-6 sm:p-7">
                <span
                  className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[radial-gradient(closest-side,rgb(255_199_205_/_0.75),transparent)]"
                  aria-hidden="true"
                />
                <div className="relative flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-[0_10px_24px_-10px_rgb(225_29_46_/_0.8)]">
                    <Icon name={p.icon} className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-xs tracking-[0.2em] text-ink-300">{pad2(i + 1)}</span>
                </div>
                <h3 className="relative mt-6 text-lg font-semibold leading-snug text-ink-950">{p.title}</h3>
                {p.description && <p className="relative mt-2 text-sm leading-relaxed text-ink-600">{p.description}</p>}
              </article>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
