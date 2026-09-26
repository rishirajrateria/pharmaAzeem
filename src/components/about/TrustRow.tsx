import { ArrowRight, Award } from 'lucide-react'
import Link from 'next/link'

import { Media } from '@/components/Media'
import { Container, Eyebrow, Section } from '@/components/ui'
import { Reveal } from '@/components/ui/Reveal'
import { mediaUrl } from '@/lib/utils'
import type { Certification } from '@/payload-types'

const TYPE_LABEL: Record<Certification['type'], string> = {
  license: 'License',
  certification: 'Certification',
  accreditation: 'Accreditation',
  registration: 'Registration',
  membership: 'Membership',
}

/** "Certified & trusted" panel listing featured certifications and linking to /licenses. */
export function TrustRow({ certifications }: { certifications: Certification[] }) {
  if (!certifications.length) return null
  return (
    <Section className="!pt-0" aria-labelledby="about-trust">
      <Container>
        <div className="glass-strong glass-edge relative overflow-hidden rounded-[2rem] p-6 sm:p-10">
          <div className="pointer-events-none absolute inset-0 dots-pattern opacity-40 fade-mask-x" aria-hidden="true" />
          <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
            <div className="lg:col-span-4">
              <Eyebrow>Certified &amp; trusted</Eyebrow>
              <h2 id="about-trust" className="heading-2 mt-3">
                Compliance you can verify
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-600">
                Our licenses and certifications are audited regularly and available for your regulatory file. Certificate numbers, validity dates and scans are published on the licenses page.
              </p>
              <Link href="/licenses" className="btn-secondary mt-6">
                View all licenses <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-8" role="list">
              {certifications.slice(0, 6).map((c, i) => (
                <Reveal as="li" key={c.id} delay={i * 50}>
                  <Link
                    href="/licenses"
                    className="glass group flex h-full items-center gap-4 rounded-2xl p-4 transition hover:border-brand-300 hover:bg-white"
                  >
                    {mediaUrl(c.image) ? (
                      <Media
                        media={c.image}
                        size="thumbnail"
                        sizes="48px"
                        alt={`${c.title} – ${c.issuer}`}
                        className="h-12 w-12 shrink-0 rounded-xl bg-white object-contain p-1"
                      />
                    ) : (
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-[0_8px_20px_-8px_rgb(225_29_46_/_0.8)]">
                        <Award className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-ink-950 group-hover:text-brand-700">{c.title}</span>
                      <span className="block truncate text-xs text-ink-500">
                        {TYPE_LABEL[c.type]} · {c.issuer}
                      </span>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  )
}
