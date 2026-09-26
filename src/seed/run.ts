/**
 * Seeds the database with demo content: admin user, media, categories, products,
 * countries, certifications, facilities and page copy.
 *
 *   pnpm seed            → seeds only if the catalogue is empty
 *   pnpm seed -- --fresh → wipes content collections first, then seeds
 */
import 'dotenv/config'

import { getPayload, type Payload } from 'payload'

import config from '../payload.config'
import { categories as seedCategories, type SeedCategory } from './data/categories'
import { certifications as seedCerts } from './data/certifications'
import { countries as seedCountries } from './data/countries'
import { facilities as seedFacilities } from './data/facilities'
import {
  aboutPage,
  contactPage,
  globalPresencePage,
  homepage,
  inquiryPage,
  licensesPage,
  manufacturingPage,
  productsPage,
  qualityPage,
  siteSettings,
} from './data/globals'
import { formDefaults, products as seedProducts } from './data/products'
import { abstractImage, badgeImage, productImage } from './images'
import { md } from './lexical'

const fresh = process.argv.includes('--fresh') || process.env.SEED_FRESH === '1'
const ctx = { disableRevalidate: true }
const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const log = (msg: string) => console.log(`• ${msg}`)

async function wipe(payload: Payload) {
  for (const collection of [
    'inquiries',
    'products',
    'countries',
    'facilities',
    'certifications',
    'categories',
    'media',
  ] as const) {
    const { totalDocs } = await payload.count({ collection })
    if (totalDocs) {
      await payload.delete({ collection, where: { id: { exists: true } }, context: ctx })
      log(`Deleted ${totalDocs} ${collection}`)
    }
  }
}

async function upload(payload: Payload, filePath: string, alt: string) {
  const doc = await payload.create({ collection: 'media', data: { alt }, filePath, context: ctx })
  return doc.id
}

