import { ArrowRight } from 'lucide-react'

import { Button, Container } from '@/components/ui'

type Cta = { label: string; href: string }

/** Closing CTA band: solid brand-700 band, white type, primary + secondary actions. */
export function CtaBand({
  eyebrow,
  title,
  description,
  primary,
  secondary,
  id = 'cta',
}: {
  eyebrow: string
  title: string
  description: string
  primary: Cta
  secondary?: Cta
  id?: string
}) {
  return (
    <section className="bg-brand-band text-white" aria-labelledby={`${id}-title`}>
      <Container className="py-14 sm:py-16 lg:py-20">
        <div className="lg:flex lg:items-center lg:justify-between lg:gap-12">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-100">
              {eyebrow}
            </p>
            <h2 id={`${id}-title`} className="heading-2 mt-3 text-white">
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
