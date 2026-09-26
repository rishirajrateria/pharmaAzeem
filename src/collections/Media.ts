import type { CollectionConfig } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import { anyone, isStaff } from '@/access'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Content', description: 'Images and documents used across the website.' },
  access: { read: anyone, create: isStaff, update: isStaff, delete: isStaff },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Describe the image for accessibility and image SEO.' },
    },
    { name: 'caption', type: 'text' },
  ],
  upload: {
    staticDir: path.resolve(dirname, '../../media'),
    mimeTypes: ['image/*', 'application/pdf'],
    focalPoint: true,
    formatOptions: { format: 'webp', options: { quality: 82 } },
    adminThumbnail: 'thumbnail',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 320,
        height: 320,
        fit: 'inside',
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'card',
        width: 720,
        fit: 'inside',
        formatOptions: { format: 'webp', options: { quality: 82 } },
      },
      {
        name: 'large',
        width: 1400,
        fit: 'inside',
        formatOptions: { format: 'webp', options: { quality: 82 } },
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        fit: 'cover',
        formatOptions: { format: 'jpeg', options: { quality: 82 } },
      },
    ],
  },
}
