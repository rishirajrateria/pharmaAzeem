import { ArrowRight } from 'lucide-react'

import { Button, Container } from '../ui'

type Props = {
  eyebrow?: string
  title: string
  description?: string
  primary?: { label: string; href: string }
  secondary?: { label: string; href: string }
  id?: string
}

/** Solid brand CTA band – closes every page in the section. */
export function CtaBand({
  eyebrow = 'Next step',
  title,
  description,
  primary = { label: 'Inquire now', href: '/inquiry' },
  secondary = { label: 'Contact our export team', href: '/contact' },
  id = 'cta-heading',
}: Props) {
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
            {description && (
              <p className="mt-4 text-base leading-relaxed text-white/85 sm:text-lg">
                {description}
              </p>
            )}
          </div>
          <div className="mt-8 flex flex-wrap gap-3 lg:mt-0 lg:shrink-0">
            <Button href={primary.href} variant="light" size="lg">
              {primary.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button href={secondary.href} variant="outline-light" size="lg">
              {secondary.label}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
