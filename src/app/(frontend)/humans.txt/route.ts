import { getPageGlobal, getSiteSettings } from '@/lib/data'
import { siteName } from '@/lib/seo'
import { SITE_URL } from '@/lib/utils'

/** /humans.txt – credits for the people and technology behind the site (https://humanstxt.org). */
export const revalidate = 86400
export const dynamic = 'force-static'

const pad = (lines: string[]) => lines.map((l) => `  ${l}`).join('\n')

export async function GET() {
  const [settings, contactPage] = await Promise.all([
    getSiteSettings().catch(() => null),
    getPageGlobal('contact-page').catch(() => null),
  ])
  const name = siteName(settings)
  const departments = (contactPage?.departments || []).map((d) => d.name.trim()).filter(Boolean)
  const addr = settings?.contact?.address
  const location = [addr?.city, addr?.state, addr?.country].filter(Boolean).join(', ')
  const email = settings?.contact?.email?.replace('@', ' [at] ')
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '/')

  const body = [
    '/* TEAM */',
    pad(
      [
        `Company: ${name}${settings?.legalName && settings.legalName !== name ? ` (${settings.legalName})` : ''}`,
        departments.length ? `Team: ${departments.join(', ')}` : null,
        email ? `Contact: ${email}` : null,
        location ? `Location: ${location}` : null,
      ].filter((l): l is string => Boolean(l)),
    ),
    '',
    '/* THANKS */',
    pad([
      'Our distribution partners, hospitals and regulators in every market we serve.',
      'The open-source communities behind Next.js, React, Payload CMS and Tailwind CSS.',
    ]),
    '',
    '/* SITE */',
    pad([
      `Last update: ${today}`,
      `URL: ${SITE_URL}`,
      'Language: English',
      'Doctype: HTML5',
      'Standards: HTML5, CSS3, WAI-ARIA, Schema.org JSON-LD, Open Graph, sitemaps.org, llms.txt',
      'Machine-readable: /sitemap.xml, /robots.txt, /llms.txt, /llms-full.txt, /manifest.webmanifest',
    ]),
    '',
    '/* TECHNOLOGY */',
    pad([
      'Framework: Next.js 16 (App Router, React Server Components, ISR)',
      'CMS: Payload CMS 3',
      'Styling: Tailwind CSS 4 – "Glass & Crimson" design system',
      'Typography: Geist Sans, Geist Mono',
      'Icons: Lucide',
      'Images: AVIF / WebP via next/image',
      'Rendering: Server-first, minimal client JavaScript',
    ]),
    '',
  ].join('\n')

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      'X-Robots-Tag': 'noindex',
    },
  })
}
