import type { GroupField } from 'payload'

export const ctaField = (name: string, label?: string): GroupField => ({
  name,
  label: label ?? name,
  type: 'group',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'label', type: 'text', admin: { width: '50%' } },
        {
          name: 'url',
          type: 'text',
          admin: { width: '50%', description: 'Relative (/products) or absolute URL.' },
        },
      ],
    },
  ],
})
