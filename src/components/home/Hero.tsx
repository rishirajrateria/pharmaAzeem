import {
  ArrowRight,
  FileCheck2,
  Globe,
  PackageCheck,
  Search,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import Link from 'next/link'

import type { CategoryNode } from '@/lib/data'
import type { Certification, Homepage } from '@/payload-types'

import { Media } from '../Media'
import { Button, Container } from '../ui'
import { Icon } from '../ui/Icon'

type Props = {
  hero: Homepage['hero']
  stats?: Homepage['stats']
  certifications: Certification[]
  countryCount: number
  categories: CategoryNode[]
  totalProducts: number
}

/** "WHO-GMP Certificate" → "WHO-GMP" for compact trust labels. */
const shortCertName = (title: string) =>
  title.replace(/\s*(certificate|certification)\s*$/i, '').trim()

/**
 * Full-bleed crimson hero: drifting colour blobs, a frosted search + headline on the left, the
 * banner image in a glass frame with floating glass stat cards on the right, and category chips
 * underneath. Server component. The banner image is the page's LCP candidate.
 */
export function Hero({
  hero,
  stats,
  certifications,
  countryCount,
  categories,
  totalProducts,
}: Props) {
  const primary = hero.primaryCta?.label && hero.primaryCta.url ? hero.primaryCta : null
  const secondary = hero.secondaryCta?.label && hero.secondaryCta.url ? hero.secondaryCta : null

  // Trust items come only from CMS data – never hard-coded claims.
  const countryStat = stats?.find((s) => /countr/i.test(s.label))
  const countries = countryStat
    ? `${countryStat.value}${countryStat.suffix ?? ''}`
    : countryCount > 0
      ? `${countryCount}+`
      : null
  const cert = certifications[0]
  const trust: { icon: LucideIcon; title: string; text: string }[] = [
    cert && {
      icon: ShieldCheck,
      title: shortCertName(cert.title),
      text: 'Certified manufacturing',
    },
    totalProducts > 0 && {
      icon: PackageCheck,
      title: `${totalProducts}+ products`,
      text: `${categories.length} therapeutic categories`,
    },
    countries && {
      icon: Globe,
      title: `${countries} countries`,
      text: 'Export by sea & air',
    },
    { icon: FileCheck2, title: 'Dossier support', text: 'CoA, CoPP & registration' },
  ].filter(Boolean) as { icon: LucideIcon; title: string; text: string }[]

  const [floatA, floatB] = trust

  return (
    <section
      className="bg-hero relative isolate overflow-hidden text-white"
      aria-labelledby="hero-title"
    >
      {/* Drifting light blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <span className="blob -left-24 -top-24 h-96 w-96 bg-brand-400/50" />
        <span
          className="blob right-[-6rem] top-10 h-[28rem] w-[28rem] bg-rose-300/35"
          style={{ animationDelay: '-6s' }}
        />
        <span
          className="blob bottom-[-8rem] left-1/3 h-96 w-[36rem] bg-orange-300/25"
          style={{ animationDelay: '-12s' }}
        />
        <div className="absolute inset-0 grid-pattern opacity-[0.07] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      </div>

      <Container className="relative pb-10 pt-10 sm:pt-14 lg:pb-14 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            {hero.eyebrow && (
              <span className="glass-night inline-flex w-fit items-center gap-2 !rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
                {hero.eyebrow}
              </span>
            )}
            <h1
              id="hero-title"
              className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl xl:text-[3.6rem]"
            >
              {hero.title}
            </h1>
            {hero.subtitle && (
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                {hero.subtitle}
              </p>
            )}

            {/* Frosted search */}
            <form
              action="/products"
              method="get"
              role="search"
              className="glass-night mt-8 hidden max-w-xl items-center gap-2 !rounded-full p-1.5 pl-5 md:flex"
            >
              <Search className="h-5 w-5 shrink-0 text-white/70" aria-hidden="true" />
              <label htmlFor="hero-search" className="sr-only">
                Search products
              </label>
              <input
                id="hero-search"
                name="q"
                type="search"
                placeholder={`Search ${totalProducts > 0 ? `${totalProducts}+ ` : ''}products, molecules…`}
                className="min-w-0 flex-1 bg-transparent py-2 text-sm text-white placeholder:text-white/55 focus:outline-none"
              />
              <button
                type="submit"
                className="btn bg-white px-5 py-2.5 text-brand-700 hover:bg-brand-50"
              >
                Search
              </button>
            </form>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={primary?.url || '/products'} variant="light">
                {primary?.label || 'Shop all products'}{' '}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              {secondary && (
                <Button href={secondary.url!} variant="outline-light">
                  {secondary.label}
                </Button>
              )}
            </div>
          </div>

          {/* Image in a glass frame with floating stat cards */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 -z-10 h-[85%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-brand-500/60 via-rose-300/40 to-white/30 blur-3xl"
            />
            <div className="glass-night !rounded-[2rem] p-2.5">
              <div className="relative aspect-[4/3.4] overflow-hidden rounded-[1.6rem]">
                <Media
                  media={hero.image}
                  size="large"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  className="absolute inset-0 h-full w-full"
                  imgClassName="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/50 via-transparent to-transparent" />
              </div>
            </div>
            {floatA && (
              <div className="float glass-strong absolute -left-4 top-8 hidden items-center gap-3 !rounded-2xl px-4 py-3 text-ink-950 sm:flex lg:-left-10">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-lg shadow-brand-700/30">
                  <floatA.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{floatA.title}</span>
                  <span className="block text-xs text-ink-500">{floatA.text}</span>
                </span>
              </div>
            )}
            {floatB && (
              <div
                className="float glass-strong absolute -right-3 bottom-10 hidden items-center gap-3 !rounded-2xl px-4 py-3 text-ink-950 sm:flex lg:-right-6"
                style={{ animationDelay: '-3s' }}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-lg shadow-brand-700/30">
                  <floatB.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{floatB.title}</span>
                  <span className="block text-xs text-ink-500">{floatB.text}</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Category chips */}
        {categories.length > 0 && (
          <nav aria-label="Shop by category" className="mt-12">
            <ul className="flex flex-wrap gap-2.5">
              {categories.slice(0, 9).map((c) => (
                <li key={c.id}>
                  <Link
                    prefetch={false}
                    href={`/categories/${c.path}`}
                    className="glass-night group inline-flex items-center gap-2 !rounded-full px-4 py-2 text-sm text-white/90 transition hover:-translate-y-0.5 hover:bg-white/20 hover:text-white"
                  >
                    <Icon name={c.icon} className="h-4 w-4 text-white/80" />
                    {c.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/categories"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-700 transition hover:-translate-y-0.5"
                >
                  All categories <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </nav>
        )}

        {/* Trust strip */}
        {trust.length > 0 && (
          <ul
            className="glass-night mt-8 grid grid-cols-1 overflow-hidden !rounded-3xl min-[480px]:grid-cols-2 lg:grid-cols-4"
            aria-label="Why buy from us"
          >
            {trust.map((t) => (
              <li
                key={t.title}
                className="flex items-center gap-3 border-white/15 p-5 [&:not(:last-child)]:border-b min-[480px]:[&:nth-child(odd)]:border-r lg:[&:not(:last-child)]:border-b-0 lg:[&:not(:last-child)]:border-r"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25">
                  <t.icon className="h-5 w-5 text-white" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">{t.title}</span>
                  <span className="block text-xs text-white/65">{t.text}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </Container>
      {/* Soft fade into the page background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
      />
    </section>
  )
}
