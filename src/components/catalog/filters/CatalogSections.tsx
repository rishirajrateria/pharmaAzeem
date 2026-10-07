import { Check } from 'lucide-react'

import type { ProductsPage } from '@/payload-types'
import { cn } from '@/lib/utils'

import { Media } from '../../Media'
import { RichText } from '../../RichText'
import { Eyebrow } from '../../ui'
import { Reveal } from '../../ui/Reveal'

type SectionDoc = NonNullable<ProductsPage['sections']>[number]

/** Renders the optional editorial "sections" of the products-page global (split image / text). */
export function CatalogSections({
  sections,
  className,
}: {
  sections?: SectionDoc[] | null
  className?: string
}) {
  if (!sections?.length) return null
  return (
    <div className={cn('space-y-16 lg:space-y-24', className)}>
      {sections.map((s, i) => {
        const layout = s.layout || (i % 2 === 0 ? 'imageRight' : 'imageLeft')
        const hasImage = Boolean(s.image && typeof s.image === 'object')
        const split = hasImage && layout !== 'full'
        return (
          <Reveal
            key={s.id || i}
            as="section"
            aria-labelledby={`catalog-section-${i}`}
            className={cn(split && 'grid items-center gap-10 lg:grid-cols-2 lg:gap-16')}
          >
            <div
              className={cn(split && layout === 'imageLeft' && 'lg:order-2', !split && 'max-w-3xl')}
            >
              {s.eyebrow && <Eyebrow className="mb-4">{s.eyebrow}</Eyebrow>}
              <h2 id={`catalog-section-${i}`} className="heading-2">
                {s.heading}
              </h2>
              {s.body && <RichText data={s.body} className="mt-5" />}
              {s.bullets && s.bullets.length > 0 && (
                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {s.bullets.map((b, j) => (
                    <li
                      key={b.id || j}
                      className="glass flex items-start gap-2.5 px-4 py-3 text-sm text-ink-800"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center bg-brand-gradient text-white">
                        <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                      </span>
                      {b.text}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {split && (
              <div className={cn('relative', layout === 'imageLeft' && 'lg:order-1')}>
                <div className="glass overflow-hidden p-2">
                  <Media
                    media={s.image}
                    size="large"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
              </div>
            )}
          </Reveal>
        )
      })}
    </div>
  )
}
