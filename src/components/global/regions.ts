import type { Country } from '@/payload-types'

/**
 * Region labels mirror the REGIONS select in src/collections/Countries.ts.
 * Kept local so the frontend never imports Payload server code.
 */
export type RegionKey = Country['region']

export const REGION_LABELS: Record<RegionKey, string> = {
  africa: 'Africa',
  'middle-east': 'Middle East',
  'south-asia': 'South Asia',
  'south-east-asia': 'South-East Asia',
  'east-asia-pacific': 'East Asia & Pacific',
  cis: 'CIS & Central Asia',
  europe: 'Europe',
  'latin-america': 'Latin America & Caribbean',
  'north-america': 'North America',
}

/** Short, one-line positioning statement per region – used under region headings. */
export const REGION_BLURBS: Record<RegionKey, string> = {
  africa: 'Essential medicines for hospital, pharmacy and tender supply across Sub-Saharan and North Africa.',
  'middle-east': 'Arabic artwork and documentation prepared to the requirements of Gulf and Levant regulators.',
  'south-asia': 'Short lead times and fast regulatory responses for our closest export markets.',
  'south-east-asia': 'ACTD-format dossiers and local-language packs for ASEAN regulators.',
  'east-asia-pacific': 'Consolidated shipments planned around long Pacific transit routes.',
  cis: 'Russian-language documentation and EAEU-aligned dossiers for CIS and Central Asian partners.',
  europe: 'Contract manufacturing and CTD-based registrations for European and Balkan partners.',
  'latin-america': 'Spanish and Portuguese dossiers with long-distance cold-chain logistics.',
  'north-america': 'Development and supply projects built around US and Canadian regulatory requirements.',
}

export const REGION_ORDER: RegionKey[] = ['africa', 'middle-east', 'south-asia', 'south-east-asia', 'east-asia-pacific', 'cis', 'europe', 'latin-america', 'north-america']

export const regionLabel = (region: string | null | undefined) => (region && REGION_LABELS[region as RegionKey]) || 'Worldwide'

export const regionAnchor = (region: string) => `region-${region}`

export type RegionGroup = { key: RegionKey; label: string; blurb: string; countries: Country[] }

/** Groups countries by region in the canonical order, skipping empty regions. */
export const groupByRegion = (countries: Country[]): RegionGroup[] =>
  REGION_ORDER.map((key) => ({
    key,
    label: REGION_LABELS[key],
    blurb: REGION_BLURBS[key],
    countries: countries.filter((c) => c.region === key).sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((g) => g.countries.length > 0)

/** "National Agency for Food and Drug Administration and Control (NAFDAC)" → "NAFDAC" */
export const regulatorShort = (authority: string | null | undefined) => {
  if (!authority) return ''
  const m = authority.match(/\(([^)]+)\)/)
  return m?.[1] || authority.split('/')[0].trim()
}

export const countryPath = (country: Pick<Country, 'slug'>) => `/global-presence/${country.slug}`

export const earliestYear = (countries: Country[]) => {
  const years = countries.map((c) => c.sinceYear).filter((y): y is number => typeof y === 'number' && y > 1900)
  return years.length ? Math.min(...years) : undefined
}
