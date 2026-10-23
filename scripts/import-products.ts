/**
 * Imports the client's product list (src/seed/data/product-list.json) into the connected database.
 *
 *   pnpm tsx scripts/import-products.ts                 → adds missing categories/products, removes the old sample products
 *   pnpm tsx scripts/import-products.ts --update        → also rewrites products that already exist (overwrites admin edits!)
 *   pnpm tsx scripts/import-products.ts --keep-samples  → leave the old sample products ("AZ-…" SKUs) in place
 *   pnpm tsx scripts/import-products.ts --if-needed     → do nothing when the catalogue is already up to date (used by the Vercel build)
 *
 * Safe to run repeatedly: products are matched on their SKU (PR-0001 …), existing ones are skipped,
 * and the old sample products are only removed after every new product has been created.
 */
import 'dotenv/config'

import { getPayload } from 'payload'

import config from '../src/payload.config'
import {
  catalogueIsCurrent,
  ensureCategories,
  ensurePackImages,
  pruneEmptyLegacyCategories,
  refreshCountries,
  refreshProductsPageCopy,
  removeSampleProducts,
  upsertProducts,
} from '../src/seed/catalogue'
import { products } from '../src/seed/data/products'

const args = new Set(process.argv.slice(2))

async function main() {
  const payload = await getPayload({ config })
  console.log(`\nProduct import – ${products.length} products in the list\n`)

  if (args.has('--if-needed') && (await catalogueIsCurrent(payload))) {
    console.log('Catalogue is already up to date – nothing to do.\n')
    process.exit(0)
  }

  const catIds = await ensureCategories(payload)
  const images = await ensurePackImages(payload)
  console.log(`• ${images.size} pack illustrations ready, ${catIds.size} categories known`)

  const stats = await upsertProducts(payload, products, catIds, images, {
    update: args.has('--update'),
  })
  console.log(
    `• Products: ${stats.created} created, ${stats.updated} updated, ${stats.skipped} already present, ${stats.failed.length} failed`,
  )
  if (stats.failed.length) {
    console.error(`\n${stats.failed.join('\n')}\n`)
    console.error(
      'Some products failed – the old sample products were NOT removed. Fix the errors and run again.',
    )
    process.exit(1)
  }

  if (!args.has('--keep-samples')) await removeSampleProducts(payload)
  await refreshCountries(payload, catIds)
  await refreshProductsPageCopy(payload)
  await pruneEmptyLegacyCategories(payload)

  const total = await payload.count({ collection: 'products' })
  console.log(`\n✔ Done. The catalogue now holds ${total.totalDocs} products.\n`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
