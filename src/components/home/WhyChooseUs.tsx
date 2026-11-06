import type { Homepage } from '@/payload-types'

import { Container, Section, SectionHeading } from '../ui'
import { Icon } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'

/** Reasons to work with us – a grid of icon cards. */
export function WhyChooseUs({ cards }: { cards?: Homepage['whyUs'] }) {
  if (!cards?.length) return null
  return (
    <Section aria-label="Why choose us">
      <Container>
        <SectionHeading
          eyebrow="Why choose us"
          title="Built to be your most dependable supplier"
          description="Quality systems, regulatory depth and logistics designed around the needs of importers, distributors, hospitals and tender boards."
          align="center"
        />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal as="li" key={c.id || i} delay={(i % 3) * 70} className="flex">
              <div className="glass-card lift group relative flex w-full flex-col p-7">
                <span className="absolute right-6 top-5 text-4xl font-semibold text-brand-700/10 transition-colors duration-300 group-hover:text-brand-700/20">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-[0_10px_20px_-10px_rgb(175_2_1_/_0.7)]">
                  <Icon name={c.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-ink-950">{c.title}</h3>
                {c.description && (
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{c.description}</p>
                )}
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
