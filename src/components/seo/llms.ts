import type {
  AboutPage,
  Category,
  Certification,
  ContactPage,
  Country,
  Facility,
  GlobalPresencePage,
  Homepage,
  InquiryPage,
  LicensesPage,
  ManufacturingPage,
  Product,
  ProductsPage,
  QualityPage,
  SiteSetting,
} from '@/payload-types'
import { getCommerceLabels, resolvePrice } from '@/lib/commerce'
import {
  type CategoryNode,
  getAllCategories,
  getCategoryTree,
  getCertifications,
  getCountries,
  getFacilities,
  getHomepage,
  getPageGlobal,
  getProducts,
  getSiteSettings,
} from '@/lib/data'
import { siteName } from '@/lib/seo'
import { absUrl, formatDate, relId, richTextToPlain, SITE_URL, truncate } from '@/lib/utils'

/**
 * Markdown builders for the machine-readable endpoints:
 *   /llms.txt       – the llms.txt index (https://llmstxt.org)
 *   /llms-full.txt  – the complete site content in Markdown
 * Both are static (ISR) and revalidated by Payload hooks whenever content changes.
 * The sitemap reuses `getAllProductsFull` so product image URLs are populated.
 */

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

export type LlmsData = {
  settings: SiteSetting
  tree: CategoryNode[]
  categories: Category[]
  products: Product[]
  countries: Country[]
  certifications: Certification[]
  facilities: Facility[]
  pages: {
    home: Homepage
    products: ProductsPage
    about: AboutPage
    quality: QualityPage
    manufacturing: ManufacturingPage
    global: GlobalPresencePage
    licenses: LicensesPage
    contact: ContactPage
    inquiry: InquiryPage
  }
}

/** Every published product with relationships populated (depth 1), paged so large catalogues stay safe. */
export const getAllProductsFull = async (): Promise<Product[]> => {
  const all: Product[] = []
  let page = 1
  let hasNext = true
  while (hasNext && page <= 20) {
    const res = await getProducts({ page, limit: 500, sort: 'name-asc' })
    all.push(...res.docs)
    hasNext = Boolean(res.hasNextPage)
    page += 1
  }
  return all
}

