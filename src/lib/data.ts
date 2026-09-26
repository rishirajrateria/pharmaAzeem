import { cache } from 'react'

import type { Category, Certification, Country, Facility, Product, SiteSetting } from '@/payload-types'

import { getPayloadClient } from './payload'
import { relId } from './utils'

/**
 * Data-access layer. All functions are wrapped in React `cache` so a request that
 * needs the same data in the layout, page and metadata only hits the database once.
 * Pages are statically generated (ISR) and revalidated on demand by Payload hooks.
 */

/* ---------------- Globals ---------------- */

export const getSiteSettings = cache(async (): Promise<SiteSetting> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 1 })
})

export const getHomepage = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'homepage', depth: 2 })
})

type PageGlobalSlug =
  | 'products-page'
  | 'about-page'
  | 'quality-page'
  | 'manufacturing-page'
  | 'global-presence-page'
  | 'licenses-page'
  | 'contact-page'
  | 'inquiry-page'

export const getPageGlobal = cache(async <T extends PageGlobalSlug>(slug: T) => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug, depth: 2 })
})

/* ---------------- Categories ---------------- */

export type CategoryNode = Category & { children: CategoryNode[]; productCount: number }

const sortCats = (a: Category, b: Category) => (a.order ?? 0) - (b.order ?? 0) || a.title.localeCompare(b.title)

export const getAllCategories = cache(async (): Promise<Category[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'categories', limit: 500, depth: 1, pagination: false, sort: 'order' })
  return docs.sort(sortCats)
})

/** Full category tree with product counts (products in a sub-category count towards its parents). */
export const getCategoryTree = cache(async (): Promise<CategoryNode[]> => {
  const [cats, counts] = await Promise.all([getAllCategories(), getProductCountsByCategory()])
  const byId = new Map<number, CategoryNode>()
  cats.forEach((c) => byId.set(c.id, { ...c, children: [], productCount: counts.get(c.id) ?? 0 }))
  const roots: CategoryNode[] = []
  byId.forEach((node) => {
    const pid = relId(node.parent)
    if (pid && byId.has(pid)) byId.get(pid)!.children.push(node)
    else roots.push(node)
  })
  const rollup = (n: CategoryNode): number => {
    n.children.sort(sortCats)
    n.productCount += n.children.reduce((sum, c) => sum + rollup(c), 0)
    return n.productCount
  }
  roots.sort(sortCats).forEach(rollup)
  return roots
})

export const getCategoryByPath = cache(async (path: string): Promise<Category | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'categories', where: { path: { equals: path } }, limit: 1, depth: 1 })
  return docs[0] ?? null
})

export const getCategoryBySlug = cache(async (slug: string): Promise<Category | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'categories', where: { slug: { equals: slug } }, limit: 1, depth: 1 })
  return docs[0] ?? null
})

/** Ids of a category and all its descendants. */
export const getCategoryDescendantIds = cache(async (categoryId: number): Promise<number[]> => {
  const cats = await getAllCategories()
  const ids = [categoryId]
  let frontier = [categoryId]
  while (frontier.length) {
    const next = cats.filter((c) => frontier.includes(relId(c.parent) ?? -1)).map((c) => c.id)
    ids.push(...next)
    frontier = next
  }
  return ids
})

/** Ancestors from root → the category itself (for breadcrumbs). */
export const getCategoryAncestors = cache(async (category: Category): Promise<Category[]> => {
  const cats = await getAllCategories()
  const byId = new Map(cats.map((c) => [c.id, c]))
  const chain: Category[] = [category]
  let cur = category
  let guard = 0
  while (relId(cur.parent) && guard++ < 10) {
    const p = byId.get(relId(cur.parent)!)
    if (!p) break
    chain.unshift(p)
    cur = p
  }
  return chain
})

