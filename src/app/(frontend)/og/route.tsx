import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

import { getSiteSettings } from '@/lib/data'
import { siteName } from '@/lib/seo'
import { SITE_URL } from '@/lib/utils'

/**
 * /og?title=…&subtitle=…&eyebrow=… – branded 1200×630 Open Graph card.
 * Used automatically by buildMetadata() for every page without its own social image.
 * Fonts are read from the installed `geist` package (no network fetch); if they are
 * unavailable the renderer's built-in font is used instead.
 */
export const runtime = 'nodejs'

const WIDTH = 1200
const HEIGHT = 630
const MAX_TITLE = 110
const MAX_SUBTITLE = 150
const MAX_EYEBROW = 40

type FontSet = { name: string; data: ArrayBuffer; weight: 400 | 500 | 600; style: 'normal' }[]
let fontsPromise: Promise<FontSet | undefined> | undefined

const loadFonts = () => {
  if (!fontsPromise) {
    fontsPromise = (async () => {
      try {
        const dir = path.join(process.cwd(), 'node_modules', 'geist', 'dist', 'fonts')
        const toBuffer = (b: Buffer) => b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer
        const [semi, regular, mono] = await Promise.all([
          readFile(path.join(dir, 'geist-sans', 'Geist-SemiBold.ttf')),
          readFile(path.join(dir, 'geist-sans', 'Geist-Regular.ttf')),
          readFile(path.join(dir, 'geist-mono', 'GeistMono-Medium.ttf')),
        ])
        return [
          { name: 'Geist', data: toBuffer(semi), weight: 600, style: 'normal' },
          { name: 'Geist', data: toBuffer(regular), weight: 400, style: 'normal' },
          { name: 'Geist Mono', data: toBuffer(mono), weight: 500, style: 'normal' },
        ] satisfies FontSet
      } catch {
        return undefined
      }
    })()
  }
  return fontsPromise
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
const titleSize = (t: string) => (t.length <= 24 ? 92 : t.length <= 40 ? 78 : t.length <= 60 ? 66 : t.length <= 84 ? 56 : 48)

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const [settings, fonts] = await Promise.all([getSiteSettings().catch(() => null), loadFonts()])
  const name = siteName(settings)
  const tagline = sanitize(settings?.tagline || null, 48) || 'Quality medicines, worldwide'
  const title = sanitize(params.get('title'), MAX_TITLE) || sanitize(settings?.seo?.defaultTitle || null, MAX_TITLE) || name
  const subtitle = sanitize(params.get('subtitle'), MAX_SUBTITLE) || (title === name ? sanitize(settings?.seo?.defaultDescription || settings?.shortDescription || null, MAX_SUBTITLE) : '')
  const eyebrow = sanitize(params.get('eyebrow'), MAX_EYEBROW) || tagline
  const host = SITE_URL.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '')
  const size = titleSize(title)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          backgroundColor: '#ffffff',
          backgroundImage: 'linear-gradient(180deg, #ffffff 0%, #fff7f8 100%)',
          fontFamily: 'Geist, "Segoe UI", Helvetica, Arial, sans-serif',
          color: '#0b0a0f',
          overflow: 'hidden',
        }}
      >
        {/* Ambient red / pink orbs */}
        <div style={{ position: 'absolute', left: -220, top: -280, width: 780, height: 780, borderRadius: 9999, backgroundImage: 'radial-gradient(closest-side, rgba(255,102,117,0.38), rgba(255,102,117,0))' }} />
        <div style={{ position: 'absolute', right: -240, top: -140, width: 680, height: 680, borderRadius: 9999, backgroundImage: 'radial-gradient(closest-side, rgba(225,29,46,0.24), rgba(225,29,46,0))' }} />
        <div style={{ position: 'absolute', left: 420, bottom: -420, width: 760, height: 760, borderRadius: 9999, backgroundImage: 'radial-gradient(closest-side, rgba(255,199,205,0.7), rgba(255,199,205,0))' }} />
        {/* Dot grid texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(225,29,46,0.14) 1.6px, rgba(225,29,46,0) 1.6px)', backgroundSize: '26px 26px', opacity: 0.8 }} />
        {/* Corner HUD rings */}
        <div style={{ position: 'absolute', right: -160, top: 90, width: 520, height: 520, borderRadius: 9999, border: '1.5px dashed rgba(255,157,168,0.55)' }} />
        <div style={{ position: 'absolute', right: -80, top: 170, width: 360, height: 360, borderRadius: 9999, border: '1.5px solid rgba(255,199,205,0.8)' }} />
        <div style={{ position: 'absolute', right: 98, top: 168, width: 16, height: 16, borderRadius: 9999, backgroundColor: '#e11d2e', boxShadow: '0 0 0 8px rgba(225,29,46,0.14)' }} />

        {/* Glass panel */}
        <div
          style={{
            position: 'absolute',
            inset: 40,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '56px 64px',
            borderRadius: 40,
            backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.82), rgba(255,255,255,0.52))',
            border: '1.5px solid rgba(255,255,255,0.95)',
            boxShadow: '0 30px 80px -24px rgba(225,29,46,0.22), 0 6px 20px -8px rgba(11,10,15,0.08)',
          }}
        >
          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: 9999, backgroundColor: '#e11d2e', boxShadow: '0 0 0 5px rgba(225,29,46,0.15)' }} />
            <div style={{ fontFamily: '"Geist Mono", Menlo, monospace', fontSize: 20, fontWeight: 500, letterSpacing: 5, textTransform: 'uppercase', color: '#bd1225' }}>{eyebrow}</div>
          </div>

          {/* Title + subtitle */}
          <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'center', paddingTop: 20, paddingBottom: 20 }}>
            <div
              style={{
                display: 'flex',
                fontSize: size,
                fontWeight: 600,
                lineHeight: 1.06,
                letterSpacing: -size * 0.03,
                color: '#0b0a0f',
                lineClamp: 3,
                maxWidth: 1000,
              }}
            >
              {title}
            </div>
            {subtitle && (
              <div style={{ display: 'flex', marginTop: 22, fontSize: 28, fontWeight: 400, lineHeight: 1.4, color: '#55545f', lineClamp: 2, maxWidth: 940 }}>{subtitle}</div>
            )}
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              {/* Capsule brand mark drawn with divs */}
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 64,
                  height: 64,
                  borderRadius: 19,
                  backgroundImage: 'linear-gradient(135deg, #bd1225 0%, #e11d2e 55%, #ff6675 100%)',
                  boxShadow: '0 14px 30px -12px rgba(225,29,46,0.7)',
                }}
              >
                <div style={{ position: 'absolute', left: 1, top: 1, width: 62, height: 30, borderRadius: 18, backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0.05))' }} />
                <div style={{ display: 'flex', width: 38, height: 17, borderRadius: 9999, backgroundColor: '#ffffff', transform: 'rotate(-45deg)', overflow: 'hidden' }}>
                  <div style={{ width: 19, height: 17, backgroundColor: 'rgba(255,102,117,0.55)' }} />
                  <div style={{ width: 1.5, height: 17, backgroundColor: 'rgba(225,29,46,0.5)' }} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: -0.6, color: '#0b0a0f' }}>{name}</div>
                <div style={{ marginTop: 6, fontFamily: '"Geist Mono", Menlo, monospace', fontSize: 15, fontWeight: 500, letterSpacing: 3, textTransform: 'uppercase', color: '#6b6a78' }}>{tagline}</div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 22px',
                borderRadius: 9999,
                backgroundColor: 'rgba(255,255,255,0.75)',
                border: '1px solid rgba(255,199,205,0.9)',
                fontFamily: '"Geist Mono", Menlo, monospace',
                fontSize: 20,
                fontWeight: 500,
                letterSpacing: 2,
                color: '#bd1225',
              }}
            >
              {host}
            </div>
          </div>
        </div>
      </div>
    ),
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