export const loadLlmsData = async (): Promise<LlmsData> => {
  const [
    settings,
    tree,
    categories,
    products,
    countries,
    certifications,
    facilities,
    home,
    productsPage,
    about,
    quality,
    manufacturing,
    global,
    licenses,
    contact,
    inquiry,
  ] = await Promise.all([
    getSiteSettings(),
    getCategoryTree(),
    getAllCategories(),
    getAllProductsFull(),
    getCountries({ served: true }),
    getCertifications(),
    getFacilities(),
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
  return {
    settings,
    tree,
    categories: categories.filter((c) => !c.meta?.noIndex),
    products: products.filter((p) => !p.meta?.noIndex),
    countries: countries.filter((c) => !c.meta?.noIndex),
    certifications,
    facilities,
    pages: {
      home,
      products: productsPage,
      about,
      quality,
      manufacturing,
      global,
      licenses,
      contact,
      inquiry,
    },
  }
}

/* ------------------------------------------------------------------ */
/* Labels & paths                                                      */
/* ------------------------------------------------------------------ */

const RX_LABEL: Record<string, string> = {
  rx: 'Prescription only (Rx)',
  otc: 'Over the counter (OTC)',
}
const AVAILABILITY_LABEL: Record<string, string> = {
  'in-stock': 'In stock',
  'made-to-order': 'Made to order',
  'pre-order': 'Pre-order',
  discontinued: 'Discontinued',
}
const BADGE_LABEL: Record<string, string> = {
  new: 'New',
  'best-seller': 'Best seller',
  'who-gmp': 'WHO-GMP',
  'export-ready': 'Export ready',
  'sugar-free': 'Sugar free',
  pediatric: 'Pediatric',
}
const REGION_LABEL: Record<string, string> = {
  africa: 'Africa',
  'middle-east': 'Middle East',
  'south-asia': 'South Asia',
  'south-east-asia': 'South-East Asia',
  'east-asia-pacific': 'East Asia & Pacific',
  cis: 'CIS',
  europe: 'Europe',
  'latin-america': 'Latin America',
  'north-america': 'North America',
}
const FACILITY_LABEL: Record<string, string> = {
  formulation: 'Formulation plant',
  api: 'API manufacturing plant',
  rnd: 'R&D centre',
  'qc-lab': 'Quality control laboratory',
  warehouse: 'Warehouse & distribution centre',
}
const CERT_LABEL: Record<string, string> = {
  license: 'License',
  certification: 'Certification',
  accreditation: 'Accreditation',
  registration: 'Product registration',
  membership: 'Membership',
}

export const productPath = (p: Pick<Product, 'slug'>) => `/products/${p.slug}`
export const categoryPath = (c: Pick<Category, 'path' | 'slug'>) =>
  `/categories/${c.path || c.slug}`
export const countryPath = (c: Pick<Country, 'slug'>) => `/global-presence/${c.slug}`

/* ------------------------------------------------------------------ */
/* Markdown helpers                                                    */
/* ------------------------------------------------------------------ */

const clean = (s: string | null | undefined) => (s || '').replace(/\s+/g, ' ').trim()
const cell = (s: string | null | undefined) => clean(s).replace(/\|/g, '\\|')
const link = (text: string, path: string) => `[${clean(text)}](${absUrl(path)})`
const uniq = <T>(arr: T[]) => [...new Set(arr)]
const listNames = (items: string[]) => {
  const a = items.map(clean).filter(Boolean)
  if (a.length <= 1) return a.join('')
  return `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}`
}

/* ---- Lexical → Markdown (keeps headings, lists, links, emphasis and tables) ---- */

type LexNode = {
  type?: string
  text?: string
  format?: number | string
  tag?: string
  listType?: string
  url?: string
  fields?: { url?: string; linkType?: string } | null
  children?: LexNode[]
}

const inlineMd = (node: LexNode): string => {
  if (typeof node.text === 'string') {
    let t = node.text
    if (!t.trim()) return t
    const f = typeof node.format === 'number' ? node.format : 0
    if (f & 16) t = `\`${t}\``
    if (f & 1) t = `**${t}**`
    if (f & 2) t = `*${t}*`
    if (f & 4) t = `~~${t}~~`
    return t
  }
  if (node.type === 'linebreak') return '\n'
  if (node.type === 'tab') return ' '
  const inner = (node.children || []).map(inlineMd).join('')
  if (node.type === 'link' || node.type === 'autolink') {
    const url = node.fields?.url || node.url
    return url && node.fields?.linkType !== 'internal' ? `[${inner}](${url})` : inner
  }
  return inner
}

const blockMd = (node: LexNode, depth: number): string[] => {
  switch (node.type) {
    case 'heading': {
      // Rich text always sits inside a "###" document section – keep its headings one level below.
      const level = Number((node.tag || 'h3').replace(/\D/g, '')) || 3
      return [`${'#'.repeat(Math.min(6, Math.max(4, level + 2)))} ${clean(inlineMd(node))}`]
    }
    case 'paragraph': {
      const t = inlineMd(node).trim()
      return t ? [t] : []
    }
    case 'quote': {
      const t = inlineMd(node).trim()
      return t
        ? [
            t
              .split('\n')
              .map((l) => `> ${l}`)
              .join('\n'),
          ]
        : []
    }
    case 'list': {
      const ordered = node.listType === 'number'
      const items = (node.children || []).map((li, i) => {
        const nested = (li.children || []).filter((c) => c.type === 'list')
        const own: LexNode = {
          ...li,
          children: (li.children || []).filter((c) => c.type !== 'list'),
        }
        const text = inlineMd(own).trim()
        const line = text ? `${'  '.repeat(depth)}${ordered ? `${i + 1}.` : '-'} ${text}` : ''
        return [line, ...nested.flatMap((n) => blockMd(n, depth + 1))].filter(Boolean).join('\n')
      })
      return items.length ? [items.filter(Boolean).join('\n')] : []
    }
    case 'horizontalrule':
      return ['---']
    case 'table': {
      const rows = (node.children || []).map((r) =>
        (r.children || []).map((c) => cell(inlineMd(c))),
      )
      if (!rows.length) return []
      const [head, ...body] = rows
      return [
        [
          `| ${head.join(' | ')} |`,
          `| ${head.map(() => '---').join(' | ')} |`,
          ...body.map((r) => `| ${r.join(' | ')} |`),
        ].join('\n'),
      ]
    }
    case 'upload':
    case 'block':
    case 'relationship':
      return []
    default: {
      if (node.children?.length) return node.children.flatMap((c) => blockMd(c, depth))
      const t = inlineMd(node).trim()
      return t ? [t] : []
    }
  }
}

/** Lexical rich text → Markdown. Falls back to plain text for anything unexpected. */
const richToMd = (doc: unknown): string => {
  if (!doc || typeof doc !== 'object') return ''
  try {
    const root = ((doc as { root?: LexNode }).root ?? doc) as LexNode
    return (root.children || [])
      .flatMap((c) => blockMd(c, 0))
      .filter(Boolean)
      .join('\n\n')
      .trim()
  } catch {
    return richTextToPlain(doc)
  }
}

const table = (rows: (readonly [string, string | null | undefined])[]) => {
  const filled = rows.filter(([, v]) => clean(v))
  if (!filled.length) return ''
  return [
    '| Attribute | Value |',
    '| --- | --- |',
    ...filled.map(([k, v]) => `| ${cell(k)} | ${cell(v)} |`),
  ].join('\n')
}

const bullets = (items: (string | null | undefined)[]) =>
  items
    .map(clean)
    .filter(Boolean)
    .map((i) => `- ${i}`)
    .join('\n')

const numbered = (items: { title: string; description?: string | null }[] | null | undefined) =>
  (items || [])
    .map(
      (s, i) =>
        `${i + 1}. **${clean(s.title)}**${clean(s.description) ? ` — ${clean(s.description)}` : ''}`,
    )
    .join('\n')

const titled = (items: { title: string; description?: string | null }[] | null | undefined) =>
  (items || [])
    .map(
      (s) => `- **${clean(s.title)}**${clean(s.description) ? ` — ${clean(s.description)}` : ''}`,
    )
    .join('\n')

type Faq = { question: string; answer: string }
const faqBlock = (
  faqs: Faq[] | null | undefined,
  heading = 'Frequently asked questions',
  level = '###',
) => {
  if (!faqs?.length) return ''
  return [
    `${level} ${heading}`,
    ...faqs.map((f) => `**Q: ${clean(f.question)}**\n\nA: ${clean(f.answer)}`),
  ].join('\n\n')
}

type Stat = { value: string; suffix?: string | null; label: string }
const statsBlock = (stats: Stat[] | null | undefined) =>
  stats?.length
    ? bullets(stats.map((s) => `**${clean(s.value)}${clean(s.suffix)}** ${clean(s.label)}`))
    : ''

/** Joins blocks with blank lines, dropping empties. */
const blocks = (...parts: (string | null | undefined | false)[]) =>
  parts.filter((p): p is string => Boolean(p && p.trim())).join('\n\n')

/* ------------------------------------------------------------------ */
/* Shared fragments                                                    */
/* ------------------------------------------------------------------ */

const productSpec = (p: Pick<Product, 'title' | 'genericName' | 'strength' | 'dosageForm'>) =>
  [p.genericName && p.genericName !== p.title ? p.genericName : null, p.strength, p.dosageForm]
    .map(clean)
    .filter(Boolean)
    .join(' ')

export const productHeading = (
  p: Pick<Product, 'title' | 'genericName' | 'strength' | 'dosageForm'>,
) => {
  const spec = productSpec(p)
  return spec ? `${clean(p.title)} – ${spec}` : clean(p.title)
}

/** Whether the company manufactures (has a formulation or API plant in the CMS) or only supplies – never asserted, always derived. */
const manufactures = (d: LlmsData) =>
  d.facilities.some((f) => f.type === 'formulation' || f.type === 'api')
const companyRole = (d: LlmsData) =>
  manufactures(d)
    ? 'pharmaceutical manufacturer and exporter'
    : 'pharmaceutical supplier and exporter'

/** One-line factual summary for the blockquote: derived from settings + live counts, never truncated mid-sentence. */
const summaryLine = (d: LlmsData) => {
  const s = d.settings
  const name = siteName(s)
  const tagline = clean(s.tagline)
  const addr = s.contact?.address
  const hq = [addr?.city, addr?.country].map(clean).filter(Boolean).join(', ')
  const gmp = d.certifications.find((c) => /gmp/i.test(c.title))
  const quality = gmp
    ? /who[\s-]*gmp/i.test(gmp.title)
      ? 'A WHO-GMP certified'
      : 'A GMP certified'
    : 'A'
  const details = [
    `${d.products.length} products in ${d.categories.length} categories`,
    d.certifications.length ? `${d.certifications.length} licenses and certifications` : null,
    d.countries.length ? `supplying ${d.countries.length} countries` : null,
  ].filter(Boolean)
  const where = hq ? ` based in ${hq}` : ''
  const since = s.foundingYear ? ` (est. ${s.foundingYear})` : ''
  const line = `${quality} ${companyRole(d)}${where}${since} with ${details.join(', ')}.`
  return tagline ? `${name} — ${tagline}. ${line}` : `${name}. ${line}`
}

const companyParagraph = (d: LlmsData) => {
  const s = d.settings
  const name = siteName(s)
  const labels = getCommerceLabels(s)
  const addr = s.contact?.address
  const hq = [addr?.city, addr?.country].filter(Boolean).join(', ')
  const out: string[] = [clean(s.shortDescription) || `${name} is a ${companyRole(d)}.`]

  const facts: string[] = []
  if (s.legalName && clean(s.legalName) !== name) facts.push(`registered as ${clean(s.legalName)}`)
  if (s.foundingYear) facts.push(`founded in ${s.foundingYear}`)
  if (hq) facts.push(`headquartered in ${hq}`)
  if (s.employeeCount) facts.push(`employing ${clean(s.employeeCount)} people`)
  if (facts.length) out.push(`The company is ${facts.join(', ')}.`)

  if (d.facilities.length) {
    const n = d.facilities.length
    out.push(
      `It operates ${n} ${n === 1 ? 'facility' : 'facilities'}: ${listNames(d.facilities.map((f) => `${f.name}${f.city ? ` (${f.city})` : ''}`))}.`,
    )
  }
  if (d.certifications.length)
    out.push(
      `Quality credentials include ${listNames(uniq(d.certifications.map((c) => c.title)))}.`,
    )
  if (d.countries.length) {
    const regions = uniq(d.countries.map((c) => REGION_LABEL[c.region] || c.region))
    out.push(
      `Products are currently exported to ${d.countries.length} countries across ${listNames(regions)}.`,
    )
  }
  out.push(
    `The catalogue lists ${d.products.length} products in ${d.categories.length} categories.`,
  )
  out.push(
    labels.mode === 'ecommerce'
      ? `Prices are shown in ${labels.currency} and orders can be placed online.`
      : `Pricing is provided on request: visitors add products to an inquiry list and submit a quotation request, and the export team replies with a formal quote. There is no online checkout.`,
  )
  return out.join(' ')
}

const pageTitle = (hero: { title?: string | null } | null | undefined, fallback: string) =>
  clean(hero?.title) || fallback

const pagesList = (d: LlmsData) => {
  const name = siteName(d.settings)
  const pick = (...c: (string | null | undefined)[]) => c.map(clean).find(Boolean) || ''
  const p = d.pages
  return [
    {
      title: 'Home',
      path: '/',
      description: pick(
        p.home.meta?.description,
        p.home.hero?.subtitle,
        `Overview of ${name}: products, quality systems, manufacturing and global reach.`,
      ),
    },
    {
      title: pageTitle(p.products.hero, 'Products'),
      path: '/products',
      description: pick(
        p.products.meta?.description,
        p.products.hero?.subtitle,
        'Full catalogue of finished pharmaceutical formulations, filterable by category, dosage form, route and prescription status.',
      ),
    },
    {
      title: 'Product categories',
      path: '/categories',
      description: 'Every therapeutic category and sub-category with product counts.',
    },
    {
      title: pageTitle(p.about.hero, `About ${name}`),
      path: '/about',
      description: pick(
        p.about.meta?.description,
        p.about.hero?.subtitle,
        `Company history, mission, leadership and milestones of ${name}.`,
      ),
    },
    {
      title: pageTitle(p.manufacturing.hero, 'Manufacturing'),
      path: '/manufacturing',
      description: pick(
        p.manufacturing.meta?.description,
        p.manufacturing.hero?.subtitle,
        'Manufacturing facilities, dosage-form capabilities and capacity.',
      ),
    },
    {
      title: pageTitle(p.quality.hero, 'Quality'),
      path: '/quality',
      description: pick(
        p.quality.meta?.description,
        p.quality.hero?.subtitle,
        'Quality assurance, quality control and testing processes.',
      ),
    },
    {
      title: pageTitle(p.global.hero, 'Global presence'),
      path: '/global-presence',
      description: pick(
        p.global.meta?.description,
        p.global.hero?.subtitle,
        `Export markets served by ${name}, with a dedicated page per country.`,
      ),
    },
    {
      title: pageTitle(p.licenses.hero, 'Licenses & certifications'),
      path: '/licenses',
      description: pick(
        p.licenses.meta?.description,
        p.licenses.hero?.subtitle,
        'Licenses, certifications, accreditations and product registrations held by the company.',
      ),
    },
    {
      title: pageTitle(p.contact.hero, 'Contact'),
      path: '/contact',
      description: pick(
        p.contact.meta?.description,
        p.contact.hero?.subtitle,
        'Email, phone, WhatsApp, office address and department contacts.',
      ),
    },
    {
      title: pageTitle(p.inquiry.hero, 'Request a quote'),
      path: '/inquiry',
      description: pick(
        p.inquiry.meta?.description,
        p.inquiry.hero?.subtitle,
        'Submit an inquiry list to receive a quotation and product documentation.',
      ),
    },
  ]
}

const categoryChain = (p: Product, byId: Map<number, Category>) => {
  const chains = (p.categories || [])
    .map((c) => {
      const id = relId(c)
      if (!id) return ''
      const chain: string[] = []
      let cur = byId.get(id)
      let guard = 0
      while (cur && guard++ < 10) {
        chain.unshift(cur.title)
        const pid = relId(cur.parent)
        cur = pid ? byId.get(pid) : undefined
      }
      return chain.join(' > ')
    })
    .filter(Boolean)
  return uniq(chains).join('; ')
}

const contactBlock = (d: LlmsData) => {
  const c = d.settings.contact
  const addr = c?.address
  const address = [addr?.street, addr?.city, addr?.state, addr?.postalCode, addr?.country]
    .map(clean)
    .filter(Boolean)
    .join(', ')
  return bullets([
    c?.email ? `Email: ${clean(c.email)}` : null,
    c?.inquiryEmail && c.inquiryEmail !== c.email ? `Inquiries: ${clean(c.inquiryEmail)}` : null,
    c?.phone ? `Phone: ${clean(c.phone)}` : null,
    c?.whatsapp ? `WhatsApp: https://wa.me/${clean(c.whatsapp).replace(/\D/g, '')}` : null,
    address ? `Address: ${address}` : null,
    c?.businessHours ? `Business hours: ${clean(c.businessHours)}` : null,
    `Contact page: ${absUrl('/contact')}`,
    `Request a quote: ${absUrl('/inquiry')}`,
  ])
}

/* ------------------------------------------------------------------ */
/* /llms.txt                                                           */
/* ------------------------------------------------------------------ */

export const buildLlmsIndex = (d: LlmsData): string => {
  const s = d.settings
  const name = siteName(s)
  const out: string[] = []

  out.push(`# ${name}`, '')
  out.push(`> ${summaryLine(d)}`, '')
  out.push(companyParagraph(d), '')
  out.push(
    `This file follows the llms.txt convention (https://llmstxt.org). All links are canonical URLs on ${SITE_URL}. A complete Markdown export of every page is available at ${absUrl('/llms-full.txt')}.`,
    '',
  )

  out.push('## Pages', '')
  pagesList(d).forEach((p) => out.push(`- ${link(p.title, p.path)}: ${p.description}`))
  out.push('')

  out.push('## Product categories', '')
  const walk = (nodes: CategoryNode[], depth: number) => {
    nodes.forEach((n) => {
      if (n.meta?.noIndex) return
      const desc = clean(n.shortDescription) || `${n.title} products`
      out.push(
        `${'  '.repeat(depth)}- ${link(n.title, categoryPath(n))}: ${desc} (${n.productCount} ${n.productCount === 1 ? 'product' : 'products'})`,
      )
      walk(n.children, depth + 1)
    })
  }
  walk(d.tree, 0)
  out.push('')

  out.push('## Products', '')
  d.products.forEach((p) =>
    out.push(`- ${link(productHeading(p), productPath(p))}: ${clean(p.shortDescription)}`),
  )
  out.push('')

  if (d.countries.length) {
    out.push('## Markets', '')
    d.countries.forEach((c) => {
      const parts = [
        c.regulatoryAuthority ? `Regulator: ${clean(c.regulatoryAuthority)}` : null,
        c.sinceYear ? `supplied since ${c.sinceYear}` : null,
      ].filter(Boolean)
      const lead = parts.length ? `${parts.join('; ')}. ` : ''
      out.push(`- ${link(c.name, countryPath(c))}: ${lead}${truncate(c.summary, 200)}`.trim())
    })
    out.push('')
  }

  if (d.certifications.length) {
    out.push('## Certifications', '')
    d.certifications.forEach((c) => {
      const meta = [
        CERT_LABEL[c.type] || c.type,
        c.issuer ? `issued by ${clean(c.issuer)}` : null,
        c.validUntil ? `valid until ${formatDate(c.validUntil)}` : null,
      ]
        .filter(Boolean)
        .join(', ')
      out.push(
        `- ${link(c.title, '/licenses')}: ${meta}${clean(c.scope) ? `. Scope: ${clean(c.scope)}` : ''}`,
      )
    })
    out.push('')
  }

  out.push('## Contact', '')
  out.push(contactBlock(d), '')

  out.push('## Optional', '')
  out.push(
    `- ${link('Full site content (llms-full.txt)', '/llms-full.txt')}: Complete Markdown export of every product, category, market and company page.`,
  )
  out.push(
    `- ${link('XML sitemap', '/sitemap.xml')}: Every indexable URL with last-modified dates and product images.`,
  )
  out.push('')

  return out.join('\n')
}

/* ------------------------------------------------------------------ */
/* /llms-full.txt                                                      */
/* ------------------------------------------------------------------ */

type Section = {
  eyebrow?: string | null
  heading: string
  body?: unknown
  bullets?: { text: string }[] | null
}
type PageLike = {
  hero: { title: string; subtitle?: string | null }
  intro?: unknown
  stats?: Stat[] | null
  sections?: Section[] | null
  faqs?: Faq[] | null
}

const sectionsBlock = (sections: Section[] | null | undefined) =>
  (sections || [])
    .map((s) =>
      blocks(
        `### ${clean(s.heading)}`,
        richToMd(s.body),
        bullets((s.bullets || []).map((b) => b.text)),
      ),
    )
    .join('\n\n')

/** Generic page renderer: title, URL, subtitle, intro, stats, page-specific extras, sections, FAQs. */
const pageBlock = (
  page: PageLike,
  path: string,
  fallbackTitle: string,
  extras: (string | null | undefined | false)[] = [],
) =>
  blocks(
    `## ${pageTitle(page.hero, fallbackTitle)}`,
    `URL: ${absUrl(path)}`,
    clean(page.hero?.subtitle),
    richToMd(page.intro),
    statsBlock(page.stats),
    ...extras,
    sectionsBlock(page.sections),
    faqBlock(page.faqs),
  )

const productBlock = (
  p: Product,
  d: LlmsData,
  byId: Map<number, Category>,
  labels: ReturnType<typeof getCommerceLabels>,
) => {
  const price = resolvePrice(p, labels)
  const name = siteName(d.settings)
  const country = clean(d.settings.contact?.address?.country)
  const composition = (p.activeIngredients || [])
    .map((a) => [clean(a.name), clean(a.strength)].filter(Boolean).join(' '))
    .join(', ')
  const related = (p.relatedProducts || []).filter(
    (r): r is Product => typeof r === 'object' && r !== null,
  )
  const rows: (readonly [string, string | null | undefined])[] = [
    ['Brand name', p.title],
    ['Generic name (INN)', p.genericName],
    ['Therapeutic class', p.therapeuticClass],
    ['Category', categoryChain(p, byId)],
    ['Dosage form', p.dosageForm],
    ['Strength', p.strength],
    ['Route of administration', p.route],
    ['Prescription status', p.prescriptionStatus ? RX_LABEL[p.prescriptionStatus] : null],
    ['Composition', composition || p.genericName],
    ['Pack size', p.packSize],
    ['Packaging', p.packaging],
    ['Shelf life', p.shelfLife],
    ['Storage', p.storage],
    ...(p.specifications || []).map((s) => [s.label, s.value] as const),
    ['SKU', p.sku],
    ['Minimum order quantity', p.minOrderQuantity ? String(p.minOrderQuantity) : null],
    ['Availability', AVAILABILITY_LABEL[p.availability || 'in-stock']],
    [
      'Price',
      price.kind === 'price'
        ? `${price.formatted}${price.unit ? ` ${price.unit}` : ''}`
        : price.label,
    ],
    ['Highlights', (p.badges || []).map((b) => BADGE_LABEL[b] || b).join(', ')],
    [manufactures(d) ? 'Manufacturer' : 'Supplier', country ? `${name} (${country})` : name],
  ]
  return blocks(
    `### ${productHeading(p)}`,
    `URL: ${absUrl(productPath(p))}`,
    clean(p.shortDescription),
    table(rows),
    richToMd(p.description) ? blocks('**Description**', richToMd(p.description)) : '',
    richToMd(p.indications) ? blocks('**Indications and uses**', richToMd(p.indications)) : '',
    p.keyBenefits?.length
      ? blocks('**Key benefits**', bullets(p.keyBenefits.map((b) => b.text)))
      : '',
    faqBlock(p.faqs, 'Frequently asked questions', '####'),
    related.length
      ? `Related products: ${related.map((r) => link(r.title, productPath(r))).join(', ')}`
      : '',
  )
}

const categoryBlock = (c: Category, d: LlmsData, byId: Map<number, Category>) => {
  const parent = relId(c.parent) ? byId.get(relId(c.parent) as number) : undefined
  const children = d.categories.filter((x) => relId(x.parent) === c.id)
  const products = d.products.filter((p) => (p.categories || []).some((pc) => relId(pc) === c.id))
  return blocks(
    `### ${clean(c.title)}`,
    `URL: ${absUrl(categoryPath(c))}`,
    parent ? `Parent category: ${link(parent.title, categoryPath(parent))}` : 'Top-level category',
    children.length
      ? `Sub-categories: ${children.map((x) => link(x.title, categoryPath(x))).join(', ')}`
      : '',
    clean(c.shortDescription),
    richToMd(c.description),
    c.highlights?.length ? bullets(c.highlights.map((h) => h.text)) : '',
    products.length
      ? blocks(
          `Products in this category (${products.length}):`,
          bullets(
            products.map(
              (p) => `${link(productHeading(p), productPath(p))}: ${clean(p.shortDescription)}`,
            ),
          ),
        )
      : '',
    faqBlock(c.faqs, 'Frequently asked questions', '####'),
  )
}

const countryBlock = (c: Country) => {
  const cats = (c.popularCategories || []).filter(
    (x): x is Category => typeof x === 'object' && x !== null,
  )
  const prods = (c.popularProducts || []).filter(
    (x): x is Product => typeof x === 'object' && x !== null,
  )
  const rows: (readonly [string, string | null | undefined])[] = [
    ['Country', `${clean(c.flag)} ${clean(c.name)}`.trim()],
    ['ISO code', c.isoCode],
    ['Region', REGION_LABEL[c.region] || c.region],
    ['Regulatory authority', c.regulatoryAuthority],
    ['Supplying since', c.sinceYear ? String(c.sinceYear) : null],
    ['Popular categories', cats.map((x) => x.title).join(', ')],
    ['Popular products', prods.map((x) => x.title).join(', ')],
  ]
  return blocks(
    `### ${clean(c.name)}`,
    `URL: ${absUrl(countryPath(c))}`,
    clean(c.summary),
    table(rows),
    richToMd(c.description),
    c.highlights?.length ? bullets(c.highlights.map((h) => h.text)) : '',
    prods.length
      ? `Product links: ${prods.map((p) => link(p.title, productPath(p))).join(', ')}`
      : '',
    cats.length
      ? `Category links: ${cats.map((x) => link(x.title, categoryPath(x))).join(', ')}`
      : '',
    faqBlock(c.faqs, 'Frequently asked questions', '####'),
  )
}

const certificationBlock = (c: Certification) =>
  blocks(
    `### ${clean(c.title)}`,
    table([
      ['Type', CERT_LABEL[c.type] || c.type],
      ['Issuing authority', c.issuer],
      ['Certificate number', c.certificateNumber],
      [
        'Valid from',
        c.validFrom
          ? formatDate(c.validFrom, { year: 'numeric', month: 'long', day: 'numeric' })
          : null,
      ],
      [
        'Valid until',
        c.validUntil
          ? formatDate(c.validUntil, { year: 'numeric', month: 'long', day: 'numeric' })
          : null,
      ],
      ['Scope', c.scope],
    ]),
    richToMd(c.description),
  )

const facilityBlock = (f: Facility) => {
  const certs = (f.certifications || []).filter(
    (x): x is Certification => typeof x === 'object' && x !== null,
  )
  return blocks(
    `### ${clean(f.name)}`,
    table([
      ['Type', FACILITY_LABEL[f.type] || f.type],
      ['Location', [f.city, f.country].map(clean).filter(Boolean).join(', ')],
      ['Address', f.address],
      ['Established', f.establishedYear ? String(f.establishedYear) : null],
      ['Built-up area', f.areaSqm ? `${f.areaSqm.toLocaleString('en')} m²` : null],
      ['Dosage forms', (f.dosageForms || []).join(', ')],
      ['Certifications', certs.map((c) => c.title).join(', ')],
    ]),
    clean(f.summary),
    richToMd(f.description),
    f.capabilities?.length
      ? blocks('**Capabilities**', bullets(f.capabilities.map((c) => c.text)))
      : '',
    f.capacity?.length
      ? blocks(
          '**Capacity**',
          bullets(f.capacity.map((c) => `${clean(c.label)}: ${clean(c.value)}`)),
        )
      : '',
  )
}

export const buildLlmsFull = (d: LlmsData): string => {
  const s = d.settings
  const name = siteName(s)
  const labels = getCommerceLabels(s)
  const byId = new Map(d.categories.map((c) => [c.id, c]))
  const p = d.pages
  const out: string[] = []

  out.push(`# ${name}`, '')
  out.push(`> ${summaryLine(d)}`, '')
  out.push(companyParagraph(d), '')
  out.push(
    `This document is the complete public content of ${SITE_URL} in Markdown, generated for AI assistants and search engines. It is regenerated automatically when content changes. Every heading links back to its canonical page. The short index is at ${absUrl('/llms.txt')}.`,
    '',
  )

  /* Home */
  const home = p.home
  const homeTitle = clean(home.hero?.title)
  const highlight = clean(home.hero?.highlight)
  const homeHeading =
    homeTitle && highlight && !homeTitle.toLowerCase().includes(highlight.toLowerCase())
      ? `${homeTitle} ${highlight}`
      : homeTitle || name
  out.push(
    blocks(
      `## ${homeHeading}`,
      `URL: ${absUrl('/')}`,
      clean(home.hero?.subtitle),
      statsBlock(home.stats),
      clean(home.intro?.heading)
        ? blocks(`### ${clean(home.intro?.heading)}`, clean(home.intro?.body))
        : clean(home.intro?.body),
      home.whyUs?.length ? blocks(`### Why choose ${name}`, titled(home.whyUs)) : '',
      clean(home.globalSection?.heading)
        ? blocks(`### ${clean(home.globalSection?.heading)}`, clean(home.globalSection?.body))
        : '',
      clean(home.manufacturingSection?.heading)
        ? blocks(
            `### ${clean(home.manufacturingSection?.heading)}`,
            clean(home.manufacturingSection?.body),
            bullets((home.manufacturingSection?.bullets || []).map((b) => b.text)),
          )
        : '',
      home.testimonials?.length
        ? blocks(
            '### What partners say',
            home.testimonials
              .map(
                (t) =>
                  `> "${clean(t.quote)}" — ${clean(t.author)}${clean(t.role) ? `, ${clean(t.role)}` : ''}`,
              )
              .join('\n\n'),
          )
        : '',
      faqBlock(home.faqs),
    ),
    '',
  )

  /* About */
  const about = p.about
  out.push(
    pageBlock(about, '/about', `About ${name}`, [
      clean(about.mission?.mission) ? blocks('### Mission', clean(about.mission?.mission)) : '',
      clean(about.mission?.vision) ? blocks('### Vision', clean(about.mission?.vision)) : '',
      about.values?.length ? blocks('### Values', titled(about.values)) : '',
      about.milestones?.length
        ? blocks(
            '### Milestones',
            bullets(
              about.milestones.map(
                (m) =>
                  `**${clean(m.year)}** — ${clean(m.title)}${clean(m.description) ? `: ${clean(m.description)}` : ''}`,
              ),
            ),
          )
        : '',
      about.leadership?.length
        ? blocks(
            '### Leadership',
            bullets(
              about.leadership.map(
                (l) =>
                  `**${clean(l.name)}**, ${clean(l.role)}${clean(l.bio) ? ` — ${clean(l.bio)}` : ''}`,
              ),
            ),
          )
        : '',
    ]),
    '',
  )

  /* Manufacturing + facilities */
  const mfg = p.manufacturing
  const cm = mfg.contractManufacturing
  out.push(
    pageBlock(mfg, '/manufacturing', 'Manufacturing', [
      mfg.capabilities?.length ? blocks('### Capabilities', titled(mfg.capabilities)) : '',
      mfg.process?.length ? blocks('### Manufacturing process', numbered(mfg.process)) : '',
      clean(cm?.heading) || clean(cm?.body)
        ? blocks(
            `### ${clean(cm?.heading) || 'Contract manufacturing'}`,
            clean(cm?.body),
            bullets((cm?.bullets || []).map((b) => b.text)),
          )
        : '',
      d.facilities.length
        ? blocks('### Facilities', d.facilities.map(facilityBlock).join('\n\n'))
        : '',
    ]),
    '',
  )

  /* Quality */
  const q = p.quality
  out.push(
    pageBlock(q, '/quality', 'Quality assurance', [
      q.pillars?.length ? blocks('### Quality pillars', titled(q.pillars)) : '',
      q.process?.length ? blocks('### Quality control process', numbered(q.process)) : '',
      q.standards?.length
        ? blocks(
            '### Standards followed',
            titled(q.standards.map((x) => ({ title: x.name, description: x.description }))),
          )
        : '',
    ]),
    '',
  )

  /* Licenses + certifications */
  out.push(
    pageBlock(p.licenses, '/licenses', 'Licenses & certifications', [
      d.certifications.length
        ? blocks(
            `### Certificates and licenses held (${d.certifications.length})`,
            d.certifications.map(certificationBlock).join('\n\n'),
          )
        : '',
    ]),
    '',
  )

  /* Catalogue overview */
  out.push(pageBlock(p.products, '/products', 'Products'), '')

  /* Categories */
  out.push(
    `## Product categories (${d.categories.length})`,
    '',
    `URL: ${absUrl('/categories')}`,
    '',
  )
  const ordered: Category[] = []
  const walk = (nodes: CategoryNode[]) =>
    nodes.forEach((n) => {
      const cat = byId.get(n.id)
      if (cat) ordered.push(cat)
      walk(n.children)
    })
  walk(d.tree)
  d.categories.forEach((c) => {
    if (!ordered.includes(c)) ordered.push(c)
  })
  out.push(ordered.map((c) => categoryBlock(c, d, byId)).join('\n\n'), '')

  /* Products */
  out.push(`## Products (${d.products.length})`, '')
  out.push(
    labels.mode === 'ecommerce'
      ? `Prices are listed in ${labels.currency}. Products without a listed price are quoted on request.`
      : `All products are supplied business-to-business. Prices are quoted on request through the inquiry list (${absUrl('/inquiry')}); product documentation can be requested together with a quotation.`,
    '',
  )
  out.push(d.products.map((pr) => productBlock(pr, d, byId, labels)).join('\n\n'), '')

  /* Global presence + countries */
  const g = p.global
  out.push(
    pageBlock(g, '/global-presence', 'Global presence', [
      g.exportServices?.length ? blocks('### Export services', titled(g.exportServices)) : '',
      g.process?.length ? blocks('### How we onboard a new market', numbered(g.process)) : '',
      d.countries.length
        ? blocks(
            `### Markets served (${d.countries.length})`,
            d.countries.map(countryBlock).join('\n\n'),
          )
        : '',
    ]),
    '',
  )

  /* Contact + inquiry */
  const c = p.contact
  out.push(
    pageBlock(c, '/contact', 'Contact', [
      contactBlock(d),
      c.departments?.length
        ? blocks(
            '### Departments',
            bullets(
              c.departments.map(
                (dep) =>
                  `**${clean(dep.name)}**${clean(dep.email) ? ` — ${clean(dep.email)}` : ''}${clean(dep.phone) ? ` — ${clean(dep.phone)}` : ''}`,
              ),
            ),
          )
        : '',
    ]),
    '',
  )
  out.push(
    pageBlock(p.inquiry, '/inquiry', 'Request a quote', [
      labels.mode === 'ecommerce'
        ? ''
        : blocks(
            '### How ordering works',
            numbered([
              {
                title: `Add products to your ${labels.listName.toLowerCase()}`,
                description: `Use "${labels.addLabel}" on any product page or catalogue card.`,
              },
              {
                title: `Click "${labels.ctaLabel}"`,
                description:
                  'Review the list, add quantities and send it with your company details.',
              },
              {
                title: 'Receive a quotation',
                description:
                  'The team replies with pricing, lead times and the documentation available for your market.',
              },
            ]),
          ),
    ]),
    '',
  )

  return out.join('\n')
}
