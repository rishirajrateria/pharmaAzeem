import { ImageResponse } from 'next/og'

import { dosageFormLabel, rxLabel } from '@/components/product/labels'
import { getProductBySlug, getSiteSettings } from '@/lib/data'
import { siteName } from '@/lib/seo'
import { SITE_URL } from '@/lib/utils'

/**
 * Branded 1200×630 social card for every product. Rendered with Satori (next/og),
 * so styles are inline by necessity – no CMS image fetch, cached with the page.
 */
export const revalidate = 3600
export const alt = 'Product overview card'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const RED = '#e11d2e'
const RED_DARK = '#bd1225'
const INK = '#0b0a0f'
const INK_MUTED = '#6b6a78'

export default async function OpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [product, settings] = await Promise.all([getProductBySlug(slug), getSiteSettings()])
  const name = siteName(settings)
  const host = SITE_URL.replace(/^https?:\/\//, '')

  const title = product?.title || 'Pharmaceutical product'
  const generic = product
    ? [product.genericName, product.strength, dosageFormLabel(product.dosageForm)]
        .filter(Boolean)
        .join(' ')
    : ''
  const category =
    product?.categories?.map((c) => (typeof c === 'object' && c ? c.title : null)).find(Boolean) ||
    'Pharmaceutical product'
  const chips = product
    ? [
        product.dosageForm,
        product.packSize,
        product.therapeuticClass,
        rxLabel(product.prescriptionStatus),
      ].filter((x): x is string => Boolean(x))
    : []
  const titleSize = title.length > 34 ? 52 : title.length > 22 ? 64 : 76

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        background: 'linear-gradient(180deg, #ffffff 0%, #fff4f5 100%)',
        fontFamily: 'sans-serif',
        color: INK,
      }}
    >
      {/* Ambient orbs */}
      <div
        style={{
          position: 'absolute',
          left: -180,
          top: -220,
          width: 620,
          height: 620,
          borderRadius: 9999,
          background: 'radial-gradient(closest-side, rgba(255,102,117,0.45), rgba(255,102,117,0))',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: -160,
          top: 40,
          width: 560,
          height: 560,
          borderRadius: 9999,
          background: 'radial-gradient(closest-side, rgba(225,29,46,0.28), rgba(225,29,46,0))',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 420,
          bottom: -300,
          width: 620,
          height: 620,
          borderRadius: 9999,
          background: 'radial-gradient(closest-side, rgba(255,199,205,0.7), rgba(255,199,205,0))',
        }}
      />
      {/* HUD rings */}
      <div
        style={{
          position: 'absolute',
          right: 60,
          top: 90,
          width: 440,
          height: 440,
          borderRadius: 9999,
          border: '1px solid rgba(225,29,46,0.14)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 120,
          top: 150,
          width: 320,
          height: 320,
          borderRadius: 9999,
          border: '1px solid rgba(225,29,46,0.18)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 276,
          top: 146,
          width: 14,
          height: 14,
          borderRadius: 9999,
          background: RED,
          boxShadow: '0 0 0 8px rgba(225,29,46,0.15)',
        }}
      />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '48px 64px 0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: `linear-gradient(120deg, ${RED_DARK}, ${RED}, #ff6675)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 30px -10px rgba(225,29,46,0.7)',
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 9999,
                background: 'white',
                display: 'flex',
              }}
            />
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.5 }}>{name}</div>
        </div>
        <div
          style={{
            fontSize: 16,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: RED,
            fontWeight: 600,
          }}
        >
          WHO-GMP CERTIFIED
        </div>
      </div>

      {/* Glass card */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          margin: '40px 64px 0',
          padding: '40px 48px',
          borderRadius: 36,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,255,255,0.55))',
          border: '1px solid rgba(255,255,255,0.95)',
          boxShadow: '0 24px 64px -16px rgba(225,29,46,0.18), 0 8px 24px -8px rgba(11,10,15,0.08)',
          flexGrow: 1,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 16,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: RED,
            fontWeight: 600,
          }}
        >
          <div
            style={{ width: 8, height: 8, borderRadius: 9999, background: RED, display: 'flex' }}
          />
          <div>{category}</div>
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: titleSize,
            fontWeight: 700,
            letterSpacing: -2.5,
            lineHeight: 1.02,
            color: INK,
          }}
        >
          {title}
        </div>
        {generic && (
          <div
            style={{
              marginTop: 14,
              fontSize: 34,
              fontWeight: 500,
              letterSpacing: -0.8,
              color: RED,
            }}
          >
            {generic}
          </div>
        )}
        {chips.length > 0 && (
          <div style={{ display: 'flex', gap: 10, marginTop: 'auto', flexWrap: 'wrap' }}>
            {chips.slice(0, 4).map((c) => (
              <div
                key={c}
                style={{
                  display: 'flex',
                  padding: '8px 16px',
                  borderRadius: 9999,
                  border: '1px solid rgba(225,29,46,0.25)',
                  background: 'rgba(255,255,255,0.8)',
                  fontSize: 18,
                  color: RED_DARK,
                  fontWeight: 500,
                }}
              >
                {c}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '22px 64px 36px',
          fontSize: 18,
          color: INK_MUTED,
        }}
      >
        <div>{host}/products</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 9999,
              background: '#22c55e',
              display: 'flex',
            }}
          />
          <div>Export documentation · CoA with every batch</div>
        </div>
      </div>
    </div>,
    { ...size },
  )
}
