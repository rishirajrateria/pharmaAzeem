import { Quote } from 'lucide-react'

import type { Homepage } from '@/payload-types'

import { Container, Section, SectionHeading } from '../ui'
import { Reveal } from '../ui/Reveal'

/** Partner testimonials as glass quote cards. */
export function Testimonials({ testimonials }: { testimonials?: Homepage['testimonials'] }) {
  if (!testimonials?.length) return null
  return (
    <Section aria-label="Partner testimonials">
      <Container>
        <SectionHeading
          eyebrow="Partner voices"
          title="What our partners say"
          description="Distributors, importers and brand owners who rely on us for registered, export-ready medicines."
          align="center"
        />
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.slice(0, 3).map((t, i) => (
            <Reveal as="li" key={t.id || i} delay={i * 80} className="flex">
              <figure className="glass-card glass-edge relative flex w-full flex-col p-6 sm:p-8">
                <span
                  className="flex h-10 w-10 items-center justify-center bg-brand-50 text-brand-600 rounded-lg"
                  aria-hidden="true"
                >
                  <Quote className="h-4 w-4" />
                </span>
                <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-ink-800">
                  <p>“{t.quote}”</p>
                </blockquote>
                <figcaption className="mt-6 border-t border-ink-100 pt-4">
                  <span className="block text-sm font-semibold text-ink-950">{t.author}</span>
                  {t.role && <span className="block text-xs text-ink-500">{t.role}</span>}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
