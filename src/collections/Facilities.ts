import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { anyone, isStaff } from '@/access'
import { revalidateCollection } from '@/hooks/revalidate'
import { DOSAGE_FORMS } from './Products'

export const Facilities: CollectionConfig = {
  slug: 'facilities',
  labels: { singular: 'Facility', plural: 'Manufacturing facilities' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'city', 'country', 'order'],
    group: 'Content',
    description: 'Manufacturing plants, R&D centres and warehouses shown on the Manufacturing page.',
  },
  access: { read: anyone, create: isStaff, update: isStaff, delete: isStaff },
  defaultSort: 'order',
  hooks: revalidateCollection(() => ['/manufacturing', '/'], true),
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField({ useAsSlug: 'name' }),
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'formulation',
          admin: { width: '50%' },
          options: [
            { label: 'Formulation plant', value: 'formulation' },
            { label: 'API plant', value: 'api' },
            { label: 'R&D centre', value: 'rnd' },
            { label: 'Quality control laboratory', value: 'qc-lab' },
            { label: 'Warehouse / distribution', value: 'warehouse' },
          ],
        },
        { name: 'order', type: 'number', defaultValue: 0, admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'city', type: 'text', admin: { width: '50%' } },
        { name: 'country', type: 'text', admin: { width: '50%' } },
      ],
    },
    { name: 'address', type: 'text' },
    { name: 'summary', type: 'textarea' },
    { name: 'description', type: 'richText' },
    {
      name: 'dosageForms',
      type: 'select',
      hasMany: true,
      options: DOSAGE_FORMS.map((v) => ({ label: v, value: v })),
      admin: { description: 'Dosage forms manufactured here.' },
    },
    {
      name: 'capabilities',
      type: 'array',
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'capacity',
      type: 'array',
      admin: { description: 'Key numbers, e.g. "Tablets" – "2 billion / year".' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', required: true, admin: { width: '50%' } },
            { name: 'value', type: 'text', required: true, admin: { width: '50%' } },
          ],
        },
      ],
    },
    { name: 'certifications', type: 'relationship', relationTo: 'certifications', hasMany: true },
    { name: 'images', type: 'upload', relationTo: 'media', hasMany: true },
    { name: 'areaSqm', type: 'number', admin: { description: 'Built-up area in m².' } },
    { name: 'establishedYear', type: 'number' },
  ],
}
