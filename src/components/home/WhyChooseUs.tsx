import type { Homepage } from '@/payload-types'

import { Container, Eyebrow, Section } from '../ui'
import { Icon } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'

/**
 * Reasons to work with us, laid out as a numbered ledger rather than a grid of
 * identical cards — closer to a specification sheet than a SaaS feature grid.
 */
export function WhyChooseUs({ cards }: { cards?: Homepage['whyUs'] }) {
  if (!cards?.length) return null
  return (
    <Section aria-label="Why choose us">
      <div className="absolute inset-x-0 top-0 hairline" aria-hidden="true" />
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Eyebrow>Why choose us</Eyebrow>
            <h2 className="heading-2 mt-4">Built to be your most dependable supplier</h2>
            <p className="mt-4 lead">
              Quality systems, regulatory depth and logistics designed around the needs of
              importers, distributors, hospitals and tender boards.
            </p>
          </div>

          <ol className="lg:col-span-8">
            {cards.map((c, i) => (
              <Reveal as="li" key={c.id || i} delay={i * 50} className="group">
                <div className="flex items-start gap-5 border-t border-ink-100 py-6 first:border-t-0 lg:py-7">
                  <span
                    className="shrink-0 pt-0.5 text-sm font-medium text-ink-300 transition-colors duration-300 group-hover:text-brand-500"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-brand-gradient group-hover:text-white">
                    <Icon name={c.icon} className="h-4.5 w-4.5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-ink-950 sm:text-lg">{c.title}</h3>
                    {c.description && (
                      <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink-600">
                        {c.description}
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  )
}