/** Direct children of a category. */
export const getChildCategories = cache(async (categoryId: number | null): Promise<Category[]> => {
  const cats = await getAllCategories()
  return cats.filter((c) => (categoryId === null ? !relId(c.parent) : relId(c.parent) === categoryId))
})

/* ---------------- Products ---------------- */

export type ProductSort = 'featured' | 'newest' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc'

export type ProductQuery = {
  categoryIds?: number[]
  dosageForm?: string[]
  prescriptionStatus?: string[]
  route?: string[]
  badges?: string[]
  q?: string
  sort?: ProductSort
  page?: number
  limit?: number
  featured?: boolean
}

const sortMap: Record<ProductSort, string> = {
  featured: '-featured,-updatedAt',
  newest: '-createdAt',
  'name-asc': 'title',
  'name-desc': '-title',
  'price-asc': 'price',
  'price-desc': '-price',
}

export const getProducts = cache(async (query: ProductQuery = {}) => {
  const payload = await getPayloadClient()
  const and: any[] = [{ _status: { equals: 'published' } }]
  if (query.categoryIds?.length) and.push({ categories: { in: query.categoryIds } })
  if (query.dosageForm?.length) and.push({ dosageForm: { in: query.dosageForm } })
  if (query.prescriptionStatus?.length) and.push({ prescriptionStatus: { in: query.prescriptionStatus } })
  if (query.route?.length) and.push({ route: { in: query.route } })
  if (query.badges?.length) and.push({ badges: { in: query.badges } })
  if (query.featured) and.push({ featured: { equals: true } })
  if (query.q?.trim()) {
    const q = query.q.trim()
    and.push({
      or: [
        { title: { like: q } },
        { genericName: { like: q } },
        { shortDescription: { like: q } },
        { therapeuticClass: { like: q } },
        { sku: { like: q } },
        { 'meta.keywords': { like: q } },
      ],
    })
  }
  return payload.find({
    collection: 'products',
    where: { and },
    sort: sortMap[query.sort || 'featured'],
    page: query.page || 1,
    limit: query.limit || 24,
    depth: 1,
  })
})

export const getProductBySlug = cache(async (slug: string, opts: { draft?: boolean } = {}): Promise<Product | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug }, ...(opts.draft ? {} : { _status: { equals: 'published' } }) },
    limit: 1,
    depth: 2,
    draft: opts.draft,
  })
  return docs[0] ?? null
})

export const getFeaturedProducts = cache(async (limit = 8): Promise<Product[]> => {
  const { docs } = await getProducts({ featured: true, limit, sort: 'featured' })
  if (docs.length >= Math.min(limit, 4)) return docs
  const { docs: more } = await getProducts({ limit, sort: 'newest' })
  const seen = new Set(docs.map((d) => d.id))
  return [...docs, ...more.filter((d) => !seen.has(d.id))].slice(0, limit)
})

/** Related products: hand-picked first, then same category, then anything else. */
export const getRelatedProducts = cache(async (product: Product, limit = 8): Promise<Product[]> => {
  const picked = (product.relatedProducts || []).filter((p): p is Product => typeof p === 'object' && p !== null && (p as Product)._status === 'published')
  const result: Product[] = [...picked]
  const seen = new Set([product.id, ...picked.map((p) => p.id)])
  if (result.length < limit) {
    const catIds = (product.categories || []).map(relId).filter((x): x is number => typeof x === 'number')
    if (catIds.length) {
      const { docs } = await getProducts({ categoryIds: catIds, limit: limit + 4, sort: 'featured' })
      for (const d of docs) {
        if (result.length >= limit) break
        if (!seen.has(d.id)) {
          result.push(d)
          seen.add(d.id)
        }
      }
    }
  }
  if (result.length < limit) {
    const { docs } = await getProducts({ limit: limit + 4, sort: 'newest' })
    for (const d of docs) {
      if (result.length >= limit) break
      if (!seen.has(d.id)) {
        result.push(d)
        seen.add(d.id)
      }
    }
  }
  return result.slice(0, limit)
})

