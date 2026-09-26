/** Human labels for the `region` select on the Countries collection (kept local – see file ownership rules). */
export const REGION_LABEL: Record<string, string> = {
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

export const REGION_ORDER = Object.keys(REGION_LABEL)

export const regionLabel = (value: string) =>
  REGION_LABEL[value] || value.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
