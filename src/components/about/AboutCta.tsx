import { ArrowRight, Mail, Phone } from 'lucide-react'

import { Button, Container } from '@/components/ui'
import type { SiteSetting } from '@/payload-types'

/** Solid brand closing band with contact and manufacturing CTAs. */
export function AboutCta({ settings }: { settings: SiteSetting }) {
  const email = settings.contact?.email
  const phone = settings.contact?.phone
  return (
    <section className="bg-brand-band text-white" aria-labelledby="about-cta">
      <Container className="py-14 sm:py-16 lg:py-20">
        <div className="lg:flex lg:items-center lg:justify-between lg:gap-12">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-100">
              Partner with us
            </p>
            <h2 id="about-cta" className="heading-2 mt-3 text-white">
              Let&apos;s bring quality medicines to your market
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/85 sm:text-lg">
              Whether you distribute, run hospitals or supply tenders, our team can help you
              identify the right products and the documentation your market requires.
            </p>
            {(email || phone) && (
              <ul
                className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/85"
                aria-label="Direct contact"
              >
                {email && (
                  <li>
                    <a
                      href={`mailto:${email}`}
                      className="inline-flex items-center gap-2 hover:text-white hover:underline"
                    >
                      <Mail className="h-4 w-4" aria-hidden="true" /> {email}
                    </a>
                  </li>
                )}
                {phone && (
                  <li>
                    <a
                      href={`tel:${phone.replace(/\s+/g, '')}`}
                      className="inline-flex items-center gap-2 hover:text-white hover:underline"
                    >
                      <Phone className="h-4 w-4" aria-hidden="true" /> {phone}
                    </a>
                  </li>
                )}
              </ul>
            )}
          </div>
          <div className="mt-8 flex flex-wrap gap-3 lg:mt-0 lg:shrink-0">
            <Button href="/contact" variant="light" size="lg">
              Contact our team <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button href="/manufacturing" variant="outline-light" size="lg">
              See our manufacturing
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
