import type { Homepage } from '@/payload-types'

import { Container } from '../ui'
import { Icon } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'

/** Reasons to work with us – frosted glass cards inside a large glass panel. */
export function WhyChooseUs({ cards }: { cards?: Homepage['whyUs'] }) {
  if (!cards?.length) return null
  return (
    <section aria-label="Why choose us" className="py-14 sm:py-20">
      <Container>
        <div className="glass-subtle relative isolate overflow-hidden !rounded-[2.5rem] px-6 py-14 sm:px-10 lg:px-14 lg:py-20">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <span className="blob -right-20 -top-20 h-80 w-80 bg-brand-700/10" />
            <span
              className="blob -bottom-24 -left-16 h-96 w-96 bg-slate-400/20"
              style={{ animationDelay: '-8s' }}
            />
          </div>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
              Why choose us
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl lg:text-5xl">
              Built to be your most dependable supplier
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-600 sm:text-lg">
              Quality systems, regulatory depth and logistics designed around the needs of
              importers, distributors, hospitals and tender boards.
            </p>
          </div>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((c, i) => (
              <Reveal as="li" key={c.id || i} delay={(i % 3) * 70} className="flex">
                <div className="glass-card lift group relative flex w-full flex-col p-7">
                  <span className="absolute right-6 top-5 text-5xl font-semibold text-ink-900/[0.06] transition-colors duration-300 group-hover:text-brand-700/15">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-700 text-white shadow-[0_10px_24px_-12px_rgb(175_2_1_/_0.6)]">
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
        </div>
      </Container>
    </section>
  )
}
