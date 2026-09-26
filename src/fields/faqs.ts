import type { ArrayField } from 'payload'

/** FAQ list. Rendered as an accordion and emitted as FAQPage JSON-LD (great for Google + LLM answers). */
export const faqsField = (overrides: Partial<ArrayField> = {}): ArrayField => ({
  name: 'faqs',
  label: 'FAQs',
  type: 'array',
  admin: {
    description:
      'Frequently asked questions. These are shown on the page and published as FAQ structured data so search engines and AI assistants can quote them.',
    initCollapsed: true,
  },
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'textarea', required: true },
  ],
  ...overrides,
})
