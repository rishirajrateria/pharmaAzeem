import { Client } from 'pg'

import { migrations } from '../src/migrations'

async function main() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString || !connectionString.startsWith('postgres')) {
    throw new Error('Set DATABASE_URL to your Postgres connection string before running this script.')
  }

  const client = new Client({ connectionString })
  await client.connect()

  try {
    await client.query('DELETE FROM payload_migrations WHERE batch = -1')

    // The schema already exists (it was created by a dev-mode "push"), so rather than
    // letting Payload re-run the migration's SQL (which would fail on already-existing
    // tables), mark every known migration as already applied in batch 1.
    for (const migration of migrations) {
      const { rows } = await client.query(
        'SELECT id FROM payload_migrations WHERE name = $1',
        [migration.name],
      )
      if (rows.length) continue
      await client.query(
        'INSERT INTO payload_migrations (name, batch, created_at, updated_at) VALUES ($1, 1, now(), now())',
        [migration.name],
      )
      console.log(`Marked ${migration.name} as applied.`)
    }

    console.log('Done.')
  } finally {
    await client.end()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
