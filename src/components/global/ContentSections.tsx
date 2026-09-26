import { Check } from 'lucide-react'

import type { GlobalPresencePage } from '@/payload-types'
import { cn } from '@/lib/utils'

import { Media } from '../Media'
import { RichText } from '../RichText'
import { Eyebrow } from '../ui'
import { Reveal } from '../ui/Reveal'

type CmsSection = NonNullable<GlobalPresencePage['sections']>[number]

/** Renders the optional editor-defined content sections (image left/right or full width, with bullets). */
export function ContentSections({ sections }: { sections?: CmsSection[] | null }) {
  if (!sections?.length) return null
  return (
    <>
      {sections.map((s, i) => {
        const layout = s.layout || (i % 2 === 0 ? 'imageRight' : 'imageLeft')
        const hasImage = Boolean(s.image) && layout !== 'full'
        const id = `section-${s.id || i}`
        return (
          <section key={s.id || i} aria-labelledby={id} className="container-x section-y !pt-0">
            <div className={cn('grid items-center gap-8 lg:gap-16', hasImage && 'lg:grid-cols-2')}>
              <Reveal className={cn(hasImage && layout === 'imageLeft' && 'lg:order-2')}>
                {s.eyebrow && <Eyebrow className="mb-4">{s.eyebrow}</Eyebrow>}
                <h2 id={id} className="heading-2">
                  {s.heading}
                </h2>
                {s.body && <RichText data={s.body} className="mt-5 max-w-3xl" />}
                {s.bullets && s.bullets.length > 0 && (
                  <ul className="mt-6 grid gap-2.5 sm:grid-cols-2" role="list">
                    {s.bullets.map((b, j) => (
                      <li key={b.id || j} className="flex items-start gap-2.5 text-sm text-ink-700">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-brand-200">
                          <Check className="h-3 w-3" aria-hidden="true" />
                        </span>
                        {b.text}
                      </li>
                    ))}
                  </ul>
                )}
              </Reveal>
              {hasImage && (
                <Reveal delay={120} className={cn(layout === 'imageLeft' && 'lg:order-1')}>
                  <div className="glass rounded-3xl p-2 shadow-glass-lg">
                    <Media
                      media={s.image}
                      size="large"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="aspect-[4/3] w-full rounded-2xl object-cover"
                    />
                  </div>
                </Reveal>
              )}
            </div>
          </section>
        )
      })}
    </>
  )
}
