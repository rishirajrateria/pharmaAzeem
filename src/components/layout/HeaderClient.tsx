'use client'

import { ArrowRight, ChevronDown, Mail, Menu, Phone, Search, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/utils'

import { InquiryTrigger } from '../inquiry/InquiryTrigger'
import { Logo } from './Logo'
import { PRIMARY_LINKS, type NavCategory } from './nav'

type Props = {
  siteName: string
  tagline?: string | null
  logo?: string
  nav: NavCategory[]
  labels: { listName: string; ctaLabel: string }
  announcement: { text: string; url?: string } | null
  phone?: string
  email?: string
}

export function HeaderClient({ siteName, tagline, logo, nav, labels, announcement, phone, email }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [mega, setMega] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
    setMega(false)
  }, [pathname])

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [open])

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <header className="sticky top-0 z-50">
      {announcement?.text && (
        <div className="bg-brand-gradient text-white">
          <div className="container-x flex h-9 items-center justify-center gap-2 text-center text-xs font-medium tracking-wide">
            {announcement.url ? (
              <Link href={announcement.url} className="inline-flex items-center gap-1.5 hover:underline">
                {announcement.text} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              announcement.text
            )}
          </div>
        </div>
      )}
      <div className={cn('transition-all duration-500', scrolled ? 'py-2' : 'py-3 sm:py-4')}>
        <div className="container-x">
          <div
            className={cn(
              'glass-edge flex items-center justify-between gap-4 rounded-full px-4 py-2 pl-5 transition-all duration-500 sm:px-5',
              scrolled ? 'glass-strong shadow-glass-lg' : 'glass',
            )}
          >
            <Logo siteName={siteName} tagline={tagline} logo={logo} />

            {/* Desktop nav */}
            <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
              <div className="relative" onMouseEnter={() => setMega(true)} onMouseLeave={() => setMega(false)}>
                <Link
                  href="/products"
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition hover:bg-brand-50 hover:text-brand-700',
                    isActive('/products') || isActive('/categories') ? 'text-brand-700' : 'text-ink-700',
                  )}
                  aria-haspopup="true"
                  aria-expanded={mega}
                >
                  Products <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', mega && 'rotate-180')} />
                </Link>
                {/* Mega menu */}
                <div
                  className={cn(
                    'absolute left-1/2 top-full z-50 w-[min(60rem,calc(100vw-3rem))] -translate-x-1/2 pt-4 transition-all duration-300',
                    mega ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0',
                  )}
                >
                  <div className="glass-strong rounded-3xl p-4 shadow-glass-lg">
                    <div className="grid grid-cols-3 gap-2">
                      {nav.map((c) => (
                        <div key={c.id} className="rounded-2xl p-3 transition hover:bg-brand-50/70">
                          <Link href={c.path} className="flex items-start gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-[0_8px_20px_-8px_rgb(225_29_46_/_0.7)]">
                              <Icon name={c.icon} className="h-4.5 w-4.5" />
                            </span>
                            <span>
                              <span className="block text-sm font-semibold text-ink-950">{c.title}</span>
                              <span className="block text-xs text-ink-500">{c.count} products</span>
                            </span>
                          </Link>
                          {c.children.length > 0 && (
                            <ul className="mt-2 flex flex-wrap gap-1 pl-12">
                              {c.children.slice(0, 5).map((s) => (
                                <li key={s.id}>
                                  <Link href={s.path} className="rounded-full border border-transparent px-2 py-0.5 text-[11px] text-ink-600 hover:border-brand-200 hover:bg-white hover:text-brand-700">
                                    {s.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-ink-100 px-3 pt-3">
                      <Link href="/products" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline">
                        Browse full catalogue <ArrowRight className="h-4 w-4" />
                      </Link>
                      <Link href="/products?focus=search" className="inline-flex items-center gap-1.5 text-xs text-ink-500 hover:text-ink-900">
                        <Search className="h-3.5 w-3.5" /> Search products
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              {PRIMARY_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    'rounded-full px-3.5 py-2 text-sm font-medium transition hover:bg-brand-50 hover:text-brand-700',
                    isActive(l.href) ? 'text-brand-700' : 'text-ink-700',
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <InquiryTrigger label={labels.listName} />
              <Link href="/inquiry" className="btn-primary hidden !py-2.5 text-xs md:inline-flex">
                {labels.ctaLabel}
              </Link>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-800 transition hover:bg-brand-50 lg:hidden"
                aria-label="Open menu"
                aria-expanded={open}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn('fixed inset-0 z-[60] lg:hidden', open ? 'pointer-events-auto' : 'pointer-events-none')} aria-hidden={!open}>
        <div className={cn('absolute inset-0 bg-ink-950/30 backdrop-blur-sm transition-opacity duration-300', open ? 'opacity-100' : 'opacity-0')} onClick={() => setOpen(false)} />
        <div
          className={cn(
            'absolute inset-y-0 right-0 flex w-[min(24rem,92vw)] flex-col glass-strong shadow-glass-lg transition-transform duration-500 ease-[var(--ease-out-expo)]',
            open ? 'translate-x-0' : 'translate-x-full',
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
            <Logo siteName={siteName} tagline={tagline} logo={logo} />
            <button type="button" onClick={() => setOpen(false)} className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-brand-50" aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 py-4" aria-label="Mobile">
            <p className="px-3 pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-400">Products</p>
            <ul className="space-y-1">
              <li>
                <Link href="/products" className="flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm font-semibold text-ink-900 hover:bg-brand-50">
                  All products <ArrowRight className="h-4 w-4 text-brand-600" />
                </Link>
              </li>
              {nav.map((c) => (
                <li key={c.id}>
                  <Link href={c.path} className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-ink-800 hover:bg-brand-50">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <Icon name={c.icon} className="h-4 w-4" />
                    </span>
                    <span className="flex-1">{c.title}</span>
                    <span className="text-xs text-ink-400">{c.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="px-3 pb-2 pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-400">Company</p>
            <ul className="space-y-1">
              {PRIMARY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={cn('block rounded-2xl px-3 py-2.5 text-sm hover:bg-brand-50', isActive(l.href) ? 'text-brand-700 font-semibold' : 'text-ink-800')}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-3 border-t border-ink-100 p-5">
            <Link href="/inquiry" className="btn-primary w-full">
              {labels.ctaLabel} <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="flex flex-col gap-1.5 text-xs text-ink-600">
              {phone && (
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="inline-flex items-center gap-2 hover:text-brand-700">
                  <Phone className="h-3.5 w-3.5" /> {phone}
                </a>
              )}
              {email && (
                <a href={`mailto:${email}`} className="inline-flex items-center gap-2 hover:text-brand-700">
                  <Mail className="h-3.5 w-3.5" /> {email}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
