/**
 * Shared catalogue helpers used by both the demo seed (src/seed/run.ts) and the stand-alone
 * product import (scripts/import-products.ts):
 *  – category tree creation (idempotent)
 *  – generic pack illustrations (one shared image per kind of pack)
 *  – product records → Payload documents
 *  – clean-up of the old sample catalogue
 */
import type { Payload } from 'payload'

import { categories as seedCategories, type SeedCategory } from './data/categories'
import { countries as seedCountries } from './data/countries'
import { productsPage } from './data/globals'
import { products as listProducts, type ListProduct } from './data/products'
import { PACK_ALT, PACK_KINDS, packImage, type PackKind } from './images'
import { md } from './lexical'

export const ctx = { disableRevalidate: true }

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/** Sourcing FAQs for categories that have none – editable later in the admin panel. */
export const defaultCategoryFaqs = (title: string) => [
  {
    question: `Can I order ${title.toLowerCase()} products in bulk for export?`,
    answer: `Yes. Products in the ${title} range are available for export in bulk, institutional and private-label packs, subject to registration and import requirements in your country.`,
  },
  {
    question: `Which documents can you provide for ${title.toLowerCase()} registrations?`,
    answer:
      'Tell us the product and destination market in your inquiry and we will confirm which dossier, certificate, Certificate of Analysis and sample documents are available.',
  },
  {
    question: `How do I get a quotation for ${title.toLowerCase()} products?`,
    answer:
      'Add the products you need to your cart and click "Request quote", or send us your product list through the contact form – our export team replies with pricing, minimum order quantities and lead times.',
  },
]

const log = (msg: string) => console.log(`• ${msg}`)

/* ------------------------------------------------------------------ categories */

/**
 * Makes sure every category of the seed tree exists (matching on slug) and returns slug → id.
 * Existing categories are left untouched so edits made in the admin panel survive.
 */
export async function ensureCategories(payload: Payload, topLevelImage?: number) {
  const ids = new Map<string, number>()
  const existing = await payload.find({
    collection: 'categories',
    limit: 0,
    pagination: false,
    depth: 0,
    select: { slug: true, image: true, parent: true },
  })
  let image = topLevelImage
  for (const c of existing.docs as {
    id: number
    slug: string
    image?: number | null
    parent?: unknown
  }[]) {
    ids.set(c.slug, c.id)
    if (!image && !c.parent && typeof c.image === 'number') image = c.image
  }

  let created = 0
  const create = async (c: SeedCategory, parent: number | undefined, order: number) => {
    let id = ids.get(c.slug)
    if (!id) {
      const doc = await payload.create({
        collection: 'categories',
        data: {
          title: c.title,
          slug: c.slug,
          parent,
          icon: c.icon as any,
          shortDescription: c.shortDescription,
          description: md(c.description),
          highlights: c.highlights?.map((text) => ({ text })),
          faqs: c.faqs ?? defaultCategoryFaqs(c.title),
          featured: !parent,
          order,
          image: parent ? undefined : image,
          meta: { title: c.meta.title, description: c.meta.description, keywords: c.meta.keywords },
        },
        context: ctx,
      })
      id = doc.id
      ids.set(c.slug, id)
      created++
    }
    for (const [i, child] of (c.children || []).entries()) await create(child, id, i)
  }
  for (const [i, c] of seedCategories.entries()) await create(c, undefined, i)
  if (created) log(`Created ${created} new categories`)
  return ids
}

/** Old sample categories that no longer hold anything once the real catalogue is in. */
const LEGACY_CATEGORY_SLUGS = [
  'antibiotic-injections',
  'iv-fluids-electrolytes',
  'vitamin-injections',
  'injectables',
  'antipsychotics',
]

export async function pruneEmptyLegacyCategories(payload: Payload) {
  let removed = 0
  for (const slug of LEGACY_CATEGORY_SLUGS) {
    const found = await payload.find({
      collection: 'categories',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    })
    const cat = found.docs[0]
    if (!cat) continue
    const [products, children] = await Promise.all([
      payload.count({ collection: 'products', where: { categories: { in: [cat.id] } } }),
      payload.count({ collection: 'categories', where: { parent: { equals: cat.id } } }),
    ])
    if (products.totalDocs || children.totalDocs) continue
    await payload.delete({ collection: 'categories', id: cat.id, context: ctx })
    removed++
  }
  if (removed) log(`Removed ${removed} empty sample categories`)
}

