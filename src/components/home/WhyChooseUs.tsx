import type { Homepage } from '@/payload-types'

import { Container, GlassCard, Section, SectionHeading } from '../ui'
import { Icon } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'

/** 3 × 2 grid of glass feature cards driven by the CMS "Why choose us" array. */
export function WhyChooseUs({ cards }: { cards?: Homepage['whyUs'] }) {
  if (!cards?.length) return null
  return (
    <Section aria-label="Why choose us">
      <div className="absolute inset-x-0 top-0 hairline" aria-hidden="true" />
      <Container>
        <SectionHeading
          eyebrow="Why choose us"
          title="Built to be your most dependable supplier"
          description="Quality systems, regulatory depth and logistics designed around the needs of importers, distributors, hospitals and tender boards."
          align="center"
        />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal as="li" key={c.id || i} delay={i * 60} className="flex">
              <GlassCard className="glass-edge group relative w-full overflow-hidden">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-gradient opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-20" aria-hidden="true" />
                <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-[0_12px_28px_-10px_rgb(225_29_46_/_0.8)]">
                  <Icon name={c.icon} className="h-5.5 w-5.5" />
                </span>
                <h3 className="relative mt-6 text-lg font-semibold text-ink-950">{c.title}</h3>
                {c.description && <p className="relative mt-2 text-sm leading-relaxed text-ink-600">{c.description}</p>}
                <span className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-brand-400/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />
              </GlassCard>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
