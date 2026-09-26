import { Timer } from 'lucide-react'
import type { ReactNode } from 'react'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { Container, Eyebrow } from '@/components/ui'
import { MoleculeField, HudRings } from '@/components/visuals/MoleculeField'
import { Orbs } from '@/components/visuals/Orbs'
import type { Crumb } from '@/lib/seo'
import type { ContactPage, Media as MediaDoc } from '@/payload-types'

type Props = {
  crumbs: Crumb[]
  eyebrow?: string | null
  title: string
  /** Concise, factual summary rendered directly under the h1 (LLMs quote this). */
  subtitle?: string | null
  intro?: ContactPage['intro']
  image?: number | MediaDoc | null
  /** Caption on the floating chip under the hero image. */
  badge?: { title: string; subtitle?: string | null }
  /** Decorative visual used when the CMS has no hero image. */
  visual?: ReactNode
  /** Extra content under the intro (CTA buttons, quick-contact chips…). */
  children?: ReactNode
}

/**
 * Page hero shared by the contact & inquiry pages: breadcrumbs, eyebrow, h1,
 * summary paragraph, intro rich text and a glass-framed image (or a decorative
 * visual) floating over HUD rings. Server component – zero client JS.
 */
export function ContactHero({
  crumbs,
  eyebrow,
  title,
  subtitle,
  intro,
  image,
  badge,
  visual,
  children,
}: Props) {
  const hasImage = Boolean(image && typeof image === 'object')
  const hasAside = hasImage || Boolean(visual)
  return (
    <section className="relative overflow-hidden pt-8 pb-10 sm:pt-10 sm:pb-14 lg:pt-14 lg:pb-16">
      <Orbs variant="intense" />
      <div
        className="absolute inset-x-0 top-0 -z-10 h-[32rem] grid-pattern fade-mask-y opacity-60"
        aria-hidden="true"
      />
      <Container>
        <Breadcrumbs crumbs={crumbs} />
        <div
          className={
            hasAside
              ? 'mt-8 grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-10'
              : 'mt-8 max-w-3xl'
          }
        >
          <div className={hasAside ? 'lg:col-span-7' : undefined}>
            {eyebrow && <Eyebrow className="mb-5">{eyebrow}</Eyebrow>}
            <h1 className="display-2">{title}</h1>
            {subtitle && <p className="lead mt-5 max-w-2xl">{subtitle}</p>}
            {intro && <RichText data={intro} className="mt-5 max-w-2xl" />}
            {children}
          </div>

          {hasAside && (
            <div className="relative lg:col-span-5">
              <HudRings className="hidden opacity-70 sm:flex" />
              {hasImage ? (
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  <div className="glass rotate-2 rounded-3xl p-2.5 shadow-glass-lg animate-float-slow">
                    <Media
                      media={image}
                      size="large"
                      fill
                      className="aspect-[4/3] rounded-2xl"
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 60vw, 40vw"
                      priority
                    />
                  </div>
                  {badge && (
                    <div className="absolute -bottom-5 left-3 flex items-center gap-3 rounded-2xl glass-strong px-4 py-3 shadow-glass animate-float sm:left-6">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white">
                        <Timer className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-ink-950">{badge.title}</p>
                        {badge.subtitle && (
                          <p className="text-[11px] text-ink-500">{badge.subtitle}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                (visual ?? (
                  <div
                    className="glass relative mx-auto max-w-md rotate-2 rounded-3xl p-6 shadow-glass-lg animate-float-slow lg:max-w-none"
                    aria-hidden="true"
                  >
                    <MoleculeField />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
