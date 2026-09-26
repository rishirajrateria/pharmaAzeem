import { Container, Section, SectionHeading } from '@/components/ui'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/utils'
import type { AboutPage } from '@/payload-types'

type Props = { milestones: AboutPage['milestones']; siteName: string }

/**
 * Vertical milestone timeline. A gradient spine runs down the left on small screens and down the
 * centre on large screens, where entries alternate sides. Nodes are small glass discs.
 */
export function Timeline({ milestones, siteName }: Props) {
  if (!milestones?.length) return null
  return (
    <Section className="overflow-hidden" aria-labelledby="about-timeline">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px hairline" aria-hidden="true" />
      <Container>
        <SectionHeading
          eyebrow="Milestones"
          title={<span id="about-timeline">Our journey so far</span>}
          description={`The moments that shaped ${siteName}, from our founding to today.`}
          align="center"
        />
        <div className="relative mt-14 lg:mt-20">
          <div
            className="pointer-events-none absolute bottom-0 left-5 top-0 w-px bg-gradient-to-b from-brand-200 via-brand-600 to-brand-200 lg:left-1/2 lg:-translate-x-1/2"
            aria-hidden="true"
          />
          <ol role="list">
            {milestones.map((m, i) => {
              const left = i % 2 === 0
              const isYear = /^\d{4}$/.test(m.year.trim())
              return (
                <li key={m.id || `${m.year}-${m.title}`} className="relative pb-10 pl-14 last:pb-0 lg:grid lg:grid-cols-2 lg:gap-x-20 lg:pb-14 lg:pl-0">
                  <span
                    className="glass absolute left-5 top-1 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full lg:left-1/2 lg:top-6"
                    aria-hidden="true"
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-brand-600 shadow-[0_0_0_4px_rgb(225_29_46_/_0.18)]" />
                    {i === milestones.length - 1 && <span className="absolute inset-0 rounded-full bg-brand-500/50 animate-pulse-ring" />}
                  </span>
                  <Reveal
                    as="div"
                    delay={Math.min(i, 4) * 60}
                    className={cn(
                      'glass-card glass-edge p-6 sm:p-7 lg:mt-0',
                      left ? 'lg:col-start-1 lg:text-right' : 'lg:col-start-2',
                    )}
                  >
                    <p className={cn('flex items-center gap-2 font-mono text-xs font-medium tracking-[0.2em] text-brand-600', left && 'lg:justify-end')}>
                      {isYear ? <time dateTime={m.year.trim()}>{m.year}</time> : <span>{m.year}</span>}
                      <span className="h-px w-6 bg-brand-300" aria-hidden="true" />
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-ink-950 sm:text-xl">{m.title}</h3>
                    {m.description && <p className="mt-2 text-sm leading-relaxed text-ink-600">{m.description}</p>}
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
