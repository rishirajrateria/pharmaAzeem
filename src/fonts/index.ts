import localFont from 'next/font/local'

/**
 * Self-hosted type system — deliberately not Geist/Inter/Space Grotesk, the
 * default most AI-generated sites reach for. Files live in this folder
 * (downloaded once from Google Fonts' own CDN) so there is zero runtime
 * request to fonts.googleapis.com and next/font still gets to preload,
 * subset and inline the fallback metrics.
 *
 *  - Bricolage Grotesque → display/headings. A variable grotesque with real
 *    idiosyncratic letterforms instead of a "safe" neutral sans.
 *  - Public Sans → body copy. The U.S. federal design system's typeface —
 *    sturdy and legible, which happens to suit a regulated pharma brand.
 *  - IBM Plex Mono → anything that reads as data: SKUs, batch/lot numbers,
 *    specs, route paths, eyebrow labels.
 */
export const display = localFont({
  src: './bricolage-grotesque.woff2',
  variable: '--display-font-raw',
  weight: '200 800',
  display: 'swap',
})

export const body = localFont({
  src: [
    { path: './public-sans.woff2', weight: '400 700', style: 'normal' },
    { path: './public-sans-italic.woff2', weight: '400 700', style: 'italic' },
  ],
  variable: '--body-font-raw',
  display: 'swap',
})

export const dataMono = localFont({
  src: [
    { path: './ibm-plex-mono-400.woff2', weight: '400', style: 'normal' },
    { path: './ibm-plex-mono-500.woff2', weight: '500', style: 'normal' },
    { path: './ibm-plex-mono-600.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--mono-font-raw',
  display: 'swap',
})
