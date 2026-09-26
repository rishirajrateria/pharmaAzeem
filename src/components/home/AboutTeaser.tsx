import { ArrowRight, Building2, CalendarDays, MapPin, Users } from 'lucide-react'
import Link from 'next/link'

import type { Homepage, SiteSetting } from '@/payload-types'

import { Media } from '../Media'
import { Button, Container, Eyebrow, Section } from '../ui'
import { Reveal } from '../ui/Reveal'
import { MoleculeField } from '../visuals/MoleculeField'

/** "Who we are" split section: image in a floating glass frame + company facts. */
export function AboutTeaser({ intro, settings }: { intro?: Homepage['intro']; settings: SiteSetting }) {
  if (!intro?.heading && !intro?.body) return null
  const addr = settings.contact?.address
  const hq = [addr?.city, addr?.country].filter(Boolean).join(', ')
  const facts = [
    settings.foundingYear && { icon: CalendarDays, label: 'Founded', value: String(settings.foundingYear) },
    settings.employeeCount && { icon: Users, label: 'Team', value: `${settings.employeeCount} people` },
    hq && { icon: MapPin, label: 'Headquarters', value: hq },
    settings.legalName && { icon: Building2, label: 'Legal entity', value: settings.legalName },
  ].filter((f): f is { icon: typeof Users; label: string; value: string } => Boolean(f))

  return (
    <Section aria-label="About the company" className="overflow-hidden">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative order-last lg:order-first">
            <MoleculeField className="absolute -left-10 -top-12 w-64 opacity-60" animated={false} />
            <div className="absolute -bottom-10 -right-6 h-48 w-48 rounded-full bg-brand-gradient opacity-15 blur-3xl" aria-hidden="true" />
            <div className="glass relative rounded-[2rem] p-3 shadow-glass-lg rotate-[2deg] transition-transform duration-700 hover:rotate-0">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-white">
                <Media media={intro.image} size="large" fill sizes="(max-width: 1024px) 92vw, 44vw" className="h-full w-full" imgClassName="object-cover" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-brand-600/10 via-transparent to-white/30" aria-hidden="true" />
              </div>
            </div>
            {facts.length > 0 && (
              <dl className="relative z-10 -mt-8 ml-4 mr-4 grid grid-cols-2 gap-3 sm:-mt-10 sm:ml-8 sm:mr-0 sm:max-w-md">
                {facts.map((f) => (
                  <div key={f.label} className="glass-strong glass-edge rounded-2xl px-4 py-3">
                    <dt className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                      <f.icon className="h-3 w-3 text-brand-600" aria-hidden="true" />
                      {f.label}
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-ink-950">{f.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </Reveal>

          <Reveal delay={120}>
            {intro.eyebrow && <Eyebrow className="mb-4">{intro.eyebrow}</Eyebrow>}
            {intro.heading && <h2 className="heading-2">{intro.heading}</h2>}
            {intro.body && <p className="lead mt-5">{intro.body}</p>}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="/about">
                Learn more about us <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Link href="/quality" className="btn-ghost">
                Our quality systems
              </Link>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
