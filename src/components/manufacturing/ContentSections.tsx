import { Check } from 'lucide-react'

import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { Container, Eyebrow, Section } from '@/components/ui'
import { Reveal } from '@/components/ui/Reveal'
import { cn, slugify } from '@/lib/utils'
import type { ManufacturingPage } from '@/payload-types'

type ContentSection = NonNullable<ManufacturingPage['sections']>[number]

function Bullets({
  bullets,
  className,
}: {
  bullets?: ContentSection['bullets']
  className?: string
}) {
  if (!bullets?.length) return null
  return (
    <ul className={cn('grid gap-3', className)} role="list">
      {bullets.map((b, i) => (
        <li key={b.id || i} className="flex items-start gap-3 text-[15px] text-ink-700">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full glass-red text-brand-700">
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <span>{b.text}</span>
        </li>
      ))}
    </ul>
  )
}

/**
 * Generic renderer for the CMS `sections` array: alternating image/text splits with the image
 * in a tilted glass frame, or a full-width glass panel when no image is set.
 */
export function ContentSections({ sections }: { sections?: ContentSection[] | null }) {
  if (!sections?.length) return null
  return (
    <Section className="pt-0">
      <Container className="space-y-20 lg:space-y-28">
        {sections.map((s, i) => {
          const id = `section-${slugify(s.heading) || i}`
          const hasImage = Boolean(s.image && typeof s.image === 'object')
          const layout = s.layout || (i % 2 === 0 ? 'imageRight' : 'imageLeft')
          if (layout === 'full' || !hasImage) {
            return (
              <Reveal key={s.id || i} as="section" aria-labelledby={id}>
                <div className="relative overflow-hidden rounded-[2rem] glass-strong glass-edge p-6 sm:p-10 lg:p-14">
                  <div
                    className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgb(255_199_205_/_0.6),transparent)]"
                    aria-hidden="true"
                  />
                  <div className="relative grid gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                      {s.eyebrow && <Eyebrow className="mb-4">{s.eyebrow}</Eyebrow>}
                      <h2 id={id} className="heading-2">
                        {s.heading}
                      </h2>
                    </div>
                    <div className="lg:col-span-7">
                      <RichText data={s.body} />
                      <Bullets
                        bullets={s.bullets}
                        className={cn(s.body && 'mt-6', 'sm:grid-cols-2')}
                      />
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          }
          const imageLeft = layout === 'imageLeft'
          return (
            <Reveal key={s.id || i} as="section" aria-labelledby={id}>
              <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <div className={cn(imageLeft && 'lg:order-2')}>
                  {s.eyebrow && <Eyebrow className="mb-4">{s.eyebrow}</Eyebrow>}
                  <h2 id={id} className="heading-2">
                    {s.heading}
                  </h2>
                  <RichText data={s.body} className="mt-5" />
                  <Bullets bullets={s.bullets} className="mt-6" />
                </div>
                <div className={cn('relative', imageLeft && 'lg:order-1')}>
                  <div
                    className="pointer-events-none absolute -inset-6 -z-10 dots-pattern fade-mask-y opacity-60"
                    aria-hidden="true"
                  />
                  <div
                    className={cn(
                      'glass glass-edge rounded-[2rem] p-2.5 shadow-glass-lg sm:p-3',
                      imageLeft ? 'rotate-1' : '-rotate-1',
                    )}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[1.6rem]">
                      <Media
                        media={s.image}
                        size="large"
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="h-full w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          )
        })}
      </Container>
    </Section>
  )
}
