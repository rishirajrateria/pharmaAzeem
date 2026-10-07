import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

import { getSiteSettings } from '@/lib/data'
import { siteName } from '@/lib/seo'
import { SITE_URL } from '@/lib/utils'

/**
 * /og?title=…&subtitle=…&eyebrow=… – flat, branded 1200×630 Open Graph card
 * (white canvas, brand-red top bar, logo, title block, host footer).
 * Used automatically by buildMetadata() for every page without its own social image.
 * Fonts are read from the installed `geist` package and the logo from `public/brand`
 * (no network fetch – this route runs on the Node.js runtime); if either is unavailable
 * the renderer's built-in font / a text wordmark is used instead.
 *
 * Each asset path is a single literal `path.join(process.cwd(), …)` expression – the
 * form the bundler's file tracing understands – so exactly these files ship with a
 * standalone/serverless build (a path assembled from variables degrades the trace to
 * the whole directory or nothing at all).
 */
export const runtime = 'nodejs'

const WIDTH = 1200
const HEIGHT = 630
const MAX_TITLE = 110
const MAX_SUBTITLE = 150
const MAX_EYEBROW = 40

const BRAND_RED = '#af0201'
const INK = '#0b0a0f'
const FONT_STACK = 'Geist, "Segoe UI", Helvetica, Arial, sans-serif'
const FOOTER_LINE = 'WHO-GMP certified manufacturer & exporter'
/** Source PNG is 960×252; rendered at a third of that. */
const LOGO_WIDTH = 320
const LOGO_HEIGHT = 84

type FontSet = { name: string; data: ArrayBuffer; weight: 400 | 600; style: 'normal' }[]
let fontsPromise: Promise<FontSet | undefined> | undefined

const loadFonts = () => {
  if (!fontsPromise) {
    fontsPromise = (async () => {
      try {
        const toBuffer = (b: Buffer) =>
          b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer
        const [semi, regular] = await Promise.all([
          readFile(
            path.join(
              process.cwd(),
              'node_modules',
              'geist',
              'dist',
              'fonts',
              'geist-sans',
              'Geist-SemiBold.ttf',
            ),
          ),
          readFile(
            path.join(
              process.cwd(),
              'node_modules',
              'geist',
              'dist',
              'fonts',
              'geist-sans',
              'Geist-Regular.ttf',
            ),
          ),
        ])
        return [
          { name: 'Geist', data: toBuffer(semi), weight: 600, style: 'normal' },
          { name: 'Geist', data: toBuffer(regular), weight: 400, style: 'normal' },
        ] satisfies FontSet
      } catch {
        return undefined
      }
    })()
  }
  return fontsPromise
}

let logoPromise: Promise<string | undefined> | undefined

/** Brand logo (red wordmark, transparent PNG) as a data URL, read once per process. */
const loadLogo = () => {
  if (!logoPromise) {
    logoPromise = readFile(path.join(process.cwd(), 'public/brand/pharmadent-logo.png'))
      .then((b) => `data:image/png;base64,${b.toString('base64')}`)
      .catch(() => undefined)
  }
  return logoPromise
}

/** Strip control characters and collapse whitespace; hard-cap the length. */
const sanitize = (value: string | null, max: number) => {
  const clean = (value || '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, '')}…`
}

/** Title size scales with length so short titles feel bold and long ones still fit in three lines. */
const titleSize = (t: string) =>
  t.length <= 24 ? 92 : t.length <= 40 ? 78 : t.length <= 60 ? 66 : t.length <= 84 ? 56 : 48

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const [settings, fonts, logo] = await Promise.all([
    getSiteSettings().catch(() => null),
    loadFonts(),
    loadLogo(),
  ])
  const name = siteName(settings)
  const tagline = sanitize(settings?.tagline || null, 48) || 'Quality medicines, worldwide'
  const title =
    sanitize(params.get('title'), MAX_TITLE) ||
    sanitize(settings?.seo?.defaultTitle || null, MAX_TITLE) ||
    name
  const subtitle =
    sanitize(params.get('subtitle'), MAX_SUBTITLE) ||
    (title === name
      ? sanitize(
          settings?.seo?.defaultDescription || settings?.shortDescription || null,
          MAX_SUBTITLE,
        )
      : '')
  const eyebrow = sanitize(params.get('eyebrow'), MAX_EYEBROW) || tagline
  const host = SITE_URL.replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '')
  const size = titleSize(title)

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        fontFamily: FONT_STACK,
        color: INK,
      }}
    >
      {/* Brand bar */}
      <div style={{ display: 'flex', width: '100%', height: 12, backgroundColor: BRAND_RED }} />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          padding: '52px 72px 0 72px',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', height: LOGO_HEIGHT, alignItems: 'center' }}>
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
            <img src={logo} width={LOGO_WIDTH} height={LOGO_HEIGHT} />
          ) : (
            <div style={{ fontSize: 44, fontWeight: 600, color: BRAND_RED }}>{name}</div>
          )}
        </div>

        {/* Eyebrow + title + subtitle */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            justifyContent: 'center',
            paddingBottom: 12,
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: BRAND_RED,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 18,
              fontSize: size,
              fontWeight: 600,
              lineHeight: 1.08,
              letterSpacing: -size * 0.02,
              color: INK,
              lineClamp: 3,
              maxWidth: 1040,
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                display: 'flex',
                marginTop: 20,
                fontSize: 27,
                fontWeight: 400,
                lineHeight: 1.4,
                color: '#52525b',
                lineClamp: 2,
                maxWidth: 980,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 88,
            borderTop: '1px solid #e4e4e7',
            fontSize: 20,
            fontWeight: 400,
            color: '#71717a',
          }}
        >
          <div style={{ display: 'flex' }}>{host}</div>
          <div style={{ display: 'flex' }}>{FOOTER_LINE}</div>
        </div>
      </div>
    </div>,
    {
      width: WIDTH,
      height: HEIGHT,
      fonts,
      headers: {
        'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable',
        'X-Robots-Tag': 'noindex',
      },
    },
  )
}
