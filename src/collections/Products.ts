import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { isStaff, publishedOrStaff } from '@/access'
import { faqsField } from '@/fields/faqs'
import { seoTab } from '@/fields/seo'
import { revalidateCollection } from '@/hooks/revalidate'

export const DOSAGE_FORMS = [
  'Tablet',
  'Capsule',
  'Oral Suspension / Syrup',
  'Injection',
  'Infusion',
  'Ointment / Cream / Gel',
  'Eye / Ear Drops',
  'Sachet / Powder',
  'Inhaler',
  'Oral Solution / Drops',
  'Suppository',
  'Nasal Spray',
  'Other',
] as const

export const ROUTES_OF_ADMINISTRATION = [
  'Oral',
  'Intravenous',
  'Intramuscular',
  'Subcutaneous',
  'Topical',
  'Ophthalmic',
  'Otic',
  'Inhalation',
  'Nasal',
  'Rectal',
  'Vaginal',
] as const

export const PRODUCT_BADGES = [
  { label: 'New', value: 'new' },
  { label: 'Best seller', value: 'best-seller' },
  { label: 'WHO-GMP', value: 'who-gmp' },
  { label: 'Export ready', value: 'export-ready' },
  { label: 'Sugar free', value: 'sugar-free' },
  { label: 'Pediatric', value: 'pediatric' },
]

