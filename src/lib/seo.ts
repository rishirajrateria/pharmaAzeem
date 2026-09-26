import type { Metadata } from 'next'

import type { Category, Country, Media, Product, SiteSetting } from '@/payload-types'

import { getCommerceLabels, resolvePrice } from './commerce'
import { absUrl, mediaUrl, richTextToPlain, SITE_URL, truncate } from './utils'

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

/** The SEO group shared by all collections / globals (see src/fields/seo.ts). */
export type SeoMeta = {
  title?: string | null
  description?: string | null
  image?: number | Media | null
  keywords?: string | null
  canonicalUrl?: string | null
  noIndex?: boolean | null
}

export type BuildMetadataArgs = {
  settings: SiteSetting | null | undefined
  /** Page path starting with "/" – used for canonical + OG url. */
  path: string
  /** Fallback title (used when meta.title is empty). */
  title: string
  /** Fallback description. */
  description?: string | null
  /** Fallback image (Payload media). */
  image?: number | Media | null
  meta?: SeoMeta | null
  type?: 'website' | 'article' | 'product'
  /** Skip the site title template (e.g. for the home page). */
  absoluteTitle?: boolean
  publishedTime?: string | null
  modifiedTime?: string | null
}

/* ------------------------------------------------------------------ */
/* Metadata                                                            */
/* ------------------------------------------------------------------ */

export const siteName = (settings?: SiteSetting | null) =>
  settings?.siteName || 'Azeem Pharmaceuticals'

/** Builds a complete Next.js Metadata object with canonical, OG, Twitter, robots and hreflang. */
export const buildMetadata = ({
  settings,
  path,
  title,
  description,
  image,
  meta,
  type = 'website',
  absoluteTitle,
  publishedTime,
  modifiedTime,
}: BuildMetadataArgs): Metadata => {
  const name = siteName(settings)
  const template = settings?.seo?.titleTemplate || `%s | ${name}`
  const rawTitle = meta?.title || title
  const finalTitle =
    absoluteTitle || rawTitle.includes(name) ? rawTitle : template.replace('%s', rawTitle)
  const finalDescription = truncate(
    meta?.description ||
      description ||
      settings?.seo?.defaultDescription ||
      settings?.shortDescription ||
      '',
    160,
  )
  const canonical = meta?.canonicalUrl || absUrl(path)
  const ogImageRel =
    mediaUrl(meta?.image, 'og') ||
    mediaUrl(meta?.image) ||
    mediaUrl(image, 'og') ||
    mediaUrl(image) ||
    mediaUrl(settings?.seo?.defaultImage, 'og')
  const ogImage = ogImageRel
    ? absUrl(ogImageRel)
    : absUrl(
        `/og?title=${encodeURIComponent(rawTitle)}&subtitle=${encodeURIComponent(truncate(finalDescription, 140))}`,
      )
  const keywords = meta?.keywords
    ? meta.keywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean)
    : undefined
  const noIndex = Boolean(meta?.noIndex)

  return {
    title: { absolute: finalTitle },
    description: finalDescription,
    keywords,
    alternates: {
      canonical,
      languages: { 'x-default': canonical, en: canonical },
    },
    openGraph: {
      type: type === 'product' ? 'website' : type,
      siteName: name,
      title: finalTitle,
      description: finalDescription,
      url: canonical,
      locale: 'en_US',
      images: [{ url: ogImage, width: 1200, height: 630, alt: rawTitle }],
      ...(type === 'article' && {
        publishedTime: publishedTime ?? undefined,
        modifiedTime: modifiedTime ?? undefined,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDescription,
      images: [ogImage],
      ...(settings?.seo?.twitterHandle && {
        site: settings.seo.twitterHandle,
        creator: settings.seo.twitterHandle,
      }),
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
    other: modifiedTime ? { 'last-modified': modifiedTime } : undefined,
  }
}

/* ------------------------------------------------------------------ */
/* JSON-LD builders (schema.org)                                       */
/* ------------------------------------------------------------------ */

export type JsonLdObject = Record<string, unknown>

export const ORG_ID = `${SITE_URL}/#organization`
export const WEBSITE_ID = `${SITE_URL}/#website`

export const organizationJsonLd = (
  settings: SiteSetting | null | undefined,
  extras: { countries?: Country[]; certifications?: { title: string; issuer: string }[] } = {},
): JsonLdObject => {
  const name = siteName(settings)
  const logo = mediaUrl(settings?.logo)
  const addr = settings?.contact?.address
  const socials = (settings?.contact?.socials || []).map((s) => s.url)
  const sameAs = [
    ...new Set([...socials, ...(settings?.seo?.sameAs || []).map((s) => s.url)].filter(Boolean)),
  ]
  return {
    '@type': ['Organization', 'MedicalOrganization'],
    '@id': ORG_ID,
    name,
    legalName: settings?.legalName || undefined,
    url: SITE_URL,
    logo: logo ? { '@type': 'ImageObject', url: absUrl(logo) } : undefined,
    description: settings?.shortDescription || settings?.seo?.defaultDescription || undefined,
    foundingDate: settings?.foundingYear ? String(settings.foundingYear) : undefined,
    numberOfEmployees: settings?.employeeCount
      ? { '@type': 'QuantitativeValue', value: settings.employeeCount }
      : undefined,
    email: settings?.contact?.email || undefined,
    telephone: settings?.contact?.phone || undefined,
    address: addr?.city
      ? {
          '@type': 'PostalAddress',
          streetAddress: addr.street || undefined,
          addressLocality: addr.city,
          addressRegion: addr.state || undefined,
          postalCode: addr.postalCode || undefined,
          addressCountry: addr.country || undefined,
        }
      : undefined,
    contactPoint: settings?.contact?.email
      ? [
          {
            '@type': 'ContactPoint',
            contactType: 'sales',
            email: settings.contact.email,
            telephone: settings.contact.phone || undefined,
            availableLanguage: ['English'],
            areaServed: 'Worldwide',
          },
        ]
      : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    knowsAbout: settings?.seo?.knowsAbout?.length
      ? settings.seo.knowsAbout.map((k) => k.topic)
      : undefined,
    areaServed: extras.countries?.length
      ? extras.countries.map((c) => ({ '@type': 'Country', name: c.name }))
      : 'Worldwide',
    hasCredential: extras.certifications?.length
      ? extras.certifications.map((c) => ({
          '@type': 'EducationalOccupationalCredential',
          name: c.title,
          recognizedBy: { '@type': 'Organization', name: c.issuer },
        }))
      : undefined,
  }
}

export const websiteJsonLd = (settings: SiteSetting | null | undefined): JsonLdObject => ({
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: SITE_URL,
  name: siteName(settings),
  description: settings?.seo?.defaultDescription || settings?.shortDescription || undefined,
  publisher: { '@id': ORG_ID },
  inLanguage: 'en',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/products?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
})

export type Crumb = { name: string; path: string }

export const breadcrumbJsonLd = (crumbs: Crumb[]): JsonLdObject => ({
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: absUrl(c.path),
  })),
})

