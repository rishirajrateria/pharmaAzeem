import localFont from 'next/font/local'

/**
 * Public Sans – one plain, highly legible sans-serif for the whole site (headings, body,
 * labels and data). Self-hosted so there is no runtime request to Google Fonts.
 */
export const body = localFont({
  src: [
    { path: './public-sans.woff2', weight: '400 700', style: 'normal' },
    { path: './public-sans-italic.woff2', weight: '400 700', style: 'italic' },
  ],
  variable: '--body-font-raw',
  display: 'swap',
})
