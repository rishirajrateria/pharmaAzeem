import type { Certification, Media } from '@/payload-types'

/**
 * Local helpers for the Quality and Licenses pages: grouping, validity status
 * and document detection for Certification documents. No shared-file edits.
 */

export type CertType = Certification['type']

export const CERT_TYPE_ORDER: CertType[] = ['license', 'certification', 'accreditation', 'registration', 'membership']

export type CertTypeMeta = {
  /** Plural group heading. */
  label: string
  /** Singular badge label. */
  singular: string
  /** URL fragment for the group section. */
  anchor: string
  /** CMS icon name (see ui/Icon.tsx). */
  icon: string
  /** One-sentence group description – written for both readers and LLM crawlers. */
  description: string
}

export const CERT_TYPE_META: Record<CertType, CertTypeMeta> = {
  license: {
    label: 'Manufacturing licenses',
    singular: 'Manufacturing license',
    anchor: 'manufacturing-licenses',
    icon: 'stamp',
    description:
      'Statutory licences issued by drug and food regulators that authorise the manufacture, sale and distribution of the dosage forms produced at our plants.',
  },
  certification: {
    label: 'Certifications',
    singular: 'Certification',
    anchor: 'certifications',
    icon: 'badge-check',
    description:
      'Independent certificates confirming that our facilities, quality system and products meet WHO-GMP, ISO and export-registration requirements.',
  },
  accreditation: {
    label: 'Accreditations',
    singular: 'Accreditation',
    anchor: 'accreditations',
    icon: 'award',
    description: 'Formal recognition by accreditation bodies of our laboratories, testing methods and technical competence.',
  },
  registration: {
    label: 'Product registrations',
    singular: 'Product registration',
    anchor: 'product-registrations',
    icon: 'file-check',
    description: 'Registrations and trade approvals that allow our products to be imported, marketed and sold in partner countries.',
  },
  membership: {
    label: 'Memberships',
    singular: 'Membership',
    anchor: 'memberships',
    icon: 'handshake',
    description: 'Industry associations and export promotion councils of which we are a registered member.',
  },
}

export type CertGroup = CertTypeMeta & { type: CertType; items: Certification[] }

/** Groups certifications by `type` in a fixed, meaningful order; empty groups are dropped. */
export const groupCertifications = (certs: Certification[]): CertGroup[] =>
  CERT_TYPE_ORDER.map((type) => ({ type, ...CERT_TYPE_META[type], items: certs.filter((c) => c.type === type) })).filter((g) => g.items.length > 0)

export type CertStatus = 'valid' | 'expired'

/** A certificate is "valid" while `validUntil` is missing or still in the future (inclusive of that day). */
export const certStatus = (cert: Pick<Certification, 'validUntil'>, now = Date.now()): CertStatus => {
  if (!cert.validUntil) return 'valid'
  const until = new Date(cert.validUntil)
  if (Number.isNaN(until.getTime())) return 'valid'
  until.setUTCHours(23, 59, 59, 999)
  return until.getTime() >= now ? 'valid' : 'expired'
}

/** Returns the populated PDF/document media when one is attached and has a URL. */
export const certDocument = (cert: Pick<Certification, 'document'>): Media | null => {
  const d = cert.document
  return d && typeof d === 'object' && d.url ? d : null
}

/** Stable in-page anchor for a certificate card (used for ItemList URLs and deep links). */
export const certAnchor = (cert: Pick<Certification, 'id'>) => `cert-${cert.id}`

export const formatFileSize = (bytes?: number | null) => {
  if (!bytes || bytes <= 0) return ''
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Two-digit step / index label: 1 → "01". */
export const pad2 = (n: number) => String(n).padStart(2, '0')