export const webPageJsonLd = (args: {
  path: string
  name: string
  description?: string | null
  type?:
    | 'WebPage'
    | 'AboutPage'
    | 'ContactPage'
    | 'CollectionPage'
    | 'ItemPage'
    | 'FAQPage'
    | 'MedicalWebPage'
  image?: string
  dateModified?: string | null
  datePublished?: string | null
}): JsonLdObject => ({
  '@type': args.type || 'WebPage',
  '@id': `${absUrl(args.path)}#webpage`,
  url: absUrl(args.path),
  name: args.name,
  description: args.description || undefined,
  isPartOf: { '@id': WEBSITE_ID },
  about: { '@id': ORG_ID },
  inLanguage: 'en',
  primaryImageOfPage: args.image ? { '@type': 'ImageObject', url: absUrl(args.image) } : undefined,
  dateModified: args.dateModified || undefined,
  datePublished: args.datePublished || undefined,
})

export const faqJsonLd = (
  faqs: { question: string; answer: string }[] | null | undefined,
): JsonLdObject | null => {
  if (!faqs?.length) return null
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
}

/** schema.org Product + Drug for a pharmaceutical product page. */
export const productJsonLd = (
  product: Product,
  settings: SiteSetting | null | undefined,
): JsonLdObject => {
  const labels = getCommerceLabels(settings)
  const price = resolvePrice(product, labels)
  const images = (product.images || [])
    .map((m) => mediaUrl(m, 'large') || mediaUrl(m))
    .filter(Boolean)
    .map((u) => absUrl(u as string))
  const category = product.categories
    ?.map((c) => (typeof c === 'object' ? c.title : null))
    .filter(Boolean)
    .join(' > ')
  const description =
    product.shortDescription || truncate(richTextToPlain(product.description), 300)
  const availabilityMap: Record<string, string> = {
    'in-stock': 'https://schema.org/InStock',
    'made-to-order': 'https://schema.org/MadeToOrder',
    'pre-order': 'https://schema.org/PreOrder',
    discontinued: 'https://schema.org/Discontinued',
  }
  return {
    '@type': ['Product', 'Drug'],
    '@id': `${absUrl(`/products/${product.slug}`)}#product`,
    name: product.title,
    alternateName: product.genericName !== product.title ? product.genericName : undefined,
    nonProprietaryName: product.genericName,
    description,
    image: images.length ? images : undefined,
    url: absUrl(`/products/${product.slug}`),
    sku: product.sku || undefined,
    category: category || undefined,
    brand: { '@type': 'Brand', name: siteName(settings) },
    manufacturer: { '@id': ORG_ID },
    dosageForm: product.dosageForm || undefined,
    administrationRoute: product.route || undefined,
    drugClass: product.therapeuticClass || undefined,
    prescriptionStatus:
      product.prescriptionStatus === 'otc'
        ? 'https://schema.org/OTC'
        : 'https://schema.org/PrescriptionOnly',
    activeIngredient: product.activeIngredients?.length
      ? product.activeIngredients
          .map((a) => (a.strength ? `${a.name} ${a.strength}` : a.name))
          .join(', ')
      : product.genericName,
    additionalProperty: [
      product.strength && { '@type': 'PropertyValue', name: 'Strength', value: product.strength },
      product.packSize && { '@type': 'PropertyValue', name: 'Pack size', value: product.packSize },
      product.packaging && {
        '@type': 'PropertyValue',
        name: 'Packaging',
        value: product.packaging,
      },
      product.shelfLife && {
        '@type': 'PropertyValue',
        name: 'Shelf life',
        value: product.shelfLife,
      },
      product.storage && { '@type': 'PropertyValue', name: 'Storage', value: product.storage },
      ...(product.specifications || []).map((s) => ({
        '@type': 'PropertyValue',
        name: s.label,
        value: s.value,
      })),
    ].filter(Boolean),
    // Offers are only emitted when a real price is shown; Google requires price + currency on Offer.
    offers:
      price.kind === 'price'
        ? {
            '@type': 'Offer',
            url: absUrl(`/products/${product.slug}`),
            priceCurrency: price.currency,
            price: price.amount,
            availability: availabilityMap[product.availability || 'in-stock'],
            seller: { '@id': ORG_ID },
            businessFunction: 'http://purl.org/goodrelations/v1#Sell',
            eligibleQuantity: product.minOrderQuantity
              ? { '@type': 'QuantitativeValue', minValue: product.minOrderQuantity }
              : undefined,
          }
        : undefined,
  }
}

