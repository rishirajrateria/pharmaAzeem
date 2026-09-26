import type { Facets, ProductQuery, ProductSort } from '@/lib/data'

/**
 * URL ⇄ catalogue filter state.
 *
 * All catalogue filtering is expressed in the query string so that every
 * combination is a plain, shareable, crawlable URL (no client state):
 *
 *   /products?form=Tablet&form=Capsule&rx=otc&sort=name-asc&page=2&q=amox
 *
 * Param names are deliberately short and stable – they are part of the public
 * URL contract and are preserved by <SearchBox>, <SortSelect> and <Pagination>.
 */

export type CatalogSearchParams = Record<string, string | string[] | undefined>

/** Facet groups, in sidebar order. `param` is the URL key, `facet` the key in {@link Facets}. */
export const FACET_GROUPS = [
  { param: 'form', facet: 'dosageForm', label: 'Dosage form', queryKey: 'dosageForm' },
  { param: 'rx', facet: 'prescriptionStatus', label: 'Prescription status', queryKey: 'prescriptionStatus' },
  { param: 'route', facet: 'route', label: 'Route of administration', queryKey: 'route' },
  { param: 'badge', facet: 'badges', label: 'Highlights', queryKey: 'badges' },
] as const

export type FacetParam = (typeof FACET_GROUPS)[number]['param']

const VALUE_LABELS: Record<string, string> = {
  rx: 'Prescription only (Rx)',
  otc: 'Over the counter (OTC)',
  new: 'New launch',
  'best-seller': 'Best seller',
  'who-gmp': 'WHO-GMP certified',
  'export-ready': 'Export ready',
  'sugar-free': 'Sugar free',
  pediatric: 'Pediatric',
}

/** Human label for a facet value (select values such as "otc" or "who-gmp" are mapped; free text is returned as-is). */
export const facetValueLabel = (value: string) => VALUE_LABELS[value] || value

