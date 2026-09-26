import { CalendarDays } from 'lucide-react'

import { RichText } from '@/components/RichText'
import { Container, Eyebrow, Section } from '@/components/ui'
import { MoleculeField } from '@/components/visuals/MoleculeField'
import type { AboutPage } from '@/payload-types'

export type KeyFact = { label: string; value: string }

type Props = {
  intro: AboutPage['intro']
  foundingYear?: number | null
  facts: KeyFact[]
}

/**
 * Opening story in a wide glass panel. The left column holds a "key facts" definition list
 * (machine-readable company facts for search engines and LLMs); the right column the rich text.
 */
export function IntroPanel({ intro, foundingYear, facts }: Props) {
  if (!intro && !facts.length) return null
  return (
    <Section className="!pt-0" aria-labelledby="about-story">
      <Container>
        <div className="relative">
          {foundingYear && (
            <span className="glass-red absolute -top-4 left-6 z-10 inline-flex animate-float items-center gap-2 rounded-full px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-brand-700 sm:left-10">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
              Founded {foundingYear}
            </span>
          )}
          <div className="glass-strong glass-edge noise relative overflow-hidden rounded-[2rem] px-6 py-12 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            <div className="pointer-events-none absolute -right-16 -top-16 w-80 opacity-40 fade-mask-y" aria-hidden="true">
              <MoleculeField animated={false} />
            </div>
            <div className="relative grid gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-4">
                <Eyebrow>Our story</Eyebrow>
                <h2 id="about-story" className="heading-2 mt-3">
                  Who we are
                </h2>
                {facts.length > 0 && (
                  <dl className="mt-8 divide-y divide-ink-100 border-y border-ink-100">
                    {facts.map((f) => (
                      <div key={f.label} className="grid grid-cols-[6.5rem_1fr] gap-4 py-3 text-sm sm:grid-cols-[7.5rem_1fr]">
                        <dt className="text-ink-500">{f.label}</dt>
                        <dd className="font-medium text-ink-900">{f.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
              <div className="lg:col-span-8">
                <RichText
                  data={intro}
                  className="[&_p]:!text-base [&_p]:!leading-relaxed sm:[&_p]:!text-lg [&>p:first-child]:text-ink-900 sm:[&>p:first-child]:!text-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
