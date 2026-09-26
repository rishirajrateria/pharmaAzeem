import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { Container, Section } from '@/components/ui'

type Cta = { label: string; href: string }

/** Dark mesh CTA band with a glass card – used at the bottom of the contact & inquiry pages. */
export function CtaBand({
  id,
  eyebrow,
  title,
  description,
  primary,
  secondary,
}: {
  id: string
  eyebrow: string
  title: string
  description: string
  primary: Cta
  secondary?: Cta
}) {
  return (
    <Section aria-labelledby={id} className="pt-0 sm:pt-0 lg:pt-0">
      <Container>
        <div className="relative overflow-hidden rounded-4xl mesh-bg-dark px-4 py-10 noise sm:px-10 sm:py-14 lg:px-14">
          <div
            className="pointer-events-none absolute inset-0 grid-pattern opacity-30 fade-mask-y"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl animate-float"
            aria-hidden="true"
          />
          <div className="relative flex flex-col gap-8 rounded-3xl glass-dark p-6 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div className="max-w-2xl">
              <p className="eyebrow text-brand-300">{eyebrow}</p>
              <h2 id={id} className="heading-2 mt-3 text-white">
                {title}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-white/70">{description}</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link href={primary.href} className="btn-primary">
                {primary.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              {secondary && (
                <Link
                  href={secondary.href}
                  className="btn border border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/20"
                >
                  {secondary.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