/* ------------------------------------------------------------------ images */

/** Uploads (once) one generic pack illustration per kind of pack and returns kind → media id. */
export async function ensurePackImages(payload: Payload) {
  const ids = new Map<PackKind, number>()
  for (const kind of PACK_KINDS) {
    const filename = `pack-${kind}.webp`
    const found = await payload.find({
      collection: 'media',
      where: { alt: { equals: PACK_ALT[kind] } },
      limit: 1,
      depth: 0,
    })
    if (found.docs[0]) {
      ids.set(kind, found.docs[0].id)
      continue
    }
    const doc = await payload.create({
      collection: 'media',
      data: { alt: PACK_ALT[kind] },
      filePath: await packImage(filename, kind),
      context: ctx,
    })
    ids.set(kind, doc.id)
  }
  return ids
}

export function packKindFor(p: ListProduct): PackKind {
  const cats = [p.category, p.alsoCategory]
  if (cats.includes('toothpastes-gels')) return 'toothpaste'
  if (cats.includes('mouthwashes-rinses') || cats.includes('antiseptics-hygiene')) {
    return p.form === 'Ointment / Cream / Gel' ? 'cream' : 'mouthwash'
  }
  switch (p.form) {
    case 'Tablet':
      return 'tablet'
    case 'Capsule':
      return 'capsule'
    case 'Oral Suspension / Syrup':
    case 'Oral Solution / Drops':
      return 'syrup'
    case 'Ointment / Cream / Gel':
      return 'cream'
    case 'Sachet / Powder':
      return 'sachet'
    default:
      return 'kit'
  }
}

/* ------------------------------------------------------------------ products */

const trim = (s: string, max: number) => {
  if (s.length <= max) return s
  const cut = s.slice(0, max - 1)
  return `${cut.slice(0, cut.lastIndexOf(' ') > 30 ? cut.lastIndexOf(' ') : cut.length)}…`
}

export function productData(
  p: ListProduct,
  catIds: Map<string, number>,
  imageIds: Map<PackKind, number>,
) {
  const categories = [p.category, p.alsoCategory]
    .filter(Boolean)
    .map((s) => catIds.get(s))
    .filter((x): x is number => typeof x === 'number')
  const unknown = p.generic === 'Composition on request'

  const composition = p.ingredients.map((i) => `- ${i.name}${i.strength ? ` – ${i.strength}` : ''}`)
  const presentation = [
    p.formDetail,
    p.strength && p.strength !== 'Multi-ingredient formula' ? p.strength : '',
    p.packNote,
    p.flavour && `${p.flavour} flavour`,
  ]
    .filter(Boolean)
    .join(' · ')
  const description = [
    `## ${p.title}`,
    p.short,
    composition.length ? `### Composition\n\n${composition.join('\n')}` : '',
    presentation ? `### Presentation\n\n${presentation}` : '',
    p.specialLicence
      ? '### Regulatory note\n\nThis is a controlled or tightly regulated product. Supply is subject to the importing country’s licence and permit requirements.'
      : '',
  ]
    .filter(Boolean)
    .join('\n\n')

  const specs = [
    p.formDetail && { label: 'Presentation', value: p.formDetail },
    p.flavour && { label: 'Flavour', value: p.flavour },
    p.aliases.length && { label: 'Also known as', value: p.aliases.join(', ') },
  ].filter(Boolean) as { label: string; value: string }[]

  const metaTitle = trim(p.brand ? `${p.title} – ${p.generic}` : p.title, 60)
  const keywords = [
    unknown
      ? p.title.toLowerCase()
      : `${p.generic.toLowerCase()} ${p.strength.toLowerCase()}`.trim(),
    unknown ? '' : `${p.generic.toLowerCase()} ${p.form.toLowerCase()} supplier`,
    unknown ? '' : `${p.generic.toLowerCase()} exporter`,
    ...p.aliases.map((a) => a.toLowerCase()),
  ]
    .filter(Boolean)
    .join(', ')

  return {
    title: p.title,
    slug: p.slug,
    genericName: p.generic,
    categories,
    featured: p.featured,
    images: [imageIds.get(packKindFor(p))].filter((x): x is number => typeof x === 'number'),
    shortDescription: trim(p.short, 240),
    dosageForm: p.form as any,
    strength: p.strength || undefined,
    prescriptionStatus: p.rx,
    route: (p.route || undefined) as any,
    packSize: p.packNote || undefined,
    activeIngredients: p.ingredients.map((i) => ({
      name: i.name,
      strength: i.strength || undefined,
    })),
    therapeuticClass: p.therapeuticClass || undefined,
    specifications: specs,
    description: md(description),
    indications: p.indications.length
      ? md(p.indications.map((i) => `- ${i}`).join('\n'))
      : undefined,
    showPrice: 'default' as const,
    sku: p.sku,
    minOrderQuantity: 1,
    availability: 'made-to-order' as const,
    meta: { title: metaTitle, description: trim(p.short, 160), keywords },
    _status: (p.draft ? 'draft' : 'published') as 'draft' | 'published',
  }
}

