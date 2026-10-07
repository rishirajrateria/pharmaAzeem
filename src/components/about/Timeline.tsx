import { Container, Section, SectionHeading } from '@/components/ui'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/utils'
import type { AboutPage } from '@/payload-types'

type Props = { milestones: AboutPage['milestones']; siteName: string }

/**
 * Vertical milestone timeline. A thin spine runs down the left on small screens and down the
 * centre on large screens, where entries alternate sides. Nodes are small square brand markers.
 */
export function Timeline({ milestones, siteName }: Props) {
  if (!milestones?.length) return null
  return (
    <Section className="border-t border-ink-200" aria-labelledby="about-timeline">
      <Container>
        <SectionHeading
          eyebrow="Milestones"
          title={<span id="about-timeline">Our journey so far</span>}
          description={`The moments that shaped ${siteName}, from our founding to today.`}
          align="center"
        />
        <div className="relative mt-14 lg:mt-20">
          <div
            className="pointer-events-none absolute bottom-0 left-5 top-0 w-px bg-ink-200 lg:left-1/2 lg:-translate-x-1/2"
            aria-hidden="true"
          />
          <ol role="list">
            {milestones.map((m, i) => {
              const left = i % 2 === 0
              const isYear = /^\d{4}$/.test(m.year.trim())
              return (
                <li
                  key={m.id || `${m.year}-${m.title}`}
                  className="relative pb-10 pl-14 last:pb-0 lg:grid lg:grid-cols-2 lg:gap-x-20 lg:pb-14 lg:pl-0"
                >
                  <span
                    className="absolute left-5 top-7 z-10 h-3 w-3 -translate-x-1/2 bg-brand-700 lg:left-1/2 lg:top-8"
                    aria-hidden="true"
                  />
                  <Reveal
                    as="div"
                    delay={Math.min(i, 4) * 60}
                    className={cn(
                      'glass p-6 sm:p-7 lg:mt-0',
                      left ? 'lg:col-start-1 lg:text-right' : 'lg:col-start-2',
                    )}
                  >
                    <p className="text-sm font-semibold tracking-wider text-brand-700">
                      {isYear ? (
                        <time dateTime={m.year.trim()}>{m.year}</time>
                      ) : (
                        <span>{m.year}</span>
                      )}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-ink-950 sm:text-xl">
                      {m.title}
                    </h3>
                    {m.description && (
                      <p className="mt-2 text-sm leading-relaxed text-ink-600">{m.description}</p>
                    )}
                  </Reveal>
                </li>
              )
            })}
          </ol>
        </div>
      </Container>
    </Section>
  )
}
