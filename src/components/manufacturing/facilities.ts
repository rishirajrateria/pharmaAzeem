import {
  Factory,
  FlaskConical,
  Microscope,
  TestTubes,
  Warehouse,
  type LucideIcon,
} from 'lucide-react'

import type { Certification, Facility, Media } from '@/payload-types'

/**
 * Local helpers for the Manufacturing page. No shared-file edits: everything the page
 * needs beyond `src/lib` lives here so other agents' folders are never imported.
 */

export type FacilityTypeMeta = {
  /** Singular badge label, e.g. "Formulation plant". */
  label: string
  /** Plural label for counters. */
  plural: string
  icon: LucideIcon
  /** One-line explanation used by screen readers and LLM crawlers. */
  description: string
}

export const FACILITY_TYPE: Record<Facility['type'], FacilityTypeMeta> = {
  formulation: {
    label: 'Formulation plant',
    plural: 'Formulation plants',
    icon: Factory,
    description: 'Finished dosage form manufacturing plant',
  },
  api: {
    label: 'API plant',
    plural: 'API plants',
    icon: FlaskConical,
    description: 'Active pharmaceutical ingredient synthesis plant',
  },
  rnd: {
    label: 'R&D centre',
    plural: 'R&D centres',
    icon: Microscope,
    description: 'Formulation research and development centre',
  },
  'qc-lab': {
    label: 'QC laboratory',
    plural: 'QC laboratories',
    icon: TestTubes,
    description: 'Quality control and analytical testing laboratory',
  },
  warehouse: {
    label: 'Warehouse & logistics',
    plural: 'Warehouses',
    icon: Warehouse,
    description: 'Temperature-mapped warehouse and export logistics hub',
  },
}

export const facilityType = (f: Pick<Facility, 'type'>): FacilityTypeMeta =>
  FACILITY_TYPE[f.type] || FACILITY_TYPE.formulation

/** In-page anchor for a facility card (= its slug, as required by the ItemList JSON-LD URLs). */
export const facilityAnchor = (f: Pick<Facility, 'slug' | 'id'>) => f.slug || `facility-${f.id}`

/** Mirrors the certificate card anchor used on /licenses (`cert-{id}`). */
export const certificateHref = (c: Pick<Certification, 'id'>) => `/licenses#cert-${c.id}`

/** Catalogue deep link for a dosage form (the products page reads the `form` query param). */
export const dosageFormHref = (form: string) => `/products?form=${encodeURIComponent(form)}`

/** Only populated, renderable media documents. */
export const facilityImages = (f: Pick<Facility, 'images'>): Media[] =>
  (f.images || []).filter(
    (m): m is Media => Boolean(m) && typeof m === 'object' && Boolean((m as Media).url),
  )

/** Only populated certification documents. */
export const facilityCertifications = (f: Pick<Facility, 'certifications'>): Certification[] =>
  (f.certifications || []).filter((c): c is Certification => Boolean(c) && typeof c === 'object')

export const facilityPlace = (f: Pick<Facility, 'city' | 'country'>) =>
  [f.city, f.country].filter(Boolean).join(', ')

/**
 * Splits "Unit I – Oral Solid Dosage Plant" into { code: 'Unit I', rest: 'Oral Solid Dosage Plant' }
 * so the sticky sub-nav can show a compact label. Names without a dash are returned unchanged.
 */
export const splitFacilityName = (name: string): { code: string | null; rest: string } => {
  const m = name.match(/^(.{2,24}?)\s+[–—-]\s+(.+)$/)
  if (!m) return { code: null, rest: name }
  return { code: m[1], rest: m[2] }
}

export const formatArea = (sqm?: number | null) =>
  typeof sqm === 'number' && sqm > 0 ? `${sqm.toLocaleString('en')} m²` : ''

/** Two-digit step label: 1 → "01". */
export const pad2 = (n: number) => String(n).padStart(2, '0')

/** Sums a facility list by type for the hero and overview counters. */
export const countByType = (facilities: Facility[]) => {
  const counts = new Map<Facility['type'], number>()
  facilities.forEach((f) => counts.set(f.type, (counts.get(f.type) ?? 0) + 1))
  return (Object.keys(FACILITY_TYPE) as Facility['type'][])
    .filter((t) => counts.has(t))
    .map((t) => ({ type: t, count: counts.get(t)!, ...FACILITY_TYPE[t] }))
}
