import { ArrowRight, Mail, Phone } from 'lucide-react'

import type { Homepage, SiteSetting } from '@/payload-types'

import { Button, Container } from '../ui'

/** Closing call-to-action: frosted glass panel with CMS heading/body, actions and direct contact links. */
export function CtaBand({ cta, settings }: { cta?: Homepage['cta']; settings: SiteSetting }) {
  if (!cta?.heading) return null
  const primary = cta.primaryCta?.label && cta.primaryCta.url ? cta.primaryCta : null
  const secondary = cta.secondaryCta?.label && cta.secondaryCta.url ? cta.secondaryCta : null
  const phone = settings.contact?.phone
  const email = settings.contact?.email

  return (
    <section aria-labelledby="cta-title" className="py-14 sm:py-20">
      <Container>
        <div className="glass-strong relative overflow-hidden !rounded-[2rem] px-7 py-12 sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between lg:gap-12">
          <div className="max-w-2xl">
            <h2 id="cta-title" className="heading-2 text-ink-950">
              {cta.heading}
            </h2>
            {cta.body && (
              <p className="mt-4 text-base leading-relaxed text-ink-600 sm:text-lg">{cta.body}</p>
            )}
            {(phone || email) && (
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-700">
                {phone && (
                  <li>
                    <a
                      href={`tel:${phone.replace(/\s+/g, '')}`}
                      className="inline-flex items-center gap-2 hover:text-brand-700"
                    >
                      <Phone className="h-4 w-4 text-brand-700" aria-hidden="true" /> {phone}
                    </a>
                  </li>
                )}
                {email && (
                  <li>
                    <a
                      href={`mailto:${email}`}
                      className="inline-flex items-center gap-2 hover:text-brand-700"
                    >
                      <Mail className="h-4 w-4 text-brand-700" aria-hidden="true" /> {email}
                    </a>
                  </li>
                )}
              </ul>
            )}
          </div>
          {(primary || secondary) && (
            <div className="mt-8 flex flex-wrap gap-3 lg:mt-0 lg:shrink-0">
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
        </div>
      </Container>
    </section>
  )
}
