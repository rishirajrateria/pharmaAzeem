import { ArrowRight, Award } from 'lucide-react'
import Link from 'next/link'

import { MarqueePause } from './MarqueePause'

import type { Certification } from '@/payload-types'

import { Media } from '../Media'
import { Container } from '../ui'

const TYPE_LABEL: Record<Certification['type'], string> = {
  license: 'License',
  certification: 'Certification',
  accreditation: 'Accreditation',
  registration: 'Registration',
  membership: 'Membership',
}

/**
 * Infinite CSS marquee of certifications / licences. The list is repeated an even number of
 * times so the -50% keyframe loops seamlessly; copies are aria-hidden and unfocusable.
 * Under `prefers-reduced-motion` the marquee becomes a plain horizontal scroller (mask and
 * copies removed) so every item stays reachable by mouse, touch and keyboard.
 */
export function CertificationsMarquee({ certifications }: { certifications: Certification[] }) {
  if (!certifications.length) return null
  const repeat = certifications.length >= 10 ? 2 : 4
  const items = Array.from({ length: repeat }, () => certifications).flat()

  return (
    <section aria-label="Certifications and licenses" className="relative py-10 sm:py-14">
      <Container className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">
            <Award className="h-3.5 w-3.5" aria-hidden="true" /> Certified &amp; audited
          </p>
          <p className="mt-2 text-sm text-ink-600">
            Browse the licences and certificates behind our quality systems – copies are available
            on request.
          </p>
        </div>
        <Link
          href="/licenses"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline"
        >
          View all licenses &amp; certifications{' '}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <MarqueePause targetId="cert-marquee" />
      </Container>

      <div
        id="cert-marquee"
        className="group fade-mask-x relative mt-6 overflow-hidden motion-reduce:overflow-x-auto motion-reduce:pb-3 motion-reduce:mask-none data-[paused=true]:[&_ul]:[animation-play-state:paused]"
      >
        <ul className="flex w-max animate-marquee motion-reduce:animate-none motion-reduce:px-4 group-hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
          {items.map((c, i) => {
            const copy = i >= certifications.length
            return (
              <li
                key={`${c.id}-${i}`}
                className={copy ? 'pr-4 motion-reduce:hidden' : 'pr-4'}
                aria-hidden={copy || undefined}
              >
                <Link
                  href="/licenses"
                  tabIndex={copy ? -1 : undefined}
                  className="glass glass-edge flex items-center gap-3 py-3 pl-3 pr-5 transition hover:border-brand-300 hover:shadow-glass-lg"
                >
                  <Media
                    media={c.image}
                    size="thumbnail"
                    sizes="40px"
                    className="h-10 w-10 shrink-0 object-cover"
                    fallback={
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-brand-gradient text-white rounded-lg">
                        <Award className="h-4.5 w-4.5" aria-hidden="true" />
                      </span>
                    }
                  />
                  <span className="whitespace-nowrap">
                    <span className="block text-sm font-semibold text-ink-950">{c.title}</span>
                    <span className="block text-[11px] text-ink-500">
                      <span className="uppercase tracking-wider text-brand-600">
                        {TYPE_LABEL[c.type]}
                      </span>{' '}
                      · {c.issuer}
                    </span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
