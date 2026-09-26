import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { anyone, isStaff } from '@/access'
import { faqsField } from '@/fields/faqs'
import { iconOptions } from '@/fields/icons'
import { seoTab } from '@/fields/seo'
import { revalidateCollection } from '@/hooks/revalidate'

/**
 * Computes the hierarchical URL path ("antibiotics/cephalosporins") and depth level so
 * category pages get clean nested URLs and breadcrumbs.
 */
const computePath: CollectionBeforeChangeHook = async ({ data, req, originalDoc }) => {
  const slug = data.slug ?? originalDoc?.slug
  const parentId = typeof data.parent === 'object' && data.parent ? data.parent.id : data.parent
  if (parentId && originalDoc?.id && String(parentId) === String(originalDoc.id)) {
    throw new Error('A category cannot be its own parent.')
  }
  if (parentId) {
    const parent = await req.payload.findByID({ collection: 'categories', id: parentId, depth: 0 })
    data.path = `${parent.path}/${slug}`
    data.level = (parent.level ?? 0) + 1
  } else {
    data.path = slug
    data.level = 0
  }
  return data
}

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Category', plural: 'Categories' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'parent', 'path', 'featured', 'updatedAt'],
    group: 'Catalogue',
    description:
      'Create top-level categories and sub-categories (set a Parent). Each one gets its own page with filters and SEO settings.',
    listSearchableFields: ['title', 'path'],
  },
  access: { read: anyone, create: isStaff, update: isStaff, delete: isStaff },
  defaultSort: 'order',
  hooks: {
    beforeChange: [computePath],
    ...revalidateCollection((doc) => [`/categories/${doc.path}`, '/categories', '/products', '/'], true),
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        position: 'sidebar',
        description: 'Leave empty for a top-level category. Choose a parent to create a sub-category.',
      },
      filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
    },
    {
      name: 'path',
      type: 'text',
      index: true,
      admin: { position: 'sidebar', readOnly: true, description: 'Auto-generated URL path.' },
    },
    { name: 'level', type: 'number', admin: { hidden: true } },
    {
      type: 'row',
      fields: [
        { name: 'featured', type: 'checkbox', defaultValue: false, admin: { width: '50%', description: 'Show on the home page.' } },
        { name: 'order', type: 'number', defaultValue: 0, admin: { width: '50%', description: 'Lower numbers appear first.' } },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'shortDescription',
              type: 'textarea',
              maxLength: 220,
              admin: { description: 'One or two sentences shown on cards and as the default meta description.' },
            },
            {
              name: 'description',
              type: 'richText',
              admin: { description: 'Long-form category description (shown below the product grid – great for SEO).' },
            },
            { name: 'image', type: 'upload', relationTo: 'media' },
            {
              name: 'icon',
              type: 'select',
              admin: { description: 'Icon used on glass cards and the mega menu.' },
              options: iconOptions(),
            },
            {
              name: 'highlights',
              type: 'array',
              admin: { description: 'Short bullet points (e.g. "WHO-GMP certified", "40+ formulations").' },
              fields: [{ name: 'text', type: 'text', required: true }],
            },
            faqsField(),
          ],
        },
        seoTab(),
      ],
    },
  ],
}
