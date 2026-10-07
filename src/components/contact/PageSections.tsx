import { Check } from 'lucide-react'

import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { Container, Eyebrow, Section } from '@/components/ui'
import { Reveal } from '@/components/ui/Reveal'
import type { ContactPage } from '@/payload-types'
import { cn } from '@/lib/utils'

type Sections = ContactPage['sections']

/**
 * Renders the free-form "sections" array every page global carries
 * (heading + rich text + optional image, alternating layout).
 */
export function PageSections({
  sections,
  idPrefix = 'section',
}: {
  sections?: Sections
  idPrefix?: string
}) {
  if (!sections?.length) return null
  return (
    <>
      {sections.map((s, i) => {
        const id = `${idPrefix}-${s.id || i}`
        const hasImage = Boolean(s.image && typeof s.image === 'object')
        const split = hasImage && s.layout !== 'full'
        const imageLeft = s.layout === 'imageLeft'
        return (
          <Section key={id} aria-labelledby={id}>
            <Container>
              <div
                className={cn(
                  split ? 'grid items-center gap-10 lg:grid-cols-2 lg:gap-16' : 'mx-auto max-w-3xl',
                )}
              >
                <Reveal className={cn(split && imageLeft && 'lg:order-2')}>
                  {s.eyebrow && <Eyebrow className="mb-4">{s.eyebrow}</Eyebrow>}
                  <h2 id={id} className="heading-2">
                    {s.heading}
                  </h2>
                  {s.body && <RichText data={s.body} className="mt-5" />}
                  {s.bullets && s.bullets.length > 0 && (
                    <ul className="mt-6 space-y-2.5">
                      {s.bullets.map((b) => (
                        <li
                          key={b.id || b.text}
                          className="flex items-start gap-3 text-sm text-ink-700"
                        >
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center bg-brand-50 text-brand-600 rounded-md">
                            <Check className="h-3 w-3" aria-hidden="true" />
                          </span>
                          {b.text}
                        </li>
                      ))}
                    </ul>
                  )}
                </Reveal>
                {split && (
                  <Reveal delay={120} className={cn('relative', imageLeft && 'lg:order-1')}>
                    <Media
                      media={s.image}
                      size="large"
                      fill
                      className="aspect-[4/3] border border-ink-200 rounded-xl"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </Reveal>
                )}
              </div>
            </Container>
          </Section>
        )
      })}
    </>
  )
}
