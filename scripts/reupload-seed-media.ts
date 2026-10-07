import fs from 'node:fs'
import path from 'node:path'

import { getPayload } from 'payload'

import config from '../src/payload.config'

const SEED_IMAGES_DIR = path.resolve(process.cwd(), 'data/seed-images')

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('Set BLOB_READ_WRITE_TOKEN before running this script.')
  }

  const payload = await getPayload({ config })

  const { docs } = await payload.find({ collection: 'media', limit: 0 })
  console.log(`Found ${docs.length} media document(s).`)

  let fixed = 0
  let missing = 0
  let skipped = 0

  for (const doc of docs) {
    if ((doc as { _objectKey?: string | null })._objectKey) {
      skipped++
      continue
    }
    const filename = doc.filename as string | undefined
    if (!filename) {
      missing++
      continue
    }
    const localPath = path.join(SEED_IMAGES_DIR, filename)
    if (!fs.existsSync(localPath)) {
      console.warn(`No local file for ${filename} (doc ${doc.id}) – skipping.`)
      missing++
      continue
    }

    await payload.update({
      collection: 'media',
      id: doc.id,
      data: {},
      filePath: localPath,
    })
    fixed++
    console.log(`Re-uploaded ${filename}`)
  }

  console.log(`Done. Re-uploaded: ${fixed}, already had a blob: ${skipped}, missing local file: ${missing}.`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
