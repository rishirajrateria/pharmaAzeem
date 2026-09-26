import type { MetadataRoute } from 'next'

import { categoryPath, countryPath, getAllProductsFull, productPath } from '@/components/seo/llms'
import { getAllCategories, getCountries, getHomepage, getPageGlobal } from '@/lib/data'
import { absUrl, mediaUrl, relId } from '@/lib/utils'

/**
 * /sitemap.xml – every indexable URL with accurate lastModified dates, hreflang
 * alternates (x-default + en) and image entries for products. Documents flagged
 * "noIndex" or canonicalised elsewhere are left out. Revalidated by Payload hooks.
 */
export const revalidate = 3600

type Entry = MetadataRoute.Sitemap[number]
type Freq = NonNullable<Entry['changeFrequency']>

const latest = (...dates: (string | null | undefined)[]) => {
  const ts = dates.filter((d): d is string => Boolean(d)).map((d) => new Date(d).getTime()).filter((t) => !Number.isNaN(t))
  return ts.length ? new Date(Math.max(...ts)) : undefined
}

const entry = (path: string, opts: { lastModified?: Date; changeFrequency?: Freq; priority?: number; images?: string[] } = {}): Entry => {
  const url = absUrl(path)
  return {
    url,
    lastModified: opts.lastModified,
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
    alternates: { languages: { 'x-default': url, en: url } },
    images: opts.images?.length ? opts.images : undefined,
  }
}

/** True when the document should appear in the sitemap (indexable and canonical to itself). */
const indexable = (doc: { meta?: { noIndex?: boolean | null; canonicalUrl?: string | null } | null }, path: string) => {
  if (doc.meta?.noIndex) return false
  const canonical = doc.meta?.canonicalUrl?.trim()
  return !canonical || canonical.replace(/\/$/, '') === absUrl(path)
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products, countries, home, productsPage, about, quality, manufacturing, global, licenses, contact, inquiry] = await Promise.all([
    getAllCategories(),
    getAllProductsFull(),
    getCountries({ served: true }),
    getHomepage(),
    getPageGlobal('products-page'),
    getPageGlobal('about-page'),
    getPageGlobal('quality-page'),
    getPageGlobal('manufacturing-page'),
    getPageGlobal('global-presence-page'),
    getPageGlobal('licenses-page'),
    getPageGlobal('contact-page'),
    getPageGlobal('inquiry-page'),
  ])

  const productDates = products.map((p) => p.updatedAt)
  const categoryDates = categories.map((c) => c.updatedAt)
  const countryDates = countries.map((c) => c.updatedAt)

  const staticPages: Entry[] = [
    entry('/', { lastModified: latest(home.updatedAt, ...productDates), changeFrequency: 'daily', priority: 1 }),
    entry('/products', { lastModified: latest(productsPage.updatedAt, ...productDates), changeFrequency: 'daily', priority: 0.9 }),
    entry('/categories', { lastModified: latest(...categoryDates), changeFrequency: 'weekly', priority: 0.8 }),
    entry('/about', { lastModified: latest(about.updatedAt), changeFrequency: 'monthly', priority: 0.7 }),
    entry('/manufacturing', { lastModified: latest(manufacturing.updatedAt), changeFrequency: 'monthly', priority: 0.7 }),
    entry('/quality', { lastModified: latest(quality.updatedAt), changeFrequency: 'monthly', priority: 0.7 }),
    entry('/global-presence', { lastModified: latest(global.updatedAt, ...countryDates), changeFrequency: 'weekly', priority: 0.7 }),
    entry('/licenses', { lastModified: latest(licenses.updatedAt), changeFrequency: 'monthly', priority: 0.6 }),
    entry('/contact', { lastModified: latest(contact.updatedAt), changeFrequency: 'monthly', priority: 0.6 }),
    entry('/inquiry', { lastModified: latest(inquiry.updatedAt), changeFrequency: 'monthly', priority: 0.5 }),
  ].filter((e, i) => {
    // Respect noIndex on the page globals (index i maps to the same order as above).
    const docs = [home, productsPage, null, about, manufacturing, quality, global, licenses, contact, inquiry]
    return !docs[i]?.meta?.noIndex
  })

  const categoryEntries: Entry[] = categories
    .filter((c) => c.path && indexable(c, categoryPath(c)))
    .map((c) =>
      entry(categoryPath(c), {
        lastModified: latest(c.updatedAt),
        changeFrequency: 'weekly',
        priority: relId(c.parent) ? 0.7 : 0.8,
      }),
    )

  const productEntries: Entry[] = products
    .filter((p) => indexable(p, productPath(p)))
    .map((p) =>
      entry(productPath(p), {
        lastModified: latest(p.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.7,
        images: (p.images || [])
          .map((m) => mediaUrl(m, 'large') || mediaUrl(m))
          .filter((u): u is string => Boolean(u))
          .map((u) => absUrl(u)),
      }),
    )

  const countryEntries: Entry[] = countries
    .filter((c) => indexable(c, countryPath(c)))
    .map((c) => entry(countryPath(c), { lastModified: latest(c.updatedAt), changeFrequency: 'monthly', priority: 0.6 }))

  return [...staticPages, ...categoryEntries, ...productEntries, ...countryEntries]
}
