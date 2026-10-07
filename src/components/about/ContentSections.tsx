import { Check } from 'lucide-react'

import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { Container, Eyebrow, Section } from '@/components/ui'
import { Reveal } from '@/components/ui/Reveal'
import { cn, slugify } from '@/lib/utils'
import type { AboutPage } from '@/payload-types'

/** Shape of one entry of the shared `sections` array field (src/fields/page.ts). */
export type ContentSection = NonNullable<AboutPage['sections']>[number]

type Props = {
  sections?: ContentSection[] | null
  /** Heading level for each section heading (default h2). */
  headingLevel?: 'h2' | 'h3'
  className?: string
}

/**
 * Renders the CMS "sections" array: alternating image/text splits (per `layout`) or full-width
 * glass panels, each with optional rich text and a check-list of bullets. Reusable on any page.
 */
export function ContentSections({ sections, headingLevel = 'h2', className }: Props) {
  if (!sections?.length) return null
  const Heading = headingLevel
  return (
    <>
      {sections.map((s, i) => {
        const id = `section-${slugify(s.heading) || i + 1}`
        const hasImage = Boolean(s.image && typeof s.image === 'object')
        const layout = s.layout === 'full' || !hasImage ? 'full' : s.layout || 'imageRight'
        const bullets = (s.bullets || []).filter((b) => b.text)
        return (
          <Section key={s.id || id} className={cn('!pt-0', className)} aria-labelledby={id}>
            <Container>
              {layout === 'full' ? (
                <Reveal className="glass-strong glass-edge relative overflow-hidden px-6 py-10 sm:px-10 sm:py-12 lg:px-14">
                  <div
                    className="pointer-events-none absolute inset-0 dots-pattern opacity-30 fade-mask-x"
                    aria-hidden="true"
                  />
                  <div className="relative grid gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-4">
                      {s.eyebrow && <Eyebrow>{s.eyebrow}</Eyebrow>}
                      <Heading id={id} className="heading-2 mt-3">
                        {s.heading}
                      </Heading>
                    </div>
                    <div className="lg:col-span-8">
                      <RichText data={s.body} />
                      {bullets.length > 0 && (
                        <BulletList
                          bullets={bullets}
                          className={cn(s.body && 'mt-6', 'sm:grid-cols-2')}
                        />
                      )}
                    </div>
                  </div>
                </Reveal>
              ) : (
                <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                  <Reveal className={cn(layout === 'imageLeft' && 'lg:order-2')}>
                    {s.eyebrow && <Eyebrow>{s.eyebrow}</Eyebrow>}
                    <Heading id={id} className="heading-2 mt-3">
                      {s.heading}
                    </Heading>
                    <RichText data={s.body} className="mt-5" />
                    {bullets.length > 0 && <BulletList bullets={bullets} className="mt-6" />}
                  </Reveal>
                  <Reveal
                    delay={90}
                    className={cn('relative', layout === 'imageLeft' && 'lg:order-1')}
                  >
                    <div
                      className="pointer-events-none absolute -inset-6 -z-10 bg-brand-100/50 blur-2xl"
                      aria-hidden="true"
                    />
                    <div
                      className={cn(
                        'glass glass-edge p-2.5 shadow-glass-lg',
                        layout === 'imageLeft' ? 'rotate-[1.5deg]' : 'rotate-[-1.5deg]',
                      )}
                    >
                      <Media
                        media={s.image}
                        size="large"
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="aspect-[4/3] bg-white"
                      />
                    </div>
                  </Reveal>
                </div>
              )}
            </Container>
          </Section>
        )
      })}
    </>
  )
}

function BulletList({
  bullets,
  className,
}: {
  bullets: { text: string; id?: string | null }[]
  className?: string
}) {
  return (
    <ul className={cn('grid gap-3', className)} role="list">
      {bullets.map((b, i) => (
        <li key={b.id || i} className="flex items-start gap-3 text-[15px] text-ink-800">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center bg-brand-gradient text-white shadow-[0_4px_12px_-4px_rgb(225_29_46_/_0.8)]">
            <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
          </span>
          <span>{b.text}</span>
        </li>
      ))}
    </ul>
  )
}
