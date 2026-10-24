/**
 * Product catalogue taken from the client's product list (spreadsheet "MARS PRODUCT LIST").
 *
 * The records live in product-list.json – one per distinct product. They were normalised from the
 * free-text spreadsheet lines (spelling, strengths, dosage forms, categories); `sr` is the original
 * serial number in the spreadsheet so every product can be traced back to its source line.
 * No prices, stock levels, certifications or manufacturing claims are stored here.
 */
import list from './product-list.json'

export type ListProduct = {
  /** Serial number in the source spreadsheet. */
  sr: number
  /** Stable catalogue code, e.g. PR-0042. */
  sku: string
  slug: string
  featured: boolean
  title: string
  /** Brand as written in the list ("" when the line only gives a generic name). */
  brand: string
  generic: string
  ingredients: { name: string; strength: string }[]
  strength: string
  /** One of the Products collection dosage forms. */
  form: string
  /** Precise presentation, e.g. "Dry syrup", "Dispersible tablet". */
  formDetail: string
  route: string
  /** Primary sub-category slug. */
  category: string
  alsoCategory: string
  rx: 'rx' | 'otc'
  /** Controlled / tightly regulated product that needs special import permits. */
  specialLicence: boolean
  therapeuticClass: string
  packNote: string
  flavour: string
  aliases: string[]
  short: string
  indications: string[]
  /** Saved as a hidden draft instead of being published (needs a decision before it goes live). */
  draft: boolean
}

export const products = list as ListProduct[]
