import type { CollectionConfig } from 'payload'

import { anyone, isStaff } from '@/access'
import { revalidateCollection } from '@/hooks/revalidate'

export const Certifications: CollectionConfig = {
  slug: 'certifications',
  labels: { singular: 'License / Certification', plural: 'Licenses & Certifications' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'issuer', 'validUntil', 'featured'],
    group: 'Content',
    description:
      'Manufacturing licenses, GMP certificates, ISO accreditations and product registrations.',
  },
  access: { read: anyone, create: isStaff, update: isStaff, delete: isStaff },
  defaultSort: 'order',
  hooks: revalidateCollection(() => ['/licenses', '/quality', '/manufacturing', '/'], true),
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'e.g. WHO-GMP Certificate' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'certification',
          admin: { width: '50%' },
          options: [
            { label: 'Manufacturing license', value: 'license' },
            { label: 'Certification', value: 'certification' },
            { label: 'Accreditation', value: 'accreditation' },
            { label: 'Product registration', value: 'registration' },
            { label: 'Membership', value: 'membership' },
          ],
        },
        {
          name: 'issuer',
          type: 'text',
          required: true,
          admin: { width: '50%', description: 'Issuing authority / body.' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'certificateNumber', type: 'text', admin: { width: '34%' } },
        {
          name: 'validFrom',
          type: 'date',
          admin: { width: '33%', date: { pickerAppearance: 'dayOnly' } },
        },
        {
          name: 'validUntil',
          type: 'date',
          admin: { width: '33%', date: { pickerAppearance: 'dayOnly' } },
        },
      ],
    },
    { name: 'scope', type: 'textarea', admin: { description: 'What the certificate covers.' } },
    { name: 'description', type: 'richText' },
    {
      type: 'row',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: { width: '50%', description: 'Logo or scanned certificate image.' },
        },
        {
          name: 'document',
          type: 'upload',
          relationTo: 'media',
          admin: { width: '50%', description: 'Optional PDF for download.' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
          admin: { width: '50%', description: 'Show in the trust bar on the home page.' },
        },
        { name: 'order', type: 'number', defaultValue: 0, admin: { width: '50%' } },
      ],
    },
  ],
}
