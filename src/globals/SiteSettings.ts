import type { GlobalConfig } from 'payload'

import { anyone, isAdmin } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Administration',
    description: 'Company details, contact info, commerce mode and default SEO.',
  },
  access: { read: anyone, update: isAdmin },
  hooks: revalidateGlobal(['/']),
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Company',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'siteName',
                  type: 'text',
                  required: true,
                  defaultValue: 'Azeem Pharmaceuticals',
                  admin: { width: '50%' },
                },
                {
                  name: 'legalName',
                  type: 'text',
                  admin: { width: '50%', description: 'Registered company name.' },
                },
              ],
            },
            {
              name: 'tagline',
              type: 'text',
              admin: { description: 'Short brand line used in titles and the footer.' },
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              admin: {
                description:
                  'One paragraph about the company – used as the default meta description and in structured data.',
              },
            },
            {
              type: 'row',
              fields: [
                { name: 'logo', type: 'upload', relationTo: 'media', admin: { width: '50%' } },
                { name: 'foundingYear', type: 'number', admin: { width: '25%' } },
                {
                  name: 'employeeCount',
                  type: 'text',
                  admin: { width: '25%', description: 'e.g. 250+' },
                },
              ],
            },
            {
              name: 'announcement',
              type: 'group',
              fields: [
                { name: 'enabled', type: 'checkbox', defaultValue: false },
                { name: 'text', type: 'text' },
                { name: 'url', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Contact',
          name: 'contact',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'email', type: 'email', admin: { width: '50%' } },
                {
                  name: 'inquiryEmail',
                  type: 'email',
                  admin: {
                    width: '50%',
                    description: 'Where new inquiries are emailed (defaults to the main email).',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'phone', type: 'text', admin: { width: '50%' } },
                {
                  name: 'whatsapp',
                  type: 'text',
                  admin: {
                    width: '50%',
                    description: 'International format, digits only e.g. 919876543210',
                  },
                },
              ],
            },
            {
              name: 'address',
              type: 'group',
              fields: [
                { name: 'street', type: 'text' },
                {
                  type: 'row',
                  fields: [
                    { name: 'city', type: 'text', admin: { width: '34%' } },
                    { name: 'state', type: 'text', admin: { width: '33%' } },
                    { name: 'postalCode', type: 'text', admin: { width: '33%' } },
                  ],
                },
                { name: 'country', type: 'text' },
              ],
            },
            {
              name: 'businessHours',
              type: 'text',
              admin: { description: 'e.g. Mon–Sat, 9:00–18:00 IST' },
            },
            {
              name: 'mapEmbedUrl',
              type: 'text',
              admin: { description: 'Google Maps embed URL (optional).' },
            },
            {
              name: 'socials',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'platform',
                      type: 'select',
                      required: true,
                      admin: { width: '40%' },
                      options: [
                        'linkedin',
                        'facebook',
                        'instagram',
                        'x',
                        'youtube',
                        'whatsapp',
                      ].map((v) => ({ label: v, value: v })),
                    },
                    { name: 'url', type: 'text', required: true, admin: { width: '60%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Commerce',
          name: 'commerce',
          description:
            'The website runs in "Inquiry" mode: visitors add products to an inquiry list and request a quote. Switch labels and price visibility here without touching code.',
          fields: [
            {
              name: 'mode',
              type: 'select',
              defaultValue: 'inquiry',
              options: [
                { label: 'Inquiry (request a quote – no checkout)', value: 'inquiry' },
                { label: 'E-commerce (cart + checkout) – future', value: 'ecommerce' },
              ],
            },
            {
              name: 'showPrices',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description:
                  'When enabled, products that have a price show it instead of "Inquire for pricing".',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'currency',
                  type: 'select',
                  defaultValue: 'USD',
                  admin: { width: '50%' },
                  options: [
                    'USD',
                    'EUR',
                    'GBP',
                    'INR',
                    'AED',
                    'SAR',
                    'PKR',
                    'BDT',
                    'NGN',
                    'KES',
                    'ZAR',
                    'BRL',
                  ].map((v) => ({ label: v, value: v })),
                },
                {
                  name: 'priceFallbackLabel',
                  type: 'text',
                  defaultValue: 'Inquire for pricing',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'listName',
                  type: 'text',
                  defaultValue: 'Inquiry list',
                  admin: { width: '33%' },
                },
                {
                  name: 'addLabel',
                  type: 'text',
                  defaultValue: 'Add to inquiry list',
                  admin: { width: '33%' },
                },
                {
                  name: 'ctaLabel',
                  type: 'text',
                  defaultValue: 'Inquire now',
                  admin: { width: '34%' },
                },
              ],
            },
          ],
        },
        {
          label: 'SEO defaults',
          name: 'seo',
          fields: [
            {
              name: 'titleTemplate',
              type: 'text',
              defaultValue: '%s | Azeem Pharmaceuticals',
              admin: { description: '%s is replaced with the page title.' },
            },
            { name: 'defaultTitle', type: 'text' },
            { name: 'defaultDescription', type: 'textarea' },
            {
              name: 'defaultImage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Default social sharing image (1200×630).' },
            },
            {
              type: 'row',
              fields: [
                { name: 'twitterHandle', type: 'text', admin: { width: '50%' } },
                { name: 'googleSiteVerification', type: 'text', admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'bingSiteVerification', type: 'text', admin: { width: '50%' } },
                {
                  name: 'gaMeasurementId',
                  type: 'text',
                  admin: { width: '50%', description: 'Google Analytics 4 ID (G-XXXX). Optional.' },
                },
              ],
            },
            {
              name: 'sameAs',
              type: 'array',
              admin: {
                description:
                  'Other official profiles (LinkedIn, Wikipedia, Crunchbase…) – strengthens the knowledge graph.',
              },
              fields: [{ name: 'url', type: 'text', required: true }],
            },
            {
              name: 'knowsAbout',
              type: 'array',
              admin: {
                description:
                  'Topics of expertise for structured data, e.g. "Generic pharmaceuticals", "Contract manufacturing".',
              },
              fields: [{ name: 'topic', type: 'text', required: true }],
            },
          ],
        },
      ],
    },
  ],
}
