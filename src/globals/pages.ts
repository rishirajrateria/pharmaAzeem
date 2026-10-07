import type { Field, GlobalConfig } from 'payload'

import { anyone, isStaff } from '@/access'
import { faqsField } from '@/fields/faqs'
import { featureCardsField, heroFields, sectionsField, statsField, stepsField } from '@/fields/page'
import { seoTab } from '@/fields/seo'
import { revalidateGlobal } from '@/hooks/revalidate'

type PageArgs = {
  slug: string
  label: string
  path: string
  extraFields?: Field[]
  defaults?: { title: string; eyebrow?: string }
}

/**
 * Factory for editable site pages: every page has a hero, free-form sections,
 * FAQs and its own SEO tab. Page-specific extras are appended.
 */
const pageGlobal = ({ slug, label, path, extraFields = [], defaults }: PageArgs): GlobalConfig => {
  const hero = heroFields(defaults)
  return {
    slug,
    label,
    admin: { group: 'Pages' },
    access: { read: anyone, update: isStaff },
    hooks: revalidateGlobal([path]),
    fields: [
      {
        type: 'tabs',
        tabs: [
          {
            label: 'Content',
            fields: [
              hero,
              { name: 'intro', type: 'richText', admin: { description: 'Opening paragraph(s).' } },
              ...extraFields,
              sectionsField(),
              faqsField(),
            ],
          },
          seoTab(),
        ],
      },
    ],
  }
}

export const AboutPage = pageGlobal({
  slug: 'about-page',
  label: 'About page',
  path: '/about',
  defaults: { title: 'About Pharmadent Remedies', eyebrow: 'About us' },
  extraFields: [
    statsField('stats'),
    {
      name: 'mission',
      type: 'group',
      fields: [
        { name: 'mission', type: 'textarea' },
        { name: 'vision', type: 'textarea' },
      ],
    },
    featureCardsField('values', 'Core values'),
    {
      name: 'milestones',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'year', type: 'text', required: true, admin: { width: '25%' } },
            { name: 'title', type: 'text', required: true, admin: { width: '75%' } },
          ],
        },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'leadership',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
            { name: 'role', type: 'text', required: true, admin: { width: '50%' } },
          ],
        },
        { name: 'bio', type: 'textarea' },
        { name: 'photo', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
})

export const QualityPage = pageGlobal({
  slug: 'quality-page',
  label: 'Quality page',
  path: '/quality',
  defaults: { title: 'Quality assurance you can trust', eyebrow: 'Quality' },
  extraFields: [
    statsField('stats'),
    featureCardsField('pillars', 'Quality pillars'),
    stepsField('process', 'Quality control process'),
    {
      name: 'standards',
      type: 'array',
      label: 'Standards & guidelines followed',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', required: true, admin: { width: '40%' } },
            { name: 'description', type: 'text', admin: { width: '60%' } },
          ],
        },
      ],
    },
  ],
})

export const ManufacturingPage = pageGlobal({
  slug: 'manufacturing-page',
  label: 'Manufacturing page',
  path: '/manufacturing',
  defaults: { title: 'World-class manufacturing infrastructure', eyebrow: 'Manufacturing' },
  extraFields: [
    statsField('stats'),
    featureCardsField('capabilities', 'Capabilities'),
    stepsField('process', 'Manufacturing process'),
    {
      name: 'contractManufacturing',
      type: 'group',
      label: 'Contract / third-party manufacturing',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'body', type: 'textarea' },
        {
          name: 'bullets',
          type: 'array',
          fields: [{ name: 'text', type: 'text', required: true }],
        },
      ],
    },
  ],
})

export const GlobalPresencePage = pageGlobal({
  slug: 'global-presence-page',
  label: 'Global presence page',
  path: '/global-presence',
  defaults: { title: 'Serving healthcare partners worldwide', eyebrow: 'Global presence' },
  extraFields: [
    statsField('stats'),
    featureCardsField('exportServices', 'Export services'),
    stepsField('process', 'How we onboard a new market'),
  ],
})

export const LicensesPage = pageGlobal({
  slug: 'licenses-page',
  label: 'Licenses page',
  path: '/licenses',
  defaults: { title: 'Licenses, certifications & accreditations', eyebrow: 'Compliance' },
})

export const ContactPage = pageGlobal({
  slug: 'contact-page',
  label: 'Contact page',
  path: '/contact',
  defaults: { title: 'Get in touch with our team', eyebrow: 'Contact' },
  extraFields: [
    {
      name: 'departments',
      type: 'array',
      admin: {
        initCollapsed: true,
        description: 'Extra contact points (Exports, Regulatory, HR…).',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', required: true, admin: { width: '34%' } },
            { name: 'email', type: 'email', admin: { width: '33%' } },
            { name: 'phone', type: 'text', admin: { width: '33%' } },
          ],
        },
      ],
    },
    {
      name: 'formSuccessMessage',
      type: 'textarea',
      defaultValue: 'Thank you! Our team will get back to you within one business day.',
    },
  ],
})

export const ProductsPage = pageGlobal({
  slug: 'products-page',
  label: 'Products (catalogue) page',
  path: '/products',
  defaults: { title: 'Pharmaceutical product catalogue', eyebrow: 'Products' },
})

export const InquiryPage = pageGlobal({
  slug: 'inquiry-page',
  label: 'Inquiry page',
  path: '/inquiry',
  defaults: { title: 'Request a quotation', eyebrow: 'Inquiry' },
  extraFields: [
    {
      name: 'formSuccessMessage',
      type: 'textarea',
      defaultValue: 'Your inquiry has been received. We will send you a quotation shortly.',
    },
  ],
})