export const itemListJsonLd = (
  items: { name: string; path: string; image?: string }[],
  name?: string,
): JsonLdObject => ({
  '@type': 'ItemList',
  name: name || undefined,
  numberOfItems: items.length,
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    url: absUrl(it.path),
    image: it.image ? absUrl(it.image) : undefined,
  })),
})

export const categoryJsonLd = (category: Category, products: Product[]): JsonLdObject[] => [
  webPageJsonLd({
    path: `/categories/${category.path}`,
    name: category.title,
    description: category.shortDescription || truncate(richTextToPlain(category.description), 300),
    type: 'CollectionPage',
    image: mediaUrl(category.image, 'large'),
    dateModified: category.updatedAt,
  }),
  itemListJsonLd(
    products.map((p) => ({
      name: p.title,
      path: `/products/${p.slug}`,
      image: mediaUrl(p.images?.[0], 'card'),
    })),
    `${category.title} products`,
  ),
]

/** A country landing page → Service offered to that area. */
export const countryServiceJsonLd = (
  country: Country,
  settings: SiteSetting | null | undefined,
): JsonLdObject => ({
  '@type': 'Service',
  '@id': `${absUrl(`/global-presence/${country.slug}`)}#service`,
  name: `Pharmaceutical supply & export to ${country.name}`,
  serviceType: 'Pharmaceutical manufacturing and export',
  provider: { '@id': ORG_ID },
  areaServed: { '@type': 'Country', name: country.name, identifier: country.isoCode },
  description:
    country.summary ||
    `${siteName(settings)} supplies WHO-GMP certified medicines to healthcare partners in ${country.name}.`,
  url: absUrl(`/global-presence/${country.slug}`),
})

/** Wraps builders in a single @graph document. */
export const graph = (...nodes: (JsonLdObject | null | undefined | false)[]) => ({
  '@context': 'https://schema.org',
  '@graph': nodes.filter(Boolean),
})