async function main() {
  const payload = await getPayload({ config })
  console.log(`\nSeeding ${fresh ? '(fresh)' : ''}…\n`)

  // ---------- Admin user ----------
  const { totalDocs: users } = await payload.count({ collection: 'users' })
  if (users === 0) {
    const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com'
    const password = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!'
    await payload.create({
      collection: 'users',
      data: { email, password, name: 'Administrator', roles: ['admin'] },
      context: ctx,
    })
    log(`Created admin user ${email} / ${password}  ← change this after first login`)
  }

  if (fresh) await wipe(payload)
  const { totalDocs: existing } = await payload.count({ collection: 'products' })
  if (existing > 0) {
    console.log(
      `\nDatabase already has ${existing} products. Run "pnpm seed -- --fresh" to reset.\n`,
    )
    process.exit(0)
  }

  // ---------- Media ----------
  const images = {
    hero: await upload(
      payload,
      await abstractImage('hero.webp', 'hero'),
      'Abstract capsule illustration with red and white gradients',
    ),
    facility: await upload(
      payload,
      await abstractImage('facility.webp', 'facility'),
      'Stylised pharmaceutical manufacturing facility',
    ),
    lab: await upload(
      payload,
      await abstractImage('lab.webp', 'lab'),
      'Stylised laboratory glassware and molecules',
    ),
    globe: await upload(
      payload,
      await abstractImage('globe.webp', 'globe'),
      'Stylised globe with connection points',
    ),
    quality: await upload(
      payload,
      await abstractImage('quality.webp', 'quality'),
      'Quality shield illustration',
    ),
    team: await upload(
      payload,
      await abstractImage('team.webp', 'team'),
      'Stylised team illustration',
    ),
    warehouse: await upload(
      payload,
      await abstractImage('warehouse.webp', 'warehouse'),
      'Stylised warehouse racking illustration',
    ),
  }
  log('Uploaded section imagery')

  // ---------- Certifications ----------
  const certIds: number[] = []
  for (const [i, c] of seedCerts.entries()) {
    const image = await upload(
      payload,
      await badgeImage(`cert-${slugify(c.title)}.webp`, c.title, c.issuer),
      `${c.title} certificate`,
    )
    const doc = await payload.create({
      collection: 'certifications',
      data: {
        title: c.title,
        type: c.type,
        issuer: c.issuer,
        certificateNumber: c.number,
        validFrom: c.validFrom,
        validUntil: c.validUntil,
        scope: c.scope,
        description: md(c.description),
        image,
        featured: Boolean(c.featured),
        order: i,
      },
      context: ctx,
    })
    certIds.push(doc.id)
  }
  log(`Created ${certIds.length} certifications`)

  // ---------- Facilities ----------
  for (const [i, f] of seedFacilities.entries()) {
    await payload.create({
      collection: 'facilities',
      data: {
        name: f.name,
        slug: f.slug,
        type: f.type,
        city: f.city,
        country: f.country,
        address: f.address,
        summary: f.summary,
        description: md(f.description),
        dosageForms: f.dosageForms as any,
        capabilities: f.capabilities.map((text) => ({ text })),
        capacity: f.capacity,
        certifications: certIds.slice(0, 2),
        images: [images[f.image]],
        areaSqm: f.areaSqm,
        establishedYear: f.establishedYear,
        order: i,
      },
      context: ctx,
    })
  }
  log(`Created ${seedFacilities.length} facilities`)

  // ---------- Categories ----------
  const catIdBySlug = new Map<string, number>()
  const createCat = async (c: SeedCategory, parent: number | undefined, order: number) => {
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
        faqs: c.faqs,
        featured: !parent,
        order,
        image: parent ? undefined : images.hero,
        meta: { title: c.meta.title, description: c.meta.description, keywords: c.meta.keywords },
      },
      context: ctx,
    })
    catIdBySlug.set(c.slug, doc.id)
    for (const [i, child] of (c.children || []).entries()) await createCat(child, doc.id, i)
  }
  for (const [i, c] of seedCategories.entries()) await createCat(c, undefined, i)
  log(`Created ${catIdBySlug.size} categories`)

  // ---------- Products ----------
  const productIds: number[] = []
  const productIdBySku = new Map<string, number>()
  for (const p of seedProducts) {
    const defaults = formDefaults(p.form)
    const slug = slugify(
      `${p.title} ${p.generic}`.length > 60 ? p.title : `${p.title}-${p.generic}`,
    )
    const image = await upload(
      payload,
      await productImage(`${p.sku.toLowerCase()}.webp`, {
        brand: p.title,
        generic: p.generic,
        strength: p.strength,
        form: p.form,
      }),
      `${p.title} – ${p.generic} ${p.strength} ${p.form}`,
    )
    const cats = p.categories
      .map((s) => catIdBySlug.get(s))
      .filter((x): x is number => typeof x === 'number')
    const doc = await payload.create({
      collection: 'products',
      data: {
        title: p.title,
        slug,
        genericName: p.generic,
        categories: cats,
        featured: Boolean(p.featured),
        badges: p.badges as any,
        images: [image],
        shortDescription: p.short,
        dosageForm: p.form as any,
        strength: p.strength,
        prescriptionStatus: p.rx || 'rx',
        route: p.route as any,
        packSize: p.packSize,
        packaging: p.packaging || defaults.packaging,
        shelfLife: p.shelfLife || defaults.shelfLife,
        storage: p.storage || defaults.storage,
        activeIngredients: p.ingredients,
        therapeuticClass: p.therapeuticClass,
        specifications: p.specs,
        description: md(p.description),
        indications: md(p.indications),
        keyBenefits: p.benefits.map((text) => ({ text })),
        faqs: p.faqs,
        price: p.price,
        showPrice: 'default',
        sku: p.sku,
        minOrderQuantity: 1,
        availability: 'in-stock',
        meta: {
          title:
            p.meta?.title ||
            `${p.title} – ${p.generic} ${p.strength} ${p.form} Manufacturer & Exporter`,
          description: p.meta?.description || p.short,
          keywords:
            p.meta?.keywords ||
            `${p.generic.toLowerCase()} ${p.strength.toLowerCase()}, ${p.generic.toLowerCase()} ${p.form.toLowerCase()} manufacturer, ${p.generic.toLowerCase()} exporter`,
        },
        _status: 'published',
      },
      context: ctx,
    })
    productIds.push(doc.id)
    productIdBySku.set(p.sku, doc.id)
  }
  log(`Created ${productIds.length} products`)

  // ---------- Countries ----------
  const productsByCat = new Map<number, number[]>()
  const all = await payload.find({
    collection: 'products',
    limit: 500,
    depth: 0,
    pagination: false,
  })
  all.docs.forEach((d) =>
    (d.categories as number[]).forEach((c) =>
      productsByCat.set(c, [...(productsByCat.get(c) || []), d.id]),
    ),
  )
  const catsAll = await payload.find({
    collection: 'categories',
    limit: 500,
    depth: 0,
    pagination: false,
  })
  const childrenOf = new Map<number, number[]>()
  catsAll.docs.forEach((c) => {
    const pid = c.parent as number | null
    if (pid) childrenOf.set(pid, [...(childrenOf.get(pid) || []), c.id])
  })
  const productsInTree = (id: number): number[] => [
    ...(productsByCat.get(id) || []),
    ...(childrenOf.get(id) || []).flatMap(productsInTree),
  ]

  const REGION_TEXT: Record<string, string> = {
    africa:
      'Sub-Saharan and North African markets rely on us for essential medicines that remain stable in hot, humid conditions – every product we register in the region carries Zone IVb stability data.',
    'middle-east':
      'Gulf and Levant markets demand rigorous GMP inspection, Arabic-language artwork and halal-compliant excipients, all of which we provide as standard.',
    'south-asia':
      'Proximity to our Ahmedabad plants means short lead times, competitive freight and fast responses to regulatory queries for South Asian partners.',
    'south-east-asia':
      'ASEAN regulators require ACTD-format dossiers and, in several countries, halal certification – our regulatory team prepares both.',
    'east-asia-pacific':
      'Pacific island nations and PNG source essential medicines through consolidated shipments with extended shelf life to accommodate longer transit times.',
    cis: 'CIS markets require Russian-language documentation, EAEU-aligned dossiers and often local pharmacopoeial testing; we support all three.',
    europe:
      'European and Balkan partners work with us on contract manufacturing and registrations that require CTD dossiers and GMP inspection.',
    'latin-america':
      'Spanish- and Portuguese-language dossiers, INVIMA/ANVISA-style GMP requirements and long-distance cold-chain logistics are handled by our Latin America desk.',
    'north-america':
      'North American partners engage us for development and supply projects requiring cGMP alignment.',
  }
  for (const c of seedCountries) {
    const catIds = c.categories
      .map((s) => catIdBySlug.get(s))
      .filter((x): x is number => typeof x === 'number')
    const popular = [...new Set(catIds.flatMap(productsInTree))].slice(0, 6)
    await payload.create({
      collection: 'countries',
      data: {
        name: c.name,
        slug: slugify(c.name),
        isoCode: c.iso,
        flag: c.flag,
        region: c.region,
        served: true,
        featured: Boolean(c.featured),
        sinceYear: c.since,
        lat: c.lat,
        lng: c.lng,
        regulatoryAuthority: c.authority,
        summary: `${siteSettings.siteName} has supplied WHO-GMP certified medicines to ${c.name} since ${c.since}, with products registered with the ${c.authority}.`,
        description: md(`## Pharmaceutical supply to ${c.name}

${c.note}

## Regulatory pathway

Medicines imported into ${c.name} are regulated by the **${c.authority}**. Our regulatory affairs team prepares the dossier in the required format, supplies Certificates of Pharmaceutical Product (CoPP), GMP certificates, stability data and samples, and responds to queries from the authority on behalf of our licence-holding partner.

## Regional expertise

${REGION_TEXT[c.region]}

## How to work with us in ${c.name}

1. Share your product list and target launch timeline.
2. We confirm which products are already registered and prepare dossiers for the rest.
3. Artwork is adapted to local language and labelling regulations.
4. Orders ship from our Ahmedabad logistics hub with complete export documentation.`),
        highlights: [
          { text: `Exporting since ${c.since}` },
          { text: `Regulator: ${c.authority.split('(')[0].trim()}` },
          { text: 'Registration & dossier support' },
          { text: 'Local-language artwork' },
        ],
        popularCategories: catIds,
        popularProducts: popular,
        image: images.globe,
        faqs: [
          {
            question: `Do you have products registered in ${c.name}?`,
            answer: `Yes – we have been active in ${c.name} since ${c.since} and hold registrations with the ${c.authority} for products in our core therapeutic categories. Contact us for the current list.`,
          },
          {
            question: `Can you help register new products in ${c.name}?`,
            answer: `Our regulatory team prepares complete dossiers, CoPPs and stability data in the format required by the ${c.authority} and supports the process until approval.`,
          },
          {
            question: `What is the lead time for shipments to ${c.name}?`,
            answer:
              'Registered products typically ship within 30–45 days of order confirmation; sea freight transit depends on the destination port and we can arrange air freight for urgent requirements.',
          },
        ],
        meta: {
          title: `Pharmaceutical Supplier & Exporter to ${c.name} | ${siteSettings.siteName}`,
          description: `WHO-GMP certified pharmaceutical manufacturer exporting to ${c.name} since ${c.since}. ${c.authority} registration support, antibiotics, cardiovascular, diabetes and more. Request a quote.`,
          keywords: `pharmaceutical supplier ${c.name}, medicine exporter to ${c.name}, pharmaceutical company ${c.name} import, generic medicines ${c.name}`,
        },
      },
      context: ctx,
    })
  }
  log(`Created ${seedCountries.length} countries`)

  // ---------- Globals ----------
  const settings = siteSettings
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      ...settings,
      logo: undefined,
      seo: { ...settings.seo, defaultImage: images.hero },
    } as any,
    context: ctx,
  })
  await payload.updateGlobal({
    slug: 'homepage',
    data: {
      ...homepage,
      hero: { ...homepage.hero, image: images.hero },
      intro: { ...homepage.intro, image: images.team },
      manufacturingSection: { ...homepage.manufacturingSection, image: images.facility },
    } as any,
    context: ctx,
  })
  await payload.updateGlobal({
    slug: 'about-page',
    data: {
      ...aboutPage,
      hero: { ...aboutPage.hero, image: images.team },
      intro: md(aboutPage.intro),
    } as any,
    context: ctx,
  })
  await payload.updateGlobal({
    slug: 'quality-page',
    data: {
      ...qualityPage,
      hero: { ...qualityPage.hero, image: images.quality },
      intro: md(qualityPage.intro),
    } as any,
    context: ctx,
  })
  await payload.updateGlobal({
    slug: 'manufacturing-page',
    data: {
      ...manufacturingPage,
      hero: { ...manufacturingPage.hero, image: images.facility },
      intro: md(manufacturingPage.intro),
    } as any,
    context: ctx,
  })
  await payload.updateGlobal({
    slug: 'global-presence-page',
    data: {
      ...globalPresencePage,
      hero: { ...globalPresencePage.hero, image: images.globe },
      intro: md(globalPresencePage.intro),
    } as any,
    context: ctx,
  })
  await payload.updateGlobal({
    slug: 'licenses-page',
    data: {
      ...licensesPage,
      hero: { ...licensesPage.hero, image: images.quality },
      intro: md(licensesPage.intro),
    } as any,
    context: ctx,
  })
  await payload.updateGlobal({
    slug: 'contact-page',
    data: {
      ...contactPage,
      hero: { ...contactPage.hero, image: images.team },
      intro: md(contactPage.intro),
    } as any,
    context: ctx,
  })
  await payload.updateGlobal({
    slug: 'products-page',
    data: {
      ...productsPage,
      hero: { ...productsPage.hero, image: images.hero },
      intro: md(productsPage.intro),
    } as any,
    context: ctx,
  })
  await payload.updateGlobal({
    slug: 'inquiry-page',
    data: { ...inquiryPage, hero: { ...inquiryPage.hero }, intro: md(inquiryPage.intro) } as any,
    context: ctx,
  })
  log('Updated site settings and page content')

  console.log('\n✔ Seed complete. Start the site with "pnpm dev" and open /admin.\n')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
