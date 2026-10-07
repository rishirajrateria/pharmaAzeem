import type { MetadataRoute } from 'next'

import { getSiteSettings } from '@/lib/data'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSiteSettings()
  return {
    name: settings.siteName,
    short_name: settings.siteName.split(' ')[0],
    description: settings.shortDescription || undefined,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#af0201',
    icons: [
      { src: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
