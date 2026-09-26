import { ArrowRight, Mail, Phone } from 'lucide-react'

import type { Homepage, SiteSetting } from '@/payload-types'

import { Button, Container } from '../ui'
import { Reveal } from '../ui/Reveal'
import { Orbs } from '../visuals/Orbs'

/** Closing call-to-action: glass-red panel with CMS heading/body and direct contact links. */
export function CtaBand({ cta, settings }: { cta?: Homepage['cta']; settings: SiteSetting }) {
  if (!cta?.heading) return null
  const primary = cta.primaryCta?.label && cta.primaryCta.url ? cta.primaryCta : null
  const secondary = cta.secondaryCta?.label && cta.secondaryCta.url ? cta.secondaryCta : null
  const phone = settings.contact?.phone
  const email = settings.contact?.email

  return (
    <section aria-labelledby="cta-title" className="relative pb-8 sm:pb-12">
      <Container>
        <Reveal>
          <div className="glass-red gradient-border relative isolate overflow-hidden rounded-[2.5rem] px-6 py-12 text-center sm:px-12 sm:py-16 lg:py-20">
            <Orbs variant="subtle" />
            <div className="dots-pattern absolute inset-0 -z-10 opacity-40" aria-hidden="true" />
            <h2 id="cta-title" className="display-2 mx-auto max-w-3xl">
              {cta.heading}
            </h2>
            {cta.body && <p className="lead mx-auto mt-5 max-w-2xl">{cta.body}</p>}
            {(primary || secondary) && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                {primary && (
                  <Button href={primary.url!} size="lg">
                    {primary.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                )}
                {secondary && (
                  <Button href={secondary.url!} variant="secondary" size="lg">
                    {secondary.label}
                  </Button>
                )}
              </div>
            )}
            {(phone || email) && (
              <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-700">
                {phone && (
                  <li>
                    <a href={`tel:${phone.replace(/\s+/g, '')}`} className="inline-flex items-center gap-2 hover:text-brand-700">
                      <Phone className="h-4 w-4 text-brand-600" aria-hidden="true" /> {phone}
                    </a>
                  </li>
                )}
                {email && (
                  <li>
                    <a href={`mailto:${email}`} className="inline-flex items-center gap-2 hover:text-brand-700">
                      <Mail className="h-4 w-4 text-brand-600" aria-hidden="true" /> {email}
                    </a>
                  </li>
                )}
              </ul>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
