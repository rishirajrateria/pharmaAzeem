import { RichText } from '@/components/RichText'
import { Container, Eyebrow, Section } from '@/components/ui'
import type { AboutPage } from '@/payload-types'

export type KeyFact = { label: string; value: string }

type Props = {
  intro: AboutPage['intro']
  foundingYear?: number | null
  facts: KeyFact[]
}

/**
 * Opening story. The left column holds a "key facts" definition list (machine-readable company
 * facts for search engines and LLMs); the right column the rich text.
 */
export function IntroPanel({ intro, foundingYear, facts }: Props) {
  if (!intro && !facts.length) return null
  return (
    <Section className="!pt-0" aria-labelledby="about-story">
      <Container>
        <div className="border-t border-ink-200 pt-12 sm:pt-14">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <Eyebrow>Our story</Eyebrow>
              <h2 id="about-story" className="heading-2 mt-3">
                Who we are
              </h2>
              {foundingYear && (
                <p className="mt-3 text-sm font-medium text-brand-700">Founded {foundingYear}</p>
              )}
              {facts.length > 0 && (
                <dl className="mt-8 divide-y divide-ink-200 border-y border-ink-200">
                  {facts.map((f) => (
                    <div
                      key={f.label}
                      className="grid grid-cols-[6.5rem_1fr] gap-4 py-3 text-sm sm:grid-cols-[7.5rem_1fr]"
                    >
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
      </Container>
    </Section>
  )
}
