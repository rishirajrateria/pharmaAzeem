import {
  ArrowUpRight,
  Building2,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Twitter,
  Youtube,
  type LucideIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'

import { Reveal } from '@/components/ui/Reveal'
import type { ContactPage, SiteSetting } from '@/payload-types'
import { cn } from '@/lib/utils'

type Contact = NonNullable<SiteSetting['contact']>

/* ------------------------------------------------------------------ */
/* Small helpers (kept local – see docs/frontend-guide.md ownership)   */
/* ------------------------------------------------------------------ */

/** `tel:` href from a human-formatted phone number. */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`

/** WhatsApp click-to-chat link (digits only, optional pre-filled message). */
export const whatsappHref = (number: string, text?: string) => {
  const digits = number.replace(/\D/g, '')
  return text
    ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
    : `https://wa.me/${digits}`
}

/** Postal address as display lines: street / city, state postal / country. */
export const addressLines = (addr?: Contact['address'] | null): string[] => {
  if (!addr) return []
  const cityLine = [[addr.city, addr.state].filter(Boolean).join(', '), addr.postalCode]
    .filter(Boolean)
    .join(' ')
  return [addr.street, cityLine, addr.country].filter((l): l is string => Boolean(l && l.trim()))
}

export const directionsHref = (lines: string[]) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lines.join(', '))}`

/* ------------------------------------------------------------------ */
/* Card shell                                                          */
/* ------------------------------------------------------------------ */

function Card({
  icon: Icon,
  title,
  children,
  className,
  delay = 0,
}: {
  icon: LucideIcon
  title: string
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <Reveal delay={delay} className={cn('glass glass-edge p-6 sm:p-7', className)}>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-brand-gradient text-white">
          <Icon className="h-4.5 w-4.5" aria-hidden="true" />
        </span>
        <h3 className="text-base font-semibold text-ink-950">{title}</h3>
      </div>
      <div className="mt-5">{children}</div>
    </Reveal>
  )
}

type CardProps = { className?: string; /** Reveal animation delay in ms. */ delay?: number }

const LABEL_CLASS = 'text-[10px] font-medium uppercase tracking-[0.2em] text-ink-400'

const Label = ({ children }: { children: ReactNode }) => <dt className={LABEL_CLASS}>{children}</dt>

/* ------------------------------------------------------------------ */
/* Head office                                                         */
/* ------------------------------------------------------------------ */

export function HeadOfficeCard({
  contact,
  className,
  delay,
}: CardProps & { contact?: SiteSetting['contact'] | null }) {
  const lines = addressLines(contact?.address)
  if (!lines.length && !contact?.businessHours) return null
  return (
    <Card icon={MapPin} title="Head office" className={className} delay={delay}>
      <dl className="space-y-4 text-sm">
        {lines.length > 0 && (
          <div>
            <Label>Address</Label>
            <dd className="mt-1">
              <address className="not-italic leading-relaxed text-ink-800">
                {lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </dd>
          </div>
        )}
        {contact?.businessHours && (
          <div>
            <Label>Business hours</Label>
            <dd className="mt-1 flex items-start gap-2 text-ink-800">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
              <span>{contact.businessHours}</span>
            </dd>
          </div>
        )}
      </dl>
      {lines.length > 0 && (
        <a
          href={directionsHref(lines)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
        >
          <Navigation className="h-4 w-4" aria-hidden="true" />
          Get directions
          <span className="sr-only"> (opens Google Maps in a new tab)</span>
        </a>
      )}
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/* Email & phone                                                       */
/* ------------------------------------------------------------------ */

/**
 * One name/value row of the card. The row <div> holds only <dt> + <dd> (the only
 * grouping HTML allows inside a <dl>), so the icon lives in the <dt>; a subgrid
 * lets the label sit beside the icon and the <dd> fill the value cell under it.
 */
function Row({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon
  label: string
  children: ReactNode
}) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] grid-rows-[auto_auto] items-center gap-x-3 gap-y-0.5 py-3 first:pt-0 last:pb-0">
      <dt className="col-span-2 row-span-2 grid grid-cols-subgrid grid-rows-subgrid items-center">
        <span
          className="row-span-2 flex h-9 w-9 items-center justify-center bg-brand-50 text-brand-600"
          aria-hidden="true"
        >
          <Icon className="h-4 w-4" />
        </span>
        <span className={LABEL_CLASS}>{label}</span>
      </dt>
      <dd className="col-start-2 row-start-2 min-w-0 truncate text-sm">{children}</dd>
    </div>
  )
}

export function ReachUsCard({
  contact,
  siteName,
  className,
  delay,
}: CardProps & { contact?: SiteSetting['contact'] | null; siteName: string }) {
  const email = contact?.email
  const phone = contact?.phone
  const whatsapp = contact?.whatsapp
  if (!email && !phone && !whatsapp) return null
  return (
    <Card icon={Mail} title="Email & phone" className={className} delay={delay}>
      <dl className="divide-y divide-ink-100">
        {email && (
          <Row icon={Mail} label="Email">
            <a href={`mailto:${email}`} className="font-medium text-ink-900 hover:text-brand-700">
              {email}
            </a>
          </Row>
        )}
        {phone && (
          <Row icon={Phone} label="Phone">
            <a href={telHref(phone)} className="font-medium text-ink-900 hover:text-brand-700">
              {phone}
            </a>
          </Row>
        )}
        {whatsapp && (
          <Row icon={MessageCircle} label="WhatsApp">
            <a
              href={whatsappHref(
                whatsapp,
                `Hello ${siteName}, I would like to inquire about your products.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-ink-900 hover:text-brand-700"
            >
              Chat on WhatsApp <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </Row>
        )}
      </dl>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/* Departments                                                         */
