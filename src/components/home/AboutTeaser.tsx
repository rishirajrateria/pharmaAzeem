import { ArrowRight, Building2, CalendarDays, MapPin, Users } from 'lucide-react'
import Link from 'next/link'

import type { Homepage, SiteSetting } from '@/payload-types'

import { Media } from '../Media'
import { Button, Container, Eyebrow, Section } from '../ui'
import { Reveal } from '../ui/Reveal'

/** "Who we are" split section: photograph with company facts beneath it, copy alongside. */
export function AboutTeaser({
  intro,
  settings,
}: {
  intro?: Homepage['intro']
  settings: SiteSetting
}) {
  if (!intro?.heading && !intro?.body) return null
  const addr = settings.contact?.address
  const hq = [addr?.city, addr?.country].filter(Boolean).join(', ')
  const facts = [
    settings.foundingYear && {
      icon: CalendarDays,
      label: 'Founded',
      value: String(settings.foundingYear),
    },
    settings.employeeCount && {
      icon: Users,
      label: 'Team',
      value: `${settings.employeeCount} people`,
    },
    hq && { icon: MapPin, label: 'Headquarters', value: hq },
    settings.legalName && { icon: Building2, label: 'Legal entity', value: settings.legalName },
  ].filter((f): f is { icon: typeof Users; label: string; value: string } => Boolean(f))

  return (
    <Section aria-label="About the company">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="order-last lg:order-first">
            <div className="relative aspect-[4/3] overflow-hidden border border-ink-200 bg-white">
              <Media
                media={intro.image}
                size="large"
                fill
                sizes="(max-width: 1024px) 92vw, 44vw"
                className="h-full w-full"
                imgClassName="object-cover"
              />
            </div>
            {facts.length > 0 && (
              <dl className="grid grid-cols-1 border-x border-b border-ink-200 bg-white min-[420px]:grid-cols-2">
                {facts.map((f) => (
                  <div
                    key={f.label}
                    className="border-ink-200 px-4 py-3 not-first:border-t min-[420px]:nth-2:border-t-0 min-[420px]:even:border-l"
                  >
                    <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-ink-500">
                      <f.icon className="h-3.5 w-3.5 text-brand-700" aria-hidden="true" />
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