export const SORT_OPTIONS: { value: ProductSort; label: string; priced?: boolean }[] = [
  { value: 'featured', label: 'Recommended' },
  { value: 'newest', label: 'Newest first' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
  { value: 'price-asc', label: 'Price: low to high', priced: true },
  { value: 'price-desc', label: 'Price: high to low', priced: true },
]

const SORT_VALUES = new Set<string>(SORT_OPTIONS.map((o) => o.value))

export const DEFAULT_SORT: ProductSort = 'featured'
export const PAGE_SIZE = 24
const MAX_VALUES_PER_GROUP = 12
const MAX_VALUE_LENGTH = 60
const MAX_QUERY_LENGTH = 80
const MAX_PAGE = 999

export type ActiveFilter = { param: FacetParam | 'q'; value: string; label: string; group: string }

export type ParsedFilters = {
  /** Selected values per facet param (sanitised, de-duplicated, ordered as given). */
  values: Record<FacetParam, string[]>
  q: string
  sort: ProductSort
  page: number
  /** True when the visitor asked for the search box to receive focus (`?focus=search`). */
  focusSearch: boolean
  /** Any facet or search text active (pagination and sort do not count). */
  hasFilters: boolean
  /** Flat list of active facet values + search text, for the "active filters" row. */
  active: ActiveFilter[]
  /** Normalised query string (without `page`) – the base every link is derived from. */
  params: URLSearchParams
  /** Ready to spread into `getProducts()` (add `categoryIds` yourself). */
  query: Pick<ProductQuery, 'dosageForm' | 'prescriptionStatus' | 'route' | 'badges' | 'q' | 'sort' | 'page' | 'limit'>
}

const toList = (raw: string | string[] | undefined): string[] => {
  if (!raw) return []
  const arr = Array.isArray(raw) ? raw : [raw]
  const out: string[] = []
  for (const item of arr) {
    for (const piece of String(item).split(',')) {
      const v = piece.trim().slice(0, MAX_VALUE_LENGTH)
      if (v && !out.includes(v)) out.push(v)
      if (out.length >= MAX_VALUES_PER_GROUP) return out
    }
  }
  return out
}

const first = (raw: string | string[] | undefined): string => (Array.isArray(raw) ? raw[0] || '' : raw || '')

/** Turns Next.js `searchParams` into a sanitised, normalised filter state. */
export function parseFilters(searchParams: CatalogSearchParams = {}, opts: { pageSize?: number } = {}): ParsedFilters {
  const values = {} as Record<FacetParam, string[]>
  const params = new URLSearchParams()
  const active: ActiveFilter[] = []

  for (const g of FACET_GROUPS) {
    const list = toList(searchParams[g.param])
    values[g.param] = list
    list.forEach((v) => {
      params.append(g.param, v)
      active.push({ param: g.param, value: v, label: facetValueLabel(v), group: g.label })
    })
  }

  const q = first(searchParams.q).replace(/\s+/g, ' ').trim().slice(0, MAX_QUERY_LENGTH)
  if (q) {
    params.set('q', q)
    active.push({ param: 'q', value: q, label: `“${q}”`, group: 'Search' })
  }

  const rawSort = first(searchParams.sort)
  const sort = (SORT_VALUES.has(rawSort) ? rawSort : DEFAULT_SORT) as ProductSort
  if (sort !== DEFAULT_SORT) params.set('sort', sort)

  const rawPage = Number.parseInt(first(searchParams.page), 10)
  const page = Number.isFinite(rawPage) && rawPage > 1 ? Math.min(rawPage, MAX_PAGE) : 1

  const focusSearch = first(searchParams.focus) === 'search'
  const limit = opts.pageSize ?? PAGE_SIZE

  return {
    values,
    q,
    sort,
    page,
    focusSearch,
    hasFilters: active.length > 0,
    active,
    params,
    query: {
      dosageForm: values.form.length ? values.form : undefined,
      prescriptionStatus: values.rx.length ? values.rx : undefined,
      route: values.route.length ? values.route : undefined,
      badges: values.badge.length ? values.badge : undefined,
      q: q || undefined,
      sort,
      page,
      limit,
    },
  }
}

/* ------------------------------------------------------------------ */
/* Link builders – every one returns a relative href for <Link>        */
/* ------------------------------------------------------------------ */

const toHref = (basePath: string, params: URLSearchParams) => {
  const qs = params.toString()
  return qs ? `${basePath}?${qs}` : basePath
}

/** Href with one facet value toggled on/off (resets to page 1). */
export function toggleHref(basePath: string, filters: ParsedFilters, param: FacetParam, value: string) {
  const next = new URLSearchParams(filters.params)
  const current = next.getAll(param)
  next.delete(param)
  const set = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
  set.forEach((v) => next.append(param, v))
  return toHref(basePath, next)
}

/** Href with a single active filter (or the search text) removed. */
export function removeHref(basePath: string, filters: ParsedFilters, item: ActiveFilter) {
  const next = new URLSearchParams(filters.params)
  if (item.param === 'q') {
    next.delete('q')
  } else {
    const rest = next.getAll(item.param).filter((v) => v !== item.value)
    next.delete(item.param)
    rest.forEach((v) => next.append(item.param, v))
  }
  return toHref(basePath, next)
}

/** Href with every facet and the search text cleared (sort is kept). */
export function clearHref(basePath: string, filters: ParsedFilters) {
  const next = new URLSearchParams()
  if (filters.sort !== DEFAULT_SORT) next.set('sort', filters.sort)
  return toHref(basePath, next)
}

/** Href for a given page number, preserving all filters and sort. */
export function pageHref(basePath: string, filters: ParsedFilters, page: number) {
  const next = new URLSearchParams(filters.params)
  if (page > 1) next.set('page', String(page))
  return toHref(basePath, next)
}

/** Href for a sort option, preserving filters (resets to page 1). */
export function sortHref(basePath: string, filters: ParsedFilters, sort: ProductSort) {
  const next = new URLSearchParams(filters.params)
  next.delete('sort')
  if (sort !== DEFAULT_SORT) next.set('sort', sort)
  return toHref(basePath, next)
}

/**
 * The canonical path search engines should index for this state:
 * filtered / searched views collapse onto the unfiltered listing, while plain
 * pagination keeps a self-referencing canonical (`?page=N`).
 */
export function canonicalPath(basePath: string, filters: ParsedFilters) {
  if (filters.hasFilters) return basePath
  return filters.page > 1 ? `${basePath}?page=${filters.page}` : basePath
}

/** Short, human summary of the active filters – used in <title> and result headings. */
export function describeFilters(filters: ParsedFilters) {
  const parts: string[] = []
  if (filters.q) parts.push(`Search results for “${filters.q}”`)
  const facetLabels = filters.active.filter((a) => a.param !== 'q').map((a) => a.label)
  if (facetLabels.length) parts.push(facetLabels.slice(0, 3).join(' · ') + (facetLabels.length > 3 ? ` +${facetLabels.length - 3}` : ''))
  return parts.join(' – ')
}

/** Number of results visible on this page, e.g. "Showing 25–48 of 312". */
export function resultRange(page: number, limit: number, totalDocs: number) {
  if (!totalDocs) return { from: 0, to: 0 }
  const from = (page - 1) * limit + 1
  const to = Math.min(page * limit, totalDocs)
  return { from, to }
}

/** Facet groups that actually have options in the current scope. */
export function visibleFacetGroups(facets: Facets) {
  return FACET_GROUPS.filter((g) => facets[g.facet].length > 0)
}