const toOptions = (values: readonly string[]) => values.map((v) => ({ label: v, value: v }))

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Product', plural: 'Products' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'genericName', 'categories', 'dosageForm', '_status', 'updatedAt'],
    group: 'Catalogue',
    listSearchableFields: ['title', 'genericName', 'sku'],
    description:
      'Each product gets its own SEO-optimised page. Assign one or more categories/sub-categories. Prices are optional – they are only shown publicly when "Show prices" is enabled in Site Settings.',
    preview: (doc) => `${process.env.NEXT_PUBLIC_SERVER_URL ?? ''}/products/${doc?.slug}`,
  },
  versions: { drafts: true, maxPerDoc: 20 },
  access: { read: publishedOrStaff, create: isStaff, update: isStaff, delete: isStaff },
  defaultSort: '-updatedAt',
  hooks: revalidateCollection((doc, prev) => {
    const paths = [`/products/${doc.slug}`, '/products', '/']
    if (prev?.slug && prev.slug !== doc.slug) paths.push(`/products/${prev.slug}`)
    return paths
  }, true),
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'Brand / product name, e.g. "Azicin 500".' },
    },
    slugField(),
    {
      name: 'genericName',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description:
          'Generic / INN name, e.g. "Azithromycin". Used in headings, search and structured data.',
      },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      required: true,
      admin: {
        position: 'sidebar',
        sortOptions: 'path',
        description:
          'Pick a sub-category where possible; the product also appears in all parent categories.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show in the home page "Featured products" section.',
      },
    },
    {
      name: 'badges',
      type: 'select',
      hasMany: true,
      options: PRODUCT_BADGES,
      admin: { position: 'sidebar' },
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: { description: 'First image is the primary image. Square images (1:1) look best.' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Details',
          fields: [
            {
              name: 'shortDescription',
              type: 'textarea',
              maxLength: 240,
              required: true,
              admin: {
                description:
                  'One-line summary shown on cards, search results and as the default meta description.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'dosageForm',
                  type: 'select',
                  options: toOptions(DOSAGE_FORMS),
                  admin: { width: '34%' },
                  index: true,
                },
                {
                  name: 'strength',
                  type: 'text',
                  admin: { width: '33%', description: 'e.g. 500 mg' },
                },
                {
                  name: 'prescriptionStatus',
                  type: 'select',
                  defaultValue: 'rx',
                  index: true,
                  options: [
                    { label: 'Prescription only (Rx)', value: 'rx' },
                    { label: 'Over the counter (OTC)', value: 'otc' },
                  ],
                  admin: { width: '33%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'route',
                  type: 'select',
                  options: toOptions(ROUTES_OF_ADMINISTRATION),
                  admin: { width: '34%' },
                },
                {
                  name: 'packSize',
                  type: 'text',
                  admin: { width: '33%', description: 'e.g. 10 x 10 blister' },
                },
                {
                  name: 'packaging',
                  type: 'text',
                  admin: { width: '33%', description: 'e.g. Alu-Alu blister, HDPE bottle' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'shelfLife',
                  type: 'text',
                  admin: { width: '50%', description: 'e.g. 24 months' },
                },
                {
                  name: 'storage',
                  type: 'text',
                  admin: { width: '50%', description: 'e.g. Store below 25°C, protect from light' },
                },
              ],
            },
            {
              name: 'activeIngredients',
              type: 'array',
              admin: {
                description: 'Composition. Published as structured data (schema.org/Drug).',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', type: 'text', required: true, admin: { width: '60%' } },
                    { name: 'strength', type: 'text', admin: { width: '40%' } },
                  ],
                },
              ],
            },
            {
              name: 'therapeuticClass',
              type: 'text',
              admin: { description: 'e.g. Macrolide antibiotic' },
            },
            {
              name: 'specifications',
              type: 'array',
              admin: {
                description: 'Extra key/value rows shown in the specification table.',
                initCollapsed: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', required: true, admin: { width: '40%' } },
                    { name: 'value', type: 'text', required: true, admin: { width: '60%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Description',
          fields: [
            {
              name: 'description',
              type: 'richText',
              admin: { description: 'Full product description.' },
            },
            {
              name: 'indications',
              type: 'richText',
              admin: { description: 'Uses / indications.' },
            },
            {
              name: 'keyBenefits',
              type: 'array',
              admin: { initCollapsed: true },
              fields: [{ name: 'text', type: 'text', required: true }],
            },
            faqsField(),
            {
              name: 'relatedProducts',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
              admin: {
                description:
                  'Hand-picked suggestions. If empty, products from the same category are suggested automatically.',
              },
            },
          ],
        },
        {
          label: 'Pricing & stock',
          description:
            'Optional. Prices are hidden and replaced by "Inquire for pricing" until "Show prices" is switched on in Site Settings (or per product below). Everything here is ready for a future e-commerce checkout.',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'price', type: 'number', min: 0, admin: { width: '34%', step: 0.01 } },
                {
                  name: 'compareAtPrice',
                  type: 'number',
                  min: 0,
                  admin: { width: '33%', step: 0.01, description: 'Strike-through price.' },
                },
                {
                  name: 'priceUnit',
                  type: 'text',
                  admin: { width: '33%', description: 'e.g. per pack, per 100 tablets' },
                },
              ],
            },
            {
              name: 'showPrice',
              type: 'select',
              defaultValue: 'default',
              options: [
                { label: 'Use site setting', value: 'default' },
                { label: 'Always show price', value: 'always' },
                { label: 'Never show price (Inquire for pricing)', value: 'never' },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'sku', type: 'text', index: true, admin: { width: '34%' } },
                {
                  name: 'minOrderQuantity',
                  type: 'number',
                  min: 1,
                  defaultValue: 1,
                  admin: { width: '33%' },
                },
                {
                  name: 'stock',
                  type: 'number',
                  min: 0,
                  admin: { width: '33%', description: 'Leave empty for "made to order".' },
                },
              ],
            },
            {
              name: 'availability',
              type: 'select',
              defaultValue: 'in-stock',
              options: [
                { label: 'In stock', value: 'in-stock' },
                { label: 'Made to order', value: 'made-to-order' },
                { label: 'Pre-order', value: 'pre-order' },
                { label: 'Discontinued', value: 'discontinued' },
              ],
            },
          ],
        },
        seoTab(),
      ],
    },
  ],
}
