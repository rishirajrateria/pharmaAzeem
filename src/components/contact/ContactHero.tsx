import { Timer } from 'lucide-react'
import type { ReactNode } from 'react'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { Container, Eyebrow } from '@/components/ui'
import type { Crumb } from '@/lib/seo'
import { cn } from '@/lib/utils'
import type { ContactPage, Media as MediaDoc } from '@/payload-types'

type Props = {
  crumbs: Crumb[]
  eyebrow?: string | null
  title: string
  /** Concise, factual summary rendered directly under the h1 (LLMs quote this). */
  subtitle?: string | null
  intro?: ContactPage['intro']
  image?: number | MediaDoc | null
  /** Caption shown in a strip directly under the hero image. */
  badge?: { title: string; subtitle?: string | null }
  /** Extra content under the intro (CTA buttons, quick-contact chips…). */
  children?: ReactNode
}

/**
 * Page hero shared by the contact & inquiry pages: breadcrumbs, eyebrow, h1, summary
 * paragraph, intro rich text and extra content on the left; the hero photograph (with an
 * optional caption strip) on the right. Without an image the copy spans max-w-3xl.
 * Server component – zero client JS.
 */
export function ContactHero({
  crumbs,
  eyebrow,
  title,
  subtitle,
  intro,
  image,
  badge,
  children,
}: Props) {
  const hasImage = Boolean(image && typeof image === 'object')
  return (
    <section className="border-b border-white/60 bg-white/35 pb-14 pt-6 sm:pb-20 sm:pt-10">
      <Container>
        <Breadcrumbs crumbs={crumbs} className="mb-8 sm:mb-10" />
        <div className={cn('grid items-center gap-12', hasImage && 'lg:grid-cols-12')}>
          <div className={cn(hasImage ? 'lg:col-span-6' : 'max-w-3xl')}>
            {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
            <h1 className="display-2">{title}</h1>
            {subtitle && <p className="lead mt-5 max-w-2xl">{subtitle}</p>}
            {intro && <RichText data={intro} className="mt-5 max-w-2xl" />}
            {children}
          </div>

          {hasImage && (
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] overflow-hidden glass overflow-hidden">
                <Media
                  media={image}
                  size="large"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="h-full w-full"
                />
              </div>
              {badge && (
                <div className="flex items-center gap-3 glass rounded-t-none border-t-0 px-4 py-3">
                  <Timer className="h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
                  <p className="text-sm">
                    <span className="font-semibold text-ink-950">{badge.title}</span>
                    {badge.subtitle && <span className="text-ink-500"> · {badge.subtitle}</span>}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