/* ------------------------------------------------------------------ */

export function DepartmentsCard({
  departments,
  className,
  delay,
}: CardProps & { departments?: ContactPage['departments'] }) {
  if (!departments?.length) return null
  return (
    <Card icon={Building2} title="Departments" className={className} delay={delay}>
      <ul className="divide-y divide-ink-100">
        {departments.map((d) => (
          <li key={d.id || d.name} className="py-3 first:pt-0 last:pb-0">
            <p className="text-sm font-semibold text-ink-950">{d.name}</p>
            {(d.email || d.phone) && (
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                {d.email && (
                  <a
                    href={`mailto:${d.email}`}
                    className="inline-flex items-center gap-1.5 text-ink-600 hover:text-brand-700"
                  >
                    <Mail className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
                    {d.email}
                  </a>
                )}
                {d.phone && (
                  <a
                    href={telHref(d.phone)}
                    className="inline-flex items-center gap-1.5 text-ink-600 hover:text-brand-700"
                  >
                    <Phone className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
                    {d.phone}
                  </a>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/* Social links                                                        */
/* ------------------------------------------------------------------ */

const SOCIAL: Record<string, { label: string; icon: LucideIcon }> = {
  linkedin: { label: 'LinkedIn', icon: Linkedin },
  facebook: { label: 'Facebook', icon: Facebook },
  instagram: { label: 'Instagram', icon: Instagram },
  x: { label: 'X (Twitter)', icon: Twitter },
  youtube: { label: 'YouTube', icon: Youtube },
  whatsapp: { label: 'WhatsApp', icon: MessageCircle },
}

export function SocialLinks({
  socials,
  className,
  delay = 0,
}: CardProps & { socials?: Contact['socials'] }) {
  if (!socials?.length) return null
  return (
    <Reveal delay={delay} className={cn('glass glass-edge p-6 sm:p-7', className)}>
      <h3 className="text-base font-semibold text-ink-950">Follow us</h3>
      <p className="mt-1 text-xs text-ink-500">
        Company news, new market registrations and product launches.
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {socials.map((s) => {
          const meta = SOCIAL[s.platform] || { label: s.platform, icon: ArrowUpRight }
          const Icon = meta.icon
          return (
            <li key={s.id || s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer me"
                aria-label={`${meta.label} (opens in a new tab)`}
                title={meta.label}
                className="flex h-11 w-11 items-center justify-center border border-ink-200/80 bg-white/70 text-ink-700 transition duration-300 hover:border-brand-500 hover:bg-brand-600 hover:text-white hover:shadow-glow"
              >
                <Icon className="h-4.5 w-4.5" aria-hidden="true" />
              </a>
            </li>
          )
        })}
      </ul>
    </Reveal>
  )
}
