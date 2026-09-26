import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { anyone, isStaff } from '@/access'
import { faqsField } from '@/fields/faqs'
import { seoTab } from '@/fields/seo'
import { revalidateCollection } from '@/hooks/revalidate'

export const REGIONS = [
  { label: 'Africa', value: 'africa' },
  { label: 'Middle East', value: 'middle-east' },
  { label: 'South Asia', value: 'south-asia' },
  { label: 'South-East Asia', value: 'south-east-asia' },
  { label: 'East Asia & Pacific', value: 'east-asia-pacific' },
  { label: 'CIS & Central Asia', value: 'cis' },
  { label: 'Europe', value: 'europe' },
  { label: 'Latin America & Caribbean', value: 'latin-america' },
  { label: 'North America', value: 'north-america' },
]

export const Countries: CollectionConfig = {
  slug: 'countries',
  labels: { singular: 'Country', plural: 'Countries (Global presence)' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'region', 'served', 'featured', 'updatedAt'],
    group: 'Content',
    description:
      'Every country you export to gets a dedicated landing page (/global-presence/<country>) that can rank for "pharmaceutical supplier in <country>" searches.',
    listSearchableFields: ['name', 'isoCode'],
  },
  access: { read: anyone, create: isStaff, update: isStaff, delete: isStaff },
  defaultSort: 'name',
  hooks: revalidateCollection((doc) => [`/global-presence/${doc.slug}`, '/global-presence', '/']),
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField({ useAsSlug: 'name' }),
    {
      type: 'row',
      fields: [
        { name: 'isoCode', type: 'text', required: true, maxLength: 2, admin: { width: '25%', description: 'ISO 3166-1 alpha-2, e.g. KE' } },
        { name: 'flag', type: 'text', admin: { width: '25%', description: 'Emoji flag 🇰🇪' } },
        { name: 'region', type: 'select', options: REGIONS, required: true, admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'served', type: 'checkbox', defaultValue: true, admin: { width: '33%', description: 'Currently exporting here.' } },
        { name: 'featured', type: 'checkbox', defaultValue: false, admin: { width: '33%', description: 'Highlight on the home page map.' } },
        { name: 'sinceYear', type: 'number', admin: { width: '34%', description: 'First year of operations.' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'lat', type: 'number', admin: { width: '50%', description: 'Latitude for the map pin.' } },
        { name: 'lng', type: 'number', admin: { width: '50%', description: 'Longitude for the map pin.' } },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'regulatoryAuthority',
              type: 'text',
              admin: { description: 'National medicines regulator, e.g. "Pharmacy and Poisons Board (PPB)".' },
            },
            {
              name: 'summary',
              type: 'textarea',
              admin: { description: 'Short paragraph shown on cards and used as the default meta description.' },
            },
            { name: 'description', type: 'richText', admin: { description: 'Country page body: registration support, logistics, partnerships…' } },
            {
              name: 'highlights',
              type: 'array',
              fields: [{ name: 'text', type: 'text', required: true }],
            },
            {
              name: 'popularCategories',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
              admin: { description: 'Categories in demand in this market.' },
            },
            {
              name: 'popularProducts',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
            },
            { name: 'image', type: 'upload', relationTo: 'media' },
            faqsField(),
          ],
        },
        seoTab(),
      ],
    },
  ],
}
