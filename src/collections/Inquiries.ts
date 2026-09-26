import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'

import { anyone, isStaff } from '@/access'

/** Email the sales inbox when a new inquiry arrives (works with any configured email adapter). */
const notifySales: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc
  try {
    const settings = await req.payload.findGlobal({ slug: 'site-settings', depth: 0 })
    const to = settings?.contact?.inquiryEmail || settings?.contact?.email
    if (!to) return doc
    const items = (doc.items || [])
      .map(
        (i: { productName?: string; quantity?: number }) =>
          `• ${i.productName ?? 'Product'} × ${i.quantity ?? 1}`,
      )
      .join('\n')
    await req.payload.sendEmail({
      to,
      subject: `New inquiry from ${doc.name}${doc.company ? ` (${doc.company})` : ''}`,
      text: `Name: ${doc.name}\nEmail: ${doc.email}\nPhone: ${doc.phone ?? '-'}\nCompany: ${doc.company ?? '-'}\nCountry: ${doc.country ?? '-'}\n\nProducts:\n${items || '-'}\n\nMessage:\n${doc.message ?? '-'}`,
    })
  } catch (err) {
    req.payload.logger.warn(`Inquiry email failed: ${(err as Error).message}`)
  }
  return doc
}

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: { singular: 'Inquiry', plural: 'Inquiries' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'company', 'country', 'status', 'createdAt'],
    group: 'Sales',
    description:
      'Quote requests submitted from the website (inquiry list, product pages and contact form).',
  },
  access: { create: anyone, read: isStaff, update: isStaff, delete: isStaff },
  defaultSort: '-createdAt',
  hooks: { afterChange: [notifySales] },
  fields: [
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      admin: { position: 'sidebar' },
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Quoted', value: 'quoted' },
        { label: 'Won', value: 'won' },
        { label: 'Closed', value: 'closed' },
      ],
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'inquiry-list',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Inquiry list', value: 'inquiry-list' },
        { label: 'Product page', value: 'product-page' },
        { label: 'Contact form', value: 'contact-form' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'email', type: 'email', required: true, admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text', admin: { width: '34%' } },
        { name: 'company', type: 'text', admin: { width: '33%' } },
        { name: 'country', type: 'text', admin: { width: '33%' } },
      ],
    },
    { name: 'message', type: 'textarea' },
    {
      name: 'items',
      type: 'array',
      admin: { description: 'Products the customer is interested in.' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'product',
              type: 'relationship',
              relationTo: 'products',
              admin: { width: '50%' },
            },
            { name: 'productName', type: 'text', admin: { width: '30%' } },
            { name: 'quantity', type: 'number', min: 1, defaultValue: 1, admin: { width: '20%' } },
          ],
        },
      ],
    },
    {
      name: 'adminNotes',
      type: 'textarea',
      admin: { description: 'Internal notes – never shown publicly.' },
    },
    {
      name: 'pageUrl',
      type: 'text',
      admin: { readOnly: true, description: 'Page the inquiry was sent from.' },
    },
  ],
}
