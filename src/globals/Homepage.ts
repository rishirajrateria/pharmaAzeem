import type { GlobalConfig } from 'payload'

import { anyone, isStaff } from '@/access'
import { faqsField } from '@/fields/faqs'
import { ctaField } from '@/fields/link'
import { featureCardsField, statsField } from '@/fields/page'
import { seoTab } from '@/fields/seo'
import { revalidateGlobal } from '@/hooks/revalidate'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Home page',
  admin: { group: 'Pages' },
  access: { read: anyone, update: isStaff },
  hooks: revalidateGlobal(['/']),
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            {
              name: 'hero',
              type: 'group',
              fields: [
                { name: 'eyebrow', type: 'text', defaultValue: 'WHO-GMP certified manufacturer & exporter' },
                { name: 'title', type: 'text', required: true, defaultValue: 'Trusted medicines for a healthier world' },
                { name: 'highlight', type: 'text', admin: { description: 'Word(s) from the title to render with a red gradient.' } },
                { name: 'subtitle', type: 'textarea' },
                ctaField('primaryCta', 'Primary button'),
                ctaField('secondaryCta', 'Secondary button'),
                { name: 'image', type: 'upload', relationTo: 'media' },
              ],
            },
            statsField('stats'),
          ],
        },
        {
          label: 'Sections',
          fields: [
            {
              name: 'intro',
              type: 'group',
              label: 'About teaser',
              fields: [
                { name: 'eyebrow', type: 'text' },
                { name: 'heading', type: 'text' },
                { name: 'body', type: 'textarea' },
                { name: 'image', type: 'upload', relationTo: 'media' },
              ],
            },
            featureCardsField('whyUs', 'Why choose us'),
            {
              name: 'globalSection',
              type: 'group',
              label: 'Worldwide operations section',
              fields: [
                { name: 'eyebrow', type: 'text', defaultValue: 'Global presence' },
                { name: 'heading', type: 'text', defaultValue: 'Delivering quality medicines to 40+ countries' },
                { name: 'body', type: 'textarea' },
              ],
            },
            {
              name: 'manufacturingSection',
              type: 'group',
              label: 'Manufacturing section',
              fields: [
                { name: 'eyebrow', type: 'text', defaultValue: 'Manufacturing' },
                { name: 'heading', type: 'text' },
                { name: 'body', type: 'textarea' },
                { name: 'image', type: 'upload', relationTo: 'media' },
                {
                  name: 'bullets',
                  type: 'array',
                  fields: [{ name: 'text', type: 'text', required: true }],
                },
              ],
            },
            {
              name: 'testimonials',
              type: 'array',
              admin: { initCollapsed: true },
              fields: [
                { name: 'quote', type: 'textarea', required: true },
                {
                  type: 'row',
                  fields: [
                    { name: 'author', type: 'text', required: true, admin: { width: '50%' } },
                    { name: 'role', type: 'text', admin: { width: '50%', description: 'e.g. Procurement Head, MedPlus Kenya' } },
                  ],
                },
              ],
            },
            {
              name: 'cta',
              type: 'group',
              label: 'Bottom call-to-action',
              fields: [
                { name: 'heading', type: 'text', defaultValue: 'Looking for a reliable pharmaceutical partner?' },
                { name: 'body', type: 'textarea' },
                ctaField('primaryCta', 'Primary button'),
                ctaField('secondaryCta', 'Secondary button'),
              ],
            },
            faqsField(),
          ],
        },
        seoTab(),
      ],
    },
  ],
}