/** Slim list of every published product (for sitemaps, llms.txt, static params). */
export const getAllProductsSlim = cache(async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    where: { _status: { equals: 'published' } },
    limit: 2000,
    pagination: false,
    depth: 0,
    select: {
      title: true,
      slug: true,
      genericName: true,
      shortDescription: true,
      categories: true,
      dosageForm: true,
      strength: true,
      prescriptionStatus: true,
      route: true,
      badges: true,
      updatedAt: true,
      images: true,
      therapeuticClass: true,
      packSize: true,
    },
  })
  return docs
})

/** Product counts per category id (direct assignments only – tree roll-up happens in getCategoryTree). */
export const getProductCountsByCategory = cache(async (): Promise<Map<number, number>> => {
  const docs = await getAllProductsSlim()
  const counts = new Map<number, number>()
  docs.forEach((p) => {
    ;(p.categories || []).forEach((c) => {
      const id = relId(c)
      if (id) counts.set(id, (counts.get(id) ?? 0) + 1)
    })
  })
  return counts
})

export type Facets = {
  dosageForm: { value: string; count: number }[]
  prescriptionStatus: { value: string; count: number }[]
  route: { value: string; count: number }[]
  badges: { value: string; count: number }[]
}

/** Filter facets (with counts) for a category scope. */
export const getProductFacets = cache(async (categoryIds?: number[]): Promise<Facets> => {
  const docs = await getAllProductsSlim()
  const scope = categoryIds?.length ? docs.filter((p) => (p.categories || []).some((c) => categoryIds.includes(relId(c) ?? -1))) : docs
  const count = (pick: (p: (typeof docs)[number]) => (string | null | undefined)[] | string | null | undefined) => {
    const m = new Map<string, number>()
    scope.forEach((p) => {
      const v = pick(p)
      const arr = Array.isArray(v) ? v : [v]
      arr.forEach((x) => x && m.set(x, (m.get(x) ?? 0) + 1))
    })
    return [...m.entries()].map(([value, c]) => ({ value, count: c })).sort((a, b) => b.count - a.count || a.value.localeCompare(b.value))
  }
  return {
    dosageForm: count((p) => p.dosageForm),
    prescriptionStatus: count((p) => p.prescriptionStatus),
    route: count((p) => p.route),
    badges: count((p) => p.badges),
  }
})

/* ---------------- Countries / Certifications / Facilities ---------------- */

export const getCountries = cache(async (opts: { served?: boolean; featured?: boolean } = {}): Promise<Country[]> => {
  const payload = await getPayloadClient()
  const where: any = { and: [] }
  if (opts.served !== undefined) where.and.push({ served: { equals: opts.served } })
  if (opts.featured !== undefined) where.and.push({ featured: { equals: opts.featured } })
  const { docs } = await payload.find({ collection: 'countries', where, limit: 300, pagination: false, sort: 'name', depth: 1 })
  return docs
})

export const getCountryBySlug = cache(async (slug: string): Promise<Country | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'countries', where: { slug: { equals: slug } }, limit: 1, depth: 2 })
  return docs[0] ?? null
})

export const getCertifications = cache(async (opts: { featured?: boolean } = {}): Promise<Certification[]> => {
  const payload = await getPayloadClient()
  const where: any = opts.featured !== undefined ? { featured: { equals: opts.featured } } : {}
  const { docs } = await payload.find({ collection: 'certifications', where, limit: 200, pagination: false, sort: 'order', depth: 1 })
  return docs
})

export const getFacilities = cache(async (): Promise<Facility[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'facilities', limit: 100, pagination: false, sort: 'order', depth: 2 })
  return docs
})

/** Everything the header/footer need, fetched once per request. */
export const getLayoutData = cache(async () => {
  const [settings, tree] = await Promise.all([getSiteSettings(), getCategoryTree()])
  return { settings, tree }
})
