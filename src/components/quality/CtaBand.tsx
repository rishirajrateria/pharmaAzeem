import { ArrowRight } from 'lucide-react'

import { Button, Container } from '@/components/ui'
import { MoleculeField } from '@/components/visuals/MoleculeField'
import { Orbs } from '@/components/visuals/Orbs'

type Cta = { label: string; href: string }

/** Dark closing CTA band: mesh-bg-dark, glass-dark card, white type, primary + secondary actions. */
export function CtaBand({ eyebrow, title, description, primary, secondary, id = 'cta' }: { eyebrow: string; title: string; description: string; primary: Cta; secondary?: Cta; id?: string }) {
  return (
    <section className="relative isolate overflow-hidden mesh-bg-dark py-16 sm:py-20 lg:py-24" aria-labelledby={`${id}-title`}>
      <Orbs variant="subtle" className="opacity-80" />
      <div className="pointer-events-none absolute -right-10 top-1/2 hidden w-[28rem] -translate-y-1/2 opacity-30 lg:block" aria-hidden="true">
        <MoleculeField animated={false} />
      </div>
      <Container>
        <div className="glass-dark glass-edge relative overflow-hidden rounded-[2rem] p-8 sm:p-12 lg:flex lg:items-center lg:justify-between lg:gap-12 lg:p-16">
          <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(closest-side,rgb(225_29_46_/_0.45),transparent)]" aria-hidden="true" />
          <div className="relative max-w-2xl">
            <p className="inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-brand-300">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-400 shadow-[0_0_0_4px_rgb(255_102_117_/_0.25)]" />
              {eyebrow}
            </p>
            <h2 id={`${id}-title`} className="mt-4 heading-2 text-white">
              {title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/70 sm:text-lg">{description}</p>
          </div>
          <div className="relative mt-8 flex flex-wrap gap-3 lg:mt-0 lg:shrink-0">
            <Button href={primary.href} size="lg">
              {primary.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            {secondary && (
              <Button href={secondary.href} variant="secondary" size="lg">
                {secondary.label}
              </Button>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
