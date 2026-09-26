import type { Tab } from 'payload'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

/**
 * A reusable "SEO" tab. Every category, sub-category, product, country page and
 * site page gets its own independently editable title / description / image /
 * keywords / canonical / robots settings.
 */
export const seoTab = (): Tab => ({
  name: 'meta',
  label: 'SEO',
  fields: [
    OverviewField({
      titlePath: 'meta.title',
      descriptionPath: 'meta.description',
      imagePath: 'meta.image',
    }),
    MetaTitleField({ hasGenerateFn: true }),
    MetaDescriptionField({ hasGenerateFn: true }),
    MetaImageField({ relationTo: 'media', hasGenerateFn: true }),
    {
      name: 'keywords',
      type: 'text',
      admin: {
        description:
          'Comma-separated focus keywords. Used for the meta keywords tag, llms.txt and internal search.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'canonicalUrl',
          type: 'text',
          admin: {
            description:
              'Optional. Override the canonical URL (absolute). Leave blank to use the page URL.',
            width: '70%',
          },
        },
        {
          name: 'noIndex',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Hide from search engines.', width: '30%' },
        },
      ],
    },
    PreviewField({
      hasGenerateFn: true,
      titlePath: 'meta.title',
      descriptionPath: 'meta.description',
    }),
  ],
})
