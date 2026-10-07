'use client'

import {
  ArrowRight,
  ChevronDown,
  Headset,
  LayoutGrid,
  Mail,
  Menu,
  Phone,
  Search,
  Truck,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useId, useRef, useState } from 'react'

import { useModalFocus } from '@/hooks/useModalFocus'

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

export function HeaderClient({
  siteName,
  tagline,
  logo,
  nav,
  labels,
  announcement,
  phone,
  email,
}: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [mega, setMega] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    const raf = window.requestAnimationFrame(onScroll)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  // Close menus when the route changes (state adjustment during render – no effect needed).
  const [prevPathname, setPrevPathname] = useState(pathname)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setOpen(false)
    setMega(false)
  }

  const menuRef = useRef<HTMLDivElement>(null)
  const closeMenu = useCallback(() => setOpen(false), [])
  useModalFocus(open, menuRef, closeMenu)
  const megaRef = useRef<HTMLDivElement>(null)

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <>
      {/* Utility bar – scrolls away; the store header below stays pinned. */}
      <div className="border-b border-white/60 bg-white/40 text-xs text-ink-600 backdrop-blur-md">
        <div className="container-x flex h-9 items-center justify-between gap-4">
          <p className="truncate">
            {announcement?.text ? (
              announcement.url ? (
                <Link
                  href={announcement.url}
                  className="font-medium text-ink-800 hover:text-brand-700"
                >
                  {announcement.text}
                </Link>
              ) : (
                announcement.text
              )
            ) : (
              tagline
            )}
          </p>
          <div className="hidden shrink-0 items-center gap-5 lg:flex">
            {phone && (
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-1.5 hover:text-brand-700"
              >
                <Phone className="h-3.5 w-3.5" aria-hidden="true" /> {phone}
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-1.5 hover:text-brand-700"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden="true" /> {email}
              </a>
            )}
            <span className="h-3.5 w-px bg-ink-300" aria-hidden="true" />
            <nav className="flex items-center gap-4" aria-label="Company">
              {PRIMARY_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    'hover:text-brand-700',
                    isActive(l.href) && 'font-semibold text-brand-700',
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <header
        className={cn(
          'sticky top-0 z-50 border-b border-white/70 bg-white/70 backdrop-blur-xl backdrop-saturate-150 transition-shadow duration-200',
          scrolled && 'shadow-glass-lg',
        )}
      >
        <div className="container-x">
          <div className="flex h-16 items-center gap-4 lg:h-20 lg:gap-8">
            <Logo siteName={siteName} logo={logo} imgClassName="h-9 lg:h-12" />

            <HeaderSearch className="hidden flex-1 md:flex" />

            <div className="ml-auto flex items-center gap-2 md:ml-0">
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="hidden items-center gap-2.5 pr-2 xl:flex"
                >
                  <Headset className="h-7 w-7 text-brand-700" aria-hidden="true" />
                  <span className="leading-tight">
                    <span className="block text-[11px] text-ink-500">Bulk & export orders</span>
                    <span className="block text-sm font-semibold text-ink-950">{phone}</span>
                  </span>
                </a>
              )}
              <InquiryTrigger label={labels.listName} />
              <Link href="/inquiry" className="btn-primary hidden !py-3 text-sm lg:inline-flex">
                {labels.ctaLabel}
              </Link>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center glass text-ink-800 lg:hidden"
                aria-label="Open menu"
                aria-expanded={open}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
          <HeaderSearch className="pb-3 md:hidden" />
        </div>

        {/* Category bar */}
        <div className="hidden bg-brand-700/90 text-white backdrop-blur-xl lg:block">
          <nav className="container-x flex h-12 items-stretch" aria-label="Product categories">
            <div
              className="relative"
              ref={megaRef}
              onMouseEnter={() => setMega(true)}
              onMouseLeave={() => setMega(false)}
              onClick={(e) => {
                if ((e.target as HTMLElement).closest('a')) setMega(false)
              }}
              onFocus={() => setMega(true)}
              onBlur={(e) => {
                if (!megaRef.current?.contains(e.relatedTarget as Node | null)) setMega(false)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setMega(false)
                if (e.key === 'ArrowDown' && !mega) {
                  e.preventDefault()
                  setMega(true)
                }
              }}
            >
              <Link
                href="/categories"
                className="flex h-full items-center gap-2.5 bg-brand-900/40 px-5 text-sm font-semibold"
                aria-haspopup="true"
                aria-expanded={mega}
              >
                <LayoutGrid className="h-4 w-4" aria-hidden="true" />
                All categories
                <ChevronDown
                  className={cn('h-3.5 w-3.5 transition-transform', mega && 'rotate-180')}
                  aria-hidden="true"
                />
              </Link>
              {/* Mega menu */}
              <div
                className={cn(
                  'absolute left-0 top-full z-50 w-[min(60rem,calc(100vw-3rem))] text-ink-900 transition-opacity duration-150',
                  mega ? 'visible opacity-100' : 'invisible opacity-0',
                )}
              >
                <div className="glass-strong border-t-0 p-4 shadow-glass-lg">
                  <div className="grid grid-cols-3 gap-2">
                    {nav.map((c) => (
                      <div key={c.id} className="p-3 transition-colors hover:bg-surface-2">
                        <Link prefetch={false} href={c.path} className="flex items-start gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-brand-50 text-brand-700">
                            <Icon name={c.icon} className="h-4.5 w-4.5" />
                          </span>
                          <span>
                            <span className="block text-sm font-semibold text-ink-950">
                              {c.title}
                            </span>
                            <span className="block text-xs text-ink-500">{c.count} products</span>
                          </span>
                        </Link>
                        {c.children.length > 0 && (
                          <ul className="mt-2 flex flex-wrap gap-1 pl-12">
                            {c.children.slice(0, 5).map((sub) => (
                              <li key={sub.id}>
                                <Link
                                  prefetch={false}
                                  href={sub.path}
                                  className="border border-transparent px-2 py-0.5 text-[11px] text-ink-600 hover:border-brand-200 hover:bg-white hover:text-brand-700"
                                >
                                  {sub.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-ink-100 px-3 pt-3">
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline"
                    >
                      Shop all products <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/categories"
                      className="inline-flex items-center gap-1.5 text-xs text-ink-500 hover:text-ink-900"
                    >
                      Category index
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/products"
              className={cn(
                'flex items-center px-4 text-sm font-medium transition-colors hover:bg-brand-800',
                pathname === '/products' && 'bg-brand-800',
              )}
            >
              All products
            </Link>
            {nav.slice(0, 5).map((c, i) => (
              <Link
                key={c.id}
                prefetch={false}
                href={c.path}
                className={cn(
                  'items-center whitespace-nowrap px-4 text-sm font-medium transition-colors hover:bg-brand-800',
                  i < 3 ? 'flex' : 'hidden 2xl:flex',
                  isActive(c.path) && 'bg-brand-800',
                )}
              >
                {c.title}
              </Link>
            ))}
            <Link
              href="/global-presence"
              className="ml-auto hidden items-center gap-2 px-4 text-sm font-medium transition-colors hover:bg-brand-800 xl:flex"
            >
              <Truck className="h-4 w-4" aria-hidden="true" /> Export to 50+ countries
            </Link>
          </nav>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={cn(
          'fixed inset-0 z-[60] lg:hidden',
          open ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        aria-hidden={!open}
        inert={!open}
      >
        <div
          className={cn(
            'absolute inset-0 bg-ink-950/30 backdrop-blur-sm transition-opacity duration-200',
            open ? 'opacity-100' : 'opacity-0',
          )}
          onClick={() => setOpen(false)}
        />
        <div
          ref={menuRef}
          tabIndex={-1}
          className={cn(
            'absolute inset-y-0 right-0 flex w-[min(24rem,92vw)] flex-col border-l border-white/70 bg-white/80 outline-none backdrop-blur-2xl transition-[transform,visibility] duration-300 ease-out',
            open ? 'visible translate-x-0' : 'invisible translate-x-full',
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
            <Logo siteName={siteName} logo={logo} imgClassName="h-9" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center hover:bg-brand-50"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 py-4" aria-label="Mobile">
            <p className="px-3 pb-2 text-[10px] uppercase tracking-[0.2em] text-ink-400">
              Products
            </p>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/products"
                  className="flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-ink-900 hover:bg-brand-50"
                >
                  All products <ArrowRight className="h-4 w-4 text-brand-600" />
                </Link>
              </li>
              {nav.map((c) => (
                <li key={c.id}>
                  <Link
                    prefetch={false}
                    href={c.path}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-ink-800 hover:bg-brand-50"
                  >
                    <span className="flex h-8 w-8 items-center justify-center bg-brand-50 text-brand-600">
                      <Icon name={c.icon} className="h-4 w-4" />
                    </span>
                    <span className="flex-1">{c.title}</span>
                    <span className="text-xs text-ink-400">{c.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="px-3 pb-2 pt-6 text-[10px] uppercase tracking-[0.2em] text-ink-400">
              Company
            </p>
            <ul className="space-y-1">
              {PRIMARY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    prefetch={false}
                    href={l.href}
                    className={cn(
                      'block px-3 py-2.5 text-sm hover:bg-brand-50',
                      isActive(l.href) ? 'text-brand-700 font-semibold' : 'text-ink-800',
                    )}
                  >
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
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="inline-flex items-center gap-2 hover:text-brand-700"
                >
                  <Phone className="h-3.5 w-3.5" /> {phone}
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 hover:text-brand-700"
                >
                  <Mail className="h-3.5 w-3.5" /> {email}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/** Store-style product search – a plain GET form to the catalogue, works without JavaScript. */
function HeaderSearch({ className }: { className?: string }) {
  const id = useId()
  return (
    <form role="search" method="get" action="/products" className={cn('w-full', className)}>
      <label htmlFor={id} className="sr-only">
        Search products
      </label>
      <div className="flex w-full border border-ink-300/80 bg-white/70 backdrop-blur-md focus-within:border-brand-700 focus-within:bg-white/90">
        <Search className="ml-3.5 h-4 w-4 shrink-0 self-center text-ink-400" aria-hidden="true" />
        <input
          id={id}
          type="search"
          name="q"
          placeholder="Search medicines by brand, generic name or category"
          autoComplete="off"
          enterKeyHint="search"
          maxLength={80}
          className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-brand-700 px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
        >
          Search
        </button>
      </div>
    </form>
  )
}
