import type { Field } from 'payload'

import { iconOptions } from './icons'
import { ctaField } from './link'

/**
 * Shared "hero" block used at the top of every site page.
 */
export const heroFields = (defaults?: { title?: string; eyebrow?: string }): Field => ({
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: defaults?.eyebrow,
      admin: { description: 'Small label above the title, e.g. "About us".' },
    },
    { name: 'title', type: 'text', required: true, defaultValue: defaults?.title },
    { name: 'subtitle', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    ctaField('primaryCta', 'Primary button'),
    ctaField('secondaryCta', 'Secondary button'),
  ],
})

/**
 * Flexible content sections: heading + rich text + optional image, alternating layout.
 */
export const sectionsField = (): Field => ({
  name: 'sections',
  type: 'array',
  admin: { initCollapsed: true },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'richText' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'imageRight',
      options: [
        { label: 'Image right', value: 'imageRight' },
        { label: 'Image left', value: 'imageLeft' },
        { label: 'Full width (no image)', value: 'full' },
      ],
    },
    {
      name: 'bullets',
      type: 'array',
      fields: [{ name: 'text', type: 'text', required: true }],
    },
  ],
})

/** Simple stat counters (e.g. "40+ countries"). */
export const statsField = (name = 'stats'): Field => ({
  name,
  type: 'array',
  admin: { initCollapsed: true },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'value', type: 'text', required: true, admin: { width: '33%', description: 'e.g. 40' } },
        { name: 'suffix', type: 'text', admin: { width: '33%', description: 'e.g. + or %' } },
        { name: 'label', type: 'text', required: true, admin: { width: '34%' } },
      ],
    },
  ],
})

/** Icon + title + description cards ("Why choose us", "Quality pillars"...). */
export const featureCardsField = (name: string, label?: string): Field => ({
  name,
  label,
  type: 'array',
  admin: { initCollapsed: true },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'title', type: 'text', required: true, admin: { width: '60%' } },
        {
          name: 'icon',
          type: 'select',
          admin: { width: '40%' },
          options: iconOptions(),
        },
      ],
    },
    { name: 'description', type: 'textarea' },
  ],
})

/** Numbered process steps. */
export const stepsField = (name: string, label?: string): Field => ({
  name,
  label,
  type: 'array',
  admin: { initCollapsed: true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
  ],
})
