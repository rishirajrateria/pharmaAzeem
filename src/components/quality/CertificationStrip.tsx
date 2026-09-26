import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { Media } from '@/components/Media'
import { Badge, Button, Container, Section, SectionHeading } from '@/components/ui'
import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import type { Certification } from '@/payload-types'
import { cn } from '@/lib/utils'

import { CERT_TYPE_META, certAnchor, certStatus } from './certifications'

/** Strip of featured certifications as glass tiles (title + issuer), each linking to its card on /licenses. */
export function CertificationStrip({ certifications }: { certifications: Certification[] }) {
  if (!certifications.length) return null
  const cols = certifications.length >= 5 ? 'lg:grid-cols-5' : certifications.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
  return (
    <Section aria-labelledby="certs-title" className="!pt-0">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Certified & licensed"
            title={<span id="certs-title">Audited by regulators, verified by partners</span>}
            description="Our licences and certificates are issued by statutory authorities and accredited bodies. Every one can be verified using its certificate number."
          />
          <Button href="/licenses" variant="secondary" className="shrink-0">
            All licenses & certifications <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
        <ul className={cn('mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3', cols)} role="list">
          {certifications.map((c, i) => {
            const status = certStatus(c)
            return (
              <Reveal key={c.id} as="li" delay={i * 50} className="h-full">
                <Link
                  href={`/licenses#${certAnchor(c)}`}
                  className="group glass-card relative flex h-full flex-col items-center p-5 text-center"
                  aria-label={`${c.title} – view on the licenses page`}
                >
                  <span className="relative h-16 w-16 overflow-hidden rounded-2xl glass p-1">
                    <Media
                      media={c.image}
                      size="thumbnail"
                      fill
                      sizes="64px"
                      className="h-full w-full rounded-xl"
                      imgClassName="transition-transform duration-700 group-hover:scale-105"
                      fallback={
                        <span className="flex h-full w-full items-center justify-center rounded-xl bg-brand-gradient text-white">
                          <Icon name={CERT_TYPE_META[c.type].icon} className="h-6 w-6" />
                        </span>
                      }
                    />
                  </span>
                  <h3 className="mt-4 text-sm font-semibold leading-snug text-ink-950 group-hover:text-brand-700">{c.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-ink-500">{c.issuer}</p>
                  <span className="mt-auto pt-4">
                    <Badge tone={status === 'valid' ? 'success' : 'ink'}>{status === 'valid' ? 'Valid' : 'Expired'}</Badge>
                  </span>
                </Link>
              </Reveal>
            )
          })}
        </ul>
      </Container>
    </Section>
  )
}