/** Creates the products that don't exist yet (matched on SKU); with `update` it rewrites existing ones. */
export async function upsertProducts(
  payload: Payload,
  items: ListProduct[],
  catIds: Map<string, number>,
  imageIds: Map<PackKind, number>,
  opts: { update?: boolean; concurrency?: number } = {},
) {
  const existing = await payload.find({
    collection: 'products',
    where: { sku: { like: 'PR-' } },
    limit: 0,
    pagination: false,
    depth: 0,
    select: { sku: true },
  })
  const idBySku = new Map<string, number>()
  for (const d of existing.docs as { id: number; sku?: string | null }[])
    if (d.sku) idBySku.set(d.sku, d.id)

  const stats = { created: 0, updated: 0, skipped: 0, failed: [] as string[] }
  const queue = [...items]
  const worker = async () => {
    for (let p = queue.shift(); p; p = queue.shift()) {
      try {
        const id = idBySku.get(p.sku)
        if (id && !opts.update) {
          stats.skipped++
        } else if (id) {
          await payload.update({
            collection: 'products',
            id,
            data: productData(p, catIds, imageIds),
            draft: p.draft,
            context: ctx,
          })
          stats.updated++
        } else {
          await payload.create({
            collection: 'products',
            data: productData(p, catIds, imageIds),
            draft: p.draft,
            context: ctx,
          })
          stats.created++
        }
        const done = stats.created + stats.updated + stats.skipped
        if (done % 50 === 0) log(`${done}/${items.length} products processed`)
      } catch (err) {
        stats.failed.push(`${p.sku} ${p.title}: ${(err as Error).message}`)
      }
    }
  }
  await Promise.all(Array.from({ length: opts.concurrency ?? 4 }, worker))
  return stats
}

/** True when every product of the list is already in the database and no sample product is left. */
export async function catalogueIsCurrent(payload: Payload) {
  const [current, legacy] = await Promise.all([
    payload.count({ collection: 'products', where: { sku: { like: 'PR-' } } }),
    payload.count({ collection: 'products', where: { sku: { like: 'AZ-' } } }),
  ])
  return current.totalDocs >= listProducts.length && legacy.totalDocs === 0
}

/** Removes the demo products (SKU "AZ-…") and their pack-shot images from the first sample catalogue. */
export async function removeSampleProducts(payload: Payload) {
  const sample = await payload.find({
    collection: 'products',
    where: { sku: { like: 'AZ-' } },
    limit: 0,
    pagination: false,
    depth: 0,
    select: { sku: true },
  })
  const ids = (sample.docs as { id: number; sku?: string | null }[])
    .filter((d) => d.sku?.startsWith('AZ-'))
    .map((d) => d.id)
  for (const id of ids) await payload.delete({ collection: 'products', id, context: ctx })

  const media = await payload.find({
    collection: 'media',
    where: { filename: { like: 'az-' } },
    limit: 0,
    pagination: false,
    depth: 0,
    select: { filename: true },
  })
  const mediaIds = (media.docs as { id: number; filename?: string | null }[])
    .filter((m) => m.filename?.startsWith('az-'))
    .map((m) => m.id)
  for (const id of mediaIds) await payload.delete({ collection: 'media', id, context: ctx })
  if (ids.length || mediaIds.length) {
    log(`Removed ${ids.length} sample products and ${mediaIds.length} sample images`)
  }
  return ids.length
}

/* ------------------------------------------------------------------ countries */

