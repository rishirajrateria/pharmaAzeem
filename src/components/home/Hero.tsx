import {
  ArrowRight,
  ChevronRight,
  FileCheck2,
  Globe,
  PackageCheck,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import Link from 'next/link'

import type { CategoryNode } from '@/lib/data'
import type { Certification, Homepage } from '@/payload-types'

import { Media } from '../Media'
import { Button, Container, Eyebrow } from '../ui'
import { Icon } from '../ui/Icon'
import { Highlight } from './Highlight'

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
 * Store-front hero: a "shop by category" menu on the left, the promo banner on the right and a
 * trust strip underneath. Server component. The banner image is the page's LCP candidate.
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
      text: `Across ${categories.length} therapeutic categories`,
    },
    countries && {
      icon: Globe,
      title: `${countries} countries`,
      text: 'Export shipping by sea & air',
    },
    { icon: FileCheck2, title: 'Dossier support', text: 'CoA, CoPP & registration files' },
  ].filter(Boolean) as { icon: LucideIcon; title: string; text: string }[]

  return (
    <section className="border-b border-white/60" aria-labelledby="hero-title">
      <Container className="py-6 lg:py-8">
        <div className="grid gap-6 lg:grid-cols-12">
          {categories.length > 0 && (
            <nav
              className="glass hidden lg:col-span-3 lg:flex lg:flex-col"
              aria-label="Shop by category"
            >
              <p className="border-b border-white/80 bg-white/50 px-4 py-3 text-sm font-semibold text-ink-950">
                Shop by category
              </p>
              <ul className="flex-1">
                {categories.slice(0, 10).map((c) => (
                  <li key={c.id} className="border-b border-ink-100 last:border-b-0">
                    <Link
                      prefetch={false}
                      href={`/categories/${c.path}`}
                      className="group flex items-center gap-3 px-4 py-2.5 text-sm text-ink-800 transition-colors hover:bg-surface-2 hover:text-brand-700"
                    >
                      <Icon name={c.icon} className="h-4 w-4 shrink-0 text-brand-700" />
                      <span className="flex-1 truncate">{c.title}</span>
                      <ChevronRight
                        className="h-3.5 w-3.5 text-ink-300 group-hover:text-brand-700"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/categories"
                className="flex items-center justify-between border-t border-ink-200 px-4 py-3 text-sm font-semibold text-brand-700 hover:bg-surface-2"
              >
                All categories <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </nav>
          )}

          <div
            className={
              categories.length > 0
                ? 'glass grid md:grid-cols-[3fr_2fr] lg:col-span-9'
                : 'glass grid md:grid-cols-[3fr_2fr] lg:col-span-12'
            }
          >
            <div className="flex flex-col justify-center p-6 sm:p-10">
              {hero.eyebrow && <Eyebrow>{hero.eyebrow}</Eyebrow>}
              <h1
                id="hero-title"
                className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-ink-950 xl:text-[2.5rem]"
              >
                <Highlight text={hero.title} highlight={hero.highlight} />
              </h1>
              {hero.subtitle && <p className="mt-4 text-base text-ink-600">{hero.subtitle}</p>}
              <div className="mt-7 flex flex-wrap gap-3">
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
            <div className="relative min-h-60 border-t border-white/80 md:min-h-full md:border-l md:border-t-0">
              <Media
                media={hero.image}
                size="large"
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 37vw"
                className="absolute inset-0 h-full w-full"
                imgClassName="object-cover"
              />
            </div>
          </div>
        </div>

        {trust.length > 0 && (
          <ul
            className="glass mt-6 grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4"
            aria-label="Why buy from us"
          >
            {trust.map((t) => (
              <li
                key={t.title}
                className="flex items-center gap-3 border-white/80 p-4 [&:not(:last-child)]:border-b min-[480px]:[&:nth-child(odd)]:border-r lg:[&:not(:last-child)]:border-b-0 lg:[&:not(:last-child)]:border-r"
              >
                <t.icon className="h-7 w-7 shrink-0 text-brand-700" aria-hidden="true" />
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
