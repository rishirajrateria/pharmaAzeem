import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'

import { getCertifications, getLayoutData } from '@/lib/data'
import { mediaUrl } from '@/lib/utils'

import { Logo } from './Logo'
import { PRIMARY_LINKS } from './nav'

const SOCIAL_LABEL: Record<string, string> = {
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  instagram: 'Instagram',
  x: 'X (Twitter)',
  youtube: 'YouTube',
  whatsapp: 'WhatsApp',
}

export async function Footer() {
  const [{ settings, tree }, certs] = await Promise.all([
    getLayoutData(),
    getCertifications({ featured: true }),
  ])
  const addr = settings.contact?.address
  const year = new Date().getFullYear()
  return (
    <footer className="relative mt-24 pt-10" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="absolute inset-x-0 top-0 hairline" aria-hidden="true" />
      <div className="container-x">
        {/* Trust strip */}
        {certs.length > 0 && (
          <div className="glass -mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 py-4 text-center">
            <span className="text-[10px] uppercase tracking-[0.2em] text-ink-500">
              Certified & licensed
            </span>
            {certs
              .filter((c) => !c.validUntil || new Date(c.validUntil) >= new Date())
              .slice(0, 6)
              .map((c) => (
              <Link
                key={c.id}
                href="/licenses"
                className="inline-flex items-center gap-2 text-sm font-medium text-ink-800 hover:text-brand-700"
              >
                <span className="h-1.5 w-1.5 bg-brand-600" />
                {c.title}
              </Link>
            ))}
          </div>
        )}

        <div className="grid gap-12 py-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo
              siteName={settings.siteName}
              tagline={settings.tagline}
              logo={mediaUrl(settings.logo)}
            />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-600">
              {settings.shortDescription}
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-ink-700">
              {addr?.city && (
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  <span>
                    {[addr.street, addr.city, addr.state, addr.postalCode, addr.country]
                      .filter(Boolean)
                      .join(', ')}
                  </span>
                </li>
              )}
              {settings.contact?.phone && (
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-brand-600" />
                  <a
                    href={`tel:${settings.contact.phone.replace(/\s+/g, '')}`}
                    className="hover:text-brand-700"
                  >
                    {settings.contact.phone}
                  </a>
                </li>
              )}
              {settings.contact?.email && (
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-brand-600" />
                  <a href={`mailto:${settings.contact.email}`} className="hover:text-brand-700">
                    {settings.contact.email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-ink-500">
              Products
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-ink-800 hover:text-brand-700">
                  All products
                </Link>
              </li>
              {tree.slice(0, 8).map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/categories/${c.path}`}
                    className="text-ink-800 hover:text-brand-700"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-ink-500">
              Company
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {PRIMARY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    prefetch={false}
                    href={l.href}
                    className="text-ink-800 hover:text-brand-700"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/inquiry" className="text-ink-800 hover:text-brand-700">
                  Request a quote
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-ink-500">
              Stay connected
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {(settings.contact?.socials || []).map((s) => (
                <li key={s.id || s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-ink-800 hover:text-brand-700"
                  >
                    {SOCIAL_LABEL[s.platform] || s.platform}{' '}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </li>
              ))}
            </ul>
            {settings.contact?.businessHours && (
              <p className="mt-6 text-xs text-ink-500">{settings.contact.businessHours}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-ink-100 py-6 text-xs text-ink-500 sm:flex-row sm:items-center">
          <p>
            © {year} {settings.legalName || settings.siteName}. All rights reserved.
          </p>
          <p className="flex flex-wrap gap-4">
            <Link prefetch={false} href="/sitemap.xml" className="hover:text-brand-700">
              Sitemap
            </Link>
            <Link prefetch={false} href="/llms.txt" className="hover:text-brand-700">
              llms.txt
            </Link>
            <Link prefetch={false} href="/admin" className="hover:text-brand-700">
              Admin
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
