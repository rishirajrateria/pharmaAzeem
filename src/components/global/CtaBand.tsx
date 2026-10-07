import { ArrowRight } from 'lucide-react'

import { Button } from '../ui'
import { MoleculeField } from '../visuals/MoleculeField'

type Props = {
  eyebrow?: string
  title: string
  description?: string
  primary?: { label: string; href: string }
  secondary?: { label: string; href: string }
  id?: string
}

/** Dark mesh CTA band with a glass-dark card – closes every page in the section. */
export function CtaBand({
  eyebrow = 'Next step',
  title,
  description,
  primary = { label: 'Inquire now', href: '/inquiry' },
  secondary = { label: 'Contact our export team', href: '/contact' },
  id = 'cta-heading',
}: Props) {
  return (
    <section aria-labelledby={id} className="container-x section-y">
      <div className="mesh-bg-dark noise relative overflow-hidden p-6 text-white sm:p-10 lg:p-14">
        <div
          className="pointer-events-none absolute -right-10 -top-10 w-[28rem] opacity-40 lg:w-[34rem]"
          aria-hidden="true"
        >
          <MoleculeField />
        </div>
        <div
          className="pointer-events-none absolute inset-0 grid-pattern opacity-30"
          aria-hidden="true"
        />
        <div className="glass-dark relative max-w-3xl p-6 sm:p-8">
          <p className="eyebrow !text-brand-300">{eyebrow}</p>
          <h2 id={id} className="heading-2 mt-3 !text-white">
            {title}
          </h2>
          {description && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75">{description}</p>
          )}
          <div className="mt-7 flex flex-wrap gap-3">
            <Button href={primary.href}>
              {primary.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button href={secondary.href} variant="secondary" className="!text-ink-900">
              {secondary.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