/** All product ids in a category and its descendants. */
export async function productsInTree(payload: Payload) {
  const [products, cats] = await Promise.all([
    payload.find({
      collection: 'products',
      limit: 0,
      pagination: false,
      depth: 0,
      select: { categories: true },
    }),
    payload.find({
      collection: 'categories',
      limit: 0,
      pagination: false,
      depth: 0,
      select: { parent: true },
    }),
  ])
  const byCat = new Map<number, number[]>()
  for (const p of products.docs as { id: number; categories?: number[] }[])
    for (const c of p.categories || []) byCat.set(c, [...(byCat.get(c) || []), p.id])
  const children = new Map<number, number[]>()
  for (const c of cats.docs as { id: number; parent?: number | null }[])
    if (c.parent) children.set(c.parent, [...(children.get(c.parent) || []), c.id])
  const walk = (id: number): number[] => [
    ...(byCat.get(id) || []),
    ...(children.get(id) || []).flatMap(walk),
  ]
  return walk
}

/** Re-points every country's "popular categories / products" at the new catalogue. */
export async function refreshCountries(payload: Payload, catIds: Map<string, number>) {
  const walk = await productsInTree(payload)
  let updated = 0
  for (const c of seedCountries) {
    const found = await payload.find({
      collection: 'countries',
      where: { slug: { equals: slugify(c.name) } },
      limit: 1,
      depth: 0,
    })
    const doc = found.docs[0]
    if (!doc) continue
    const popularCategories = c.categories
      .map((s) => catIds.get(s))
      .filter((x): x is number => typeof x === 'number')
    const popularProducts = [...new Set(popularCategories.flatMap(walk))].slice(0, 6)
    await payload.update({
      collection: 'countries',
      id: doc.id,
      data: { popularCategories, popularProducts },
      context: ctx,
    })
    updated++
  }
  if (updated) log(`Refreshed popular categories/products for ${updated} countries`)
}

/* ------------------------------------------------------------------ page copy */

/** Wording of the first sample catalogue – only replaced while it is still unchanged. */
const LEGACY_PRODUCTS_PAGE = {
  subtitle:
    'WHO-GMP certified generic formulations across ten therapeutic categories. Filter by category, dosage form or prescription status and add products to your inquiry list.',
  intro:
    'Browse our complete range of tablets, capsules, syrups, injectables, creams and nutraceuticals. Every product page includes composition, indications, pack sizes, storage conditions and downloadable documentation. Add the products you need to your inquiry list and request a single quotation for everything.',
  faqs: [
    {
      question: 'Are all listed products available for export?',
      answer:
        'Yes – every product in the catalogue is manufactured in our WHO-GMP facilities and available for export, subject to registration in the destination country.',
    },
    {
      question: 'Can I request a product that is not listed?',
      answer:
        'Our portfolio exceeds 300 formulations, not all of which are online. Tell us what you need and we will confirm availability or evaluate development.',
    },
  ],
  metaDescription:
    'Browse WHO-GMP certified generic medicines: antibiotics, cardiovascular, diabetes, pain, GI, respiratory, dermatology, CNS, vitamins and injectables. Inquire for pricing.',
}

const lexicalText = (node: unknown): string => {
  if (!node || typeof node !== 'object') return ''
  const n = node as { text?: string; children?: unknown[]; root?: unknown }
  if (n.root) return lexicalText(n.root)
  return (n.text ?? '') + (n.children || []).map(lexicalText).join(' ')
}

/** Updates the Products page headline copy (it quoted the old sample catalogue) unless it was edited. */
export async function refreshProductsPageCopy(payload: Payload) {
  const cur: any = await payload.findGlobal({ slug: 'products-page', depth: 0 })
  const data: Record<string, unknown> = {}
  if (cur.hero?.subtitle === LEGACY_PRODUCTS_PAGE.subtitle)
    data.hero = { ...cur.hero, subtitle: productsPage.hero.subtitle }
  if (lexicalText(cur.intro).replace(/\s+/g, ' ').trim() === LEGACY_PRODUCTS_PAGE.intro)
    data.intro = md(productsPage.intro)
  const current = (cur.faqs || []).map((f: { question: string; answer: string }) => [
    f.question,
    f.answer,
  ])
  const legacy = LEGACY_PRODUCTS_PAGE.faqs.map((f) => [f.question, f.answer])
  if (JSON.stringify(current) === JSON.stringify(legacy)) data.faqs = productsPage.faqs
  if (cur.meta?.description === LEGACY_PRODUCTS_PAGE.metaDescription)
    data.meta = {
      ...cur.meta,
      description: productsPage.meta.description,
      keywords: productsPage.meta.keywords,
    }
  if (!Object.keys(data).length) return
  await payload.updateGlobal({ slug: 'products-page', data: data as any, context: ctx })
  log('Updated the Products page text')
}
