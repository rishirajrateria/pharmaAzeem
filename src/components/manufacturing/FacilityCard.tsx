import { ArrowRight, BadgeCheck, CalendarDays, ChevronDown, MapPin, Ruler } from 'lucide-react'
import Link from 'next/link'

import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { cn } from '@/lib/utils'
import type { Facility } from '@/payload-types'

import { FacilityGallery } from './FacilityGallery'
import { certificateHref, dosageFormHref, facilityAnchor, facilityCertifications, facilityImages, facilityPlace, facilityType, formatArea, pad2 } from './facilities'

/**
 * Large alternating split card for one facility: photo gallery on one side, structured facts
 * on the other. Every fact is real markup (dl/ul/address) so crawlers and LLMs can quote it.
 * The card id equals the facility slug and is the target of the sticky sub-nav + ItemList JSON-LD.
 */
export function FacilityCard({ facility, index, flip }: { facility: Facility; index: number; flip: boolean }) {
  const anchor = facilityAnchor(facility)
  const type = facilityType(facility)
  const TypeIcon = type.icon
  const images = facilityImages(facility)
  const certs = facilityCertifications(facility)
  const place = facilityPlace(facility)
  const area = formatArea(facility.areaSqm)
  const hasDescription = Boolean(facility.description)

  return (
    <article id={anchor} className="glass-card glass-edge relative scroll-mt-44 overflow-hidden !p-0 sm:scroll-mt-48" aria-labelledby={`${anchor}-title`}>
      <div className="grid lg:grid-cols-12">
        {/* Gallery */}
        <div className={cn('relative min-h-[16rem] bg-gradient-to-br from-brand-50 via-white to-brand-100 lg:col-span-6 lg:min-h-[32rem]', flip && 'lg:order-2')}>
          {images.length > 1 ? (
            <FacilityGallery images={images} name={facility.name} className="lg:absolute lg:inset-0" />
          ) : (
            <div className="relative aspect-[4/3] h-full w-full lg:absolute lg:inset-0 lg:aspect-auto">
              <Media media={images[0]} size="large" fill sizes="(max-width: 1024px) 100vw, 50vw" className="absolute inset-0 h-full w-full" imgClassName="object-cover" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/30 via-transparent to-transparent" aria-hidden="true" />
            </div>
          )}
          <span className="pointer-events-none absolute left-4 top-4 rounded-full glass-strong px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-700 shadow-glass sm:left-6 sm:top-6" aria-hidden="true">
            Facility {pad2(index + 1)}
          </span>
        </div>

        {/* Facts */}
        <div className={cn('flex flex-col p-6 sm:p-8 lg:col-span-6 lg:p-10', flip && 'lg:order-1')}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gradient px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white shadow-[0_6px_16px_-6px_rgb(225_29_46_/_0.6)]" title={type.description}>
              <TypeIcon className="h-3.5 w-3.5" aria-hidden="true" />
              {type.label}
            </span>
          </div>

          <h3 id={`${anchor}-title`} className="mt-5 heading-3 text-ink-950">
            {facility.name}
          </h3>
          {(place || facility.address) && (
            <p className="mt-2 flex items-start gap-1.5 text-sm text-ink-500">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
              <span>
                {place && <span className="font-medium text-ink-700">{place}</span>}
                {place && facility.address && <span aria-hidden="true"> · </span>}
                {facility.address && <span>{facility.address}</span>}
              </span>
            </p>
          )}
          {facility.summary && <p className="mt-4 text-[15px] leading-relaxed text-ink-600 sm:text-base">{facility.summary}</p>}

          {facility.capacity?.length ? (
            <dl className="mt-6 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:grid-cols-3" aria-label="Capacity">
              {facility.capacity.map((c, i) => (
                <div key={c.id || i} className="glass-subtle rounded-2xl px-3.5 py-3">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">{c.label}</dt>
                  <dd className="mt-1 font-mono text-sm font-semibold leading-snug text-ink-950">{c.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          <div className="mt-6 space-y-4">
            {facility.capabilities?.length ? (
              <div>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">Capabilities</p>
                <ul className="flex flex-wrap gap-1.5" role="list">
                  {facility.capabilities.map((c, i) => (
                    <li key={c.id || i} className="chip !py-0.5">
                      {c.text}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {facility.dosageForms?.length ? (
              <div>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">Dosage forms</p>
                <ul className="flex flex-wrap gap-1.5" role="list">
                  {facility.dosageForms.map((d) => (
                    <li key={d}>
                      <Link href={dosageFormHref(d)} className="chip !py-0.5 transition hover:border-brand-400 hover:bg-white hover:text-brand-800" title={`Browse ${d} products`}>
                        {d}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {certs.length ? (
              <div>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">Certifications</p>
                <ul className="flex flex-wrap gap-1.5" role="list">
                  {certs.map((c) => (
                    <li key={c.id}>
                      <Link href={certificateHref(c)} className="chip !py-0.5 transition hover:border-brand-400 hover:bg-white hover:text-brand-800" title={`${c.title} – ${c.issuer}`}>
                        <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                        {c.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          {hasDescription && (
            <details className="group mt-6 rounded-2xl border border-ink-100/80 bg-white/50">
              <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-ink-900">
                More about this facility
                <ChevronDown className="h-4 w-4 text-brand-600 transition-transform duration-300 group-open:rotate-180" aria-hidden="true" />
              </summary>
              <div className="px-4 pb-4">
                <RichText data={facility.description} className="text-sm [&_h2]:mt-4 [&_h2]:text-base [&_h3]:mt-4 [&_h3]:text-base [&_p]:text-sm" />
              </div>
            </details>
          )}

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 pt-5 lg:pt-6">
            <dl className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink-500" aria-label="Facility facts">
              {facility.establishedYear && (
                <div className="flex items-center gap-1.5">
                  <dt className="inline-flex items-center gap-1.5 font-mono uppercase tracking-[0.14em] text-ink-400">
                    <CalendarDays className="h-3.5 w-3.5 text-brand-500" aria-hidden="true" />
                    Established
                  </dt>
                  <dd className="font-mono font-semibold text-ink-800">{facility.establishedYear}</dd>
                </div>
              )}
              {area && (
                <div className="flex items-center gap-1.5">
                  <dt className="inline-flex items-center gap-1.5 font-mono uppercase tracking-[0.14em] text-ink-400">
                    <Ruler className="h-3.5 w-3.5 text-brand-500" aria-hidden="true" />
                    Built-up area
                  </dt>
                  <dd className="font-mono font-semibold text-ink-800">{area}</dd>
                </div>
              )}
            </dl>
            <Link href="/contact" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline">
              Discuss a project here <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
