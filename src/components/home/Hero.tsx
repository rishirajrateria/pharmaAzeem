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
 * Light frosted-glass hero: headline + search on the left, the banner image in a glass frame with
 * floating glass stat cards on the right, category chips and a trust strip underneath. Red is used
 * only as a flat accent – no red gradients. Server component. The banner image is the page's LCP candidate.
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
    <section className="relative isolate overflow-hidden" aria-labelledby="hero-title">
      {/* Soft background shapes that show through the frosted glass */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <span className="blob -left-24 top-10 h-[26rem] w-[26rem] bg-brand-700/15" />
        <span
          className="blob right-0 top-0 h-[30rem] w-[30rem] bg-slate-400/25"
          style={{ animationDelay: '-6s' }}
        />
        <span
          className="blob bottom-0 left-1/2 h-80 w-[34rem] bg-brand-400/15"
          style={{ animationDelay: '-12s' }}
        />
      </div>

      <Container className="relative py-8 lg:py-12">
        <div className="glass-strong grid items-center gap-10 !rounded-[2rem] p-6 sm:p-10 lg:grid-cols-[1.25fr_0.75fr] lg:p-14">
          <div>
            {hero.eyebrow && (
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-700/15 bg-white/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-700">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-700/50" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-700" />
                </span>
                {hero.eyebrow}
              </span>
            )}
            <h1
              id="hero-title"
              className="mt-6 text-4xl font-semibold leading-[1.06] tracking-tight text-ink-950 sm:text-5xl xl:text-[3.25rem]"
            >
              {hero.title}
            </h1>
            {hero.subtitle && (
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-600 sm:text-lg">
                {hero.subtitle}
              </p>
            )}

            {/* Frosted search */}
            <form
              action="/products"
              method="get"
              role="search"
              className="mt-8 hidden max-w-xl items-center gap-2 rounded-full border border-white bg-white/70 p-1.5 pl-5 shadow-[0_12px_30px_-18px_rgb(15_23_42_/_0.35)] backdrop-blur-xl md:flex"
            >
              <Search className="h-5 w-5 shrink-0 text-ink-400" aria-hidden="true" />
              <label htmlFor="hero-search" className="sr-only">
                Search products
              </label>
              <input
                id="hero-search"
                name="q"
                type="search"
                placeholder={`Search ${totalProducts > 0 ? `${totalProducts}+ ` : ''}products, molecules…`}
                className="min-w-0 flex-1 bg-transparent py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
              />
              <button type="submit" className="btn-primary !px-5 !py-2.5">
                Search
              </button>
            </form>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={primary?.url || '/products'}>
                {primary?.label || 'Shop all products'}{' '}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              {secondary && (
                <Button href={secondary.url!} variant="secondary">
                  {secondary.label}
                </Button>
              )}
            </div>
          </div>

          {/* Image in a glass frame with floating stat cards */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="glass !rounded-[1.75rem] p-2.5">
              <div className="relative aspect-[4/3.4] overflow-hidden rounded-[1.35rem] bg-white">
                <Media
                  media={hero.image}
                  size="large"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  className="absolute inset-0 h-full w-full"
                  imgClassName="object-cover"
                />
              </div>
            </div>
            {floatA && (
              <div className="float glass-strong absolute -left-4 top-8 hidden items-center gap-3 !rounded-2xl px-4 py-3 sm:flex lg:-left-10">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-700 text-white">
                  <floatA.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink-950">{floatA.title}</span>
                  <span className="block text-xs text-ink-500">{floatA.text}</span>
                </span>
              </div>
            )}
            {floatB && (
              <div
                className="float glass-strong absolute -right-3 bottom-10 hidden items-center gap-3 !rounded-2xl px-4 py-3 sm:flex lg:-right-6"
                style={{ animationDelay: '-3s' }}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-700 text-white">
                  <floatB.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink-950">{floatB.title}</span>
                  <span className="block text-xs text-ink-500">{floatB.text}</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Category chips */}
        {categories.length > 0 && (
          <nav aria-label="Shop by category" className="mt-8">
            <ul className="flex flex-wrap gap-2.5">
              {categories.slice(0, 9).map((c) => (
                <li key={c.id}>
                  <Link
                    prefetch={false}
                    href={`/categories/${c.path}`}
                    className="glass inline-flex items-center gap-2 !rounded-full px-4 py-2 text-sm text-ink-800 transition hover:-translate-y-0.5 hover:text-brand-700"
                  >
                    <Icon name={c.icon} className="h-4 w-4 text-brand-700" />
                    {c.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/categories"
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-800"
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
            className="glass mt-6 grid grid-cols-1 overflow-hidden !rounded-3xl min-[480px]:grid-cols-2 lg:grid-cols-4"
            aria-label="Why buy from us"
          >
            {trust.map((t) => (
              <li
                key={t.title}
                className="flex items-center gap-3 border-white/80 p-5 [&:not(:last-child)]:border-b min-[480px]:[&:nth-child(odd)]:border-r lg:[&:not(:last-child)]:border-b-0 lg:[&:not(:last-child)]:border-r"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-700/10">
                  <t.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink-950">{t.title}</span>
                  <span className="block text-xs text-ink-500">{t.text}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  )
}
