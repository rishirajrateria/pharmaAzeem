import { ArrowRight } from 'lucide-react'

import { Button, Container } from '@/components/ui'

type Cta = { label: string; href: string }

/** Solid brand CTA band – used at the bottom of the contact & inquiry pages. */
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
    <section aria-labelledby={id} className="bg-brand-700 text-white">
      <Container className="py-14 sm:py-16 lg:py-20">
        <div className="lg:flex lg:items-center lg:justify-between lg:gap-12">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-100">
              {eyebrow}
            </p>
            <h2 id={id} className="heading-2 mt-3 text-white">
              {title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/85 sm:text-lg">{description}</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3 lg:mt-0 lg:shrink-0">
            <Button href={primary.href} variant="light" size="lg">
              {primary.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            {secondary && (
              <Button href={secondary.href} variant="outline-light" size="lg">
                {secondary.label}
              </Button>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
