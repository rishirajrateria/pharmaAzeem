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
    theme_color: '#e11d2e',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  }
}
