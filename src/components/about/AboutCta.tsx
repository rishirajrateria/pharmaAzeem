import { ArrowRight, Mail, Phone } from 'lucide-react'
import Link from 'next/link'

import { Container } from '@/components/ui'
import { HudRings } from '@/components/visuals/MoleculeField'
import type { SiteSetting } from '@/payload-types'

/** Dark closing band with contact and manufacturing CTAs. */
export function AboutCta({ settings }: { settings: SiteSetting }) {
  const email = settings.contact?.email
  const phone = settings.contact?.phone
  return (
    <section className="mesh-bg-dark relative overflow-hidden section-y" aria-labelledby="about-cta">
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-20" aria-hidden="true" />
      <Container>
        <div className="glass-dark glass-edge relative overflow-hidden rounded-[2rem] p-8 sm:p-12 lg:p-16">
          <div className="pointer-events-none absolute -right-40 top-1/2 h-[36rem] w-[36rem] -translate-y-1/2 opacity-40" aria-hidden="true">
            <HudRings />
          </div>
          <div className="relative grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-brand-300">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-400" aria-hidden="true" />
                Partner with us
              </p>
              <h2 id="about-cta" className="display-2 mt-4 text-white">
                Let&apos;s bring quality medicines to your market
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/70">
                Whether you distribute, run hospitals or supply tenders, our team will help you register and source the right products – with complete documentation and dependable lead times.
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:col-span-4">
              <Link href="/contact" className="btn-primary w-full">
                Contact our team <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/manufacturing" className="btn w-full border border-white/20 text-white hover:border-white/40 hover:bg-white/10">
                See our manufacturing
              </Link>
              {(email || phone) && (
                <ul className="mt-3 space-y-2 text-sm text-white/70" aria-label="Direct contact">
                  {email && (
                    <li>
                      <a href={`mailto:${email}`} className="inline-flex items-center gap-2 hover:text-white">
                        <Mail className="h-4 w-4 text-brand-300" aria-hidden="true" /> {email}
                      </a>
                    </li>
                  )}
                  {phone && (
                    <li>
                      <a href={`tel:${phone.replace(/\s+/g, '')}`} className="inline-flex items-center gap-2 hover:text-white">
                        <Phone className="h-4 w-4 text-brand-300" aria-hidden="true" /> {phone}
                      </a>
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
