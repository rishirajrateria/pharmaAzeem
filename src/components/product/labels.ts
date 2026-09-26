import type { Media, Product } from '@/payload-types'
import { mediaAlt, mediaDims, mediaUrl } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* Small, dependency-free helpers shared by the product page pieces.   */
/* ------------------------------------------------------------------ */

export const BADGE_LABEL: Record<string, string> = {
  new: 'New',
  'best-seller': 'Best seller',
  'who-gmp': 'WHO-GMP',
  'export-ready': 'Export ready',
  'sugar-free': 'Sugar free',
  pediatric: 'Pediatric',
}

export const AVAILABILITY_LABEL: Record<NonNullable<Product['availability']>, string> = {
  'in-stock': 'In stock',
  'made-to-order': 'Made to order',
  'pre-order': 'Pre-order',
  discontinued: 'Discontinued',
}

/** Plural / display form of the dosage form for headings ("Tablet" → "Tablets"). */
export const dosageFormLabel = (form?: string | null): string => {
  if (!form) return ''
  const map: Record<string, string> = {
    Tablet: 'Tablets',
    Capsule: 'Capsules',
    Suppository: 'Suppositories',
    'Sachet / Powder': 'Sachets',
    'Oral Suspension / Syrup': 'Oral Suspension',
    'Ointment / Cream / Gel': 'Topical',
    'Eye / Ear Drops': 'Eye / Ear Drops',
    'Oral Solution / Drops': 'Oral Solution',
    Other: '',
  }
  return map[form] ?? form
}

/** "Cefixime 200 mg Tablets" – the generic subtitle that also lives inside the h1. */
export const genericLine = (
  product: Pick<Product, 'genericName' | 'strength' | 'dosageForm'>,
): string =>
  [product.genericName, product.strength, dosageFormLabel(product.dosageForm)]
    .filter(Boolean)
    .join(' ')

/** "Azefix 200 – Cefixime 200 mg Tablets" – used for <title> and the OG card. */
export const productHeadline = (
  product: Pick<Product, 'title' | 'genericName' | 'strength' | 'dosageForm'>,
): string => {
  const line = genericLine(product)
  return line && line !== product.title ? `${product.title} – ${line}` : product.title
}

/** "WHO-GMP Certificate" → "WHO-GMP" – compact CMS certification names for trust chips. */
export const shortCertName = (title: string): string =>
  title.replace(/\s*(certificate|certification)\s*$/i, '').trim() || title

export const rxLabel = (status?: Product['prescriptionStatus']): string | null =>
  status === 'otc' ? 'OTC' : status === 'rx' ? 'Rx' : null

export const rxLongLabel = (status?: Product['prescriptionStatus']): string | null =>
  status === 'otc' ? 'Over the counter' : status === 'rx' ? 'Prescription only' : null

export type GalleryImage = {
  src: string
  thumb: string
  alt: string
  width?: number
  height?: number
}

/** Slim, serialisable image list for the client gallery (keeps the RSC payload tiny). */
export const toGalleryImages = (product: Pick<Product, 'images' | 'title'>): GalleryImage[] =>
  (product.images || [])
    .filter((m): m is Media => typeof m === 'object' && m !== null)
    .map((m, i): GalleryImage | null => {
      const src = mediaUrl(m, 'large') || mediaUrl(m)
      if (!src) return null
      const dims = mediaDims(m, 'large')
      return {
        src,
        thumb: mediaUrl(m, 'thumbnail') || src,
        alt: mediaAlt(m, i === 0 ? product.title : `${product.title} – image ${i + 1}`),
        width: dims.width,
        height: dims.height,
      }
    })
    .filter((x): x is GalleryImage => x !== null)
