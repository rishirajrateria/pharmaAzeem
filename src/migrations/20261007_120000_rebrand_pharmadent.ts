import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Rebrand: "Azeem Pharmaceuticals" -> "Pharmadent Remedies".
 *
 * Rewrites the old brand in every text / varchar / jsonb column of the
 * content tables (globals, collections, array/block sub-tables, version
 * tables, Lexical rich text). Idempotent: rows are only touched when the
 * rewritten value differs, and the replacements never re-introduce "azeem".
 *
 * Deliberately NOT touched:
 *  - payload_* internal tables (migrations, preferences, locked docs, kv, jobs)
 *  - users* tables
 *  - inquiries* (customer-submitted records; keep them as received)
 *  - slug columns (changing them would silently break public URLs)
 *  - media file columns (filename, url, sizes_*, _objectkey, ...) which must
 *    keep matching the stored files
 *  - the person name "Dr. Azeem Khan" (protected by a placeholder token)
 *
 * Note: backslashes are doubled because this is a JS template literal;
 * Postgres receives '\mAzeem\M' (word-boundary regex).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
DO $$
DECLARE
  r record;
  expr text;
  n bigint;
  i int;
  pairs CONSTANT text[] := ARRAY[
    'Dr. Azeem Khan',                  '__PHD_KEEP_DR_AK__',
    'Azeem Pharmaceuticals Pvt. Ltd.', 'Pharmadent Remedies Pvt. Ltd.',
    'AZEEM PHARMACEUTICALS',           'PHARMADENT REMEDIES',
    'Azeem Pharmaceuticals',           'Pharmadent Remedies',
    'azeem pharmaceuticals',           'pharmadent remedies',
    'azeem-pharmaceuticals',           'pharmadent-remedies',
    'azeempharma.com',                 'pharmadentremedies.com',
    'azeempharma',                     'pharmadentremedies'
  ];
BEGIN
  FOR r IN
    SELECT c.table_schema, c.table_name, c.column_name, c.data_type
    FROM information_schema.columns c
    JOIN information_schema.tables t
      ON t.table_schema = c.table_schema
     AND t.table_name = c.table_name
     AND t.table_type = 'BASE TABLE'
    WHERE c.table_schema = current_schema()
      AND c.data_type IN ('text', 'character varying', 'jsonb')
      AND c.is_generated = 'NEVER'
      AND c.table_name NOT IN (
        'payload_migrations',
        'payload_preferences',
        'payload_preferences_rels',
        'payload_locked_documents',
        'payload_locked_documents_rels',
        'inquiries',
        'inquiries_items'
      )
      AND c.table_name NOT LIKE 'payload!_%' ESCAPE '!'
      AND c.table_name NOT LIKE 'users%'
      AND c.column_name NOT LIKE '%slug'
      AND NOT (
        c.table_name = 'media'
        AND (
          c.column_name IN ('filename', 'url', 'thumbnail_u_r_l', 'mime_type', 'prefix', '_objectkey')
          OR c.column_name LIKE 'sizes!_%' ESCAPE '!'
        )
      )
  LOOP
    -- Build the chained replace() expression for this column.
    expr := format('%I::text', r.column_name);
    FOR i IN 1 .. array_length(pairs, 1) BY 2 LOOP
      expr := format('replace(%s, %L, %L)', expr, pairs[i], pairs[i + 1]);
    END LOOP;
    -- "Azeem Pharma" (but not "Azeem Pharmaceutical...", handled above/below).
    expr := format('regexp_replace(%s, %L, %L, %L)', expr, '\\mAzeem Pharma\\M', 'Pharmadent Remedies', 'g');
    expr := format('regexp_replace(%s, %L, %L, %L)', expr, '\\mazeem pharma\\M', 'pharmadent remedies', 'g');
    -- Standalone company name ("Azeem has been ...", "with Azeem.").
    expr := format('regexp_replace(%s, %L, %L, %L)', expr, '\\mAzeem\\M', 'Pharmadent', 'g');
    expr := format('regexp_replace(%s, %L, %L, %L)', expr, '\\mAZEEM\\M', 'PHARMADENT', 'g');
    -- Restore the protected person name.
    expr := format('replace(%s, %L, %L)', expr, '__PHD_KEEP_DR_AK__', 'Dr. Azeem Khan');

    IF r.data_type = 'jsonb' THEN
      expr := format('(%s)::jsonb', expr);
    END IF;

    EXECUTE format(
      'UPDATE %I.%I SET %I = %s WHERE %I::text ILIKE %L AND %I IS DISTINCT FROM %s',
      r.table_schema, r.table_name, r.column_name, expr,
      r.column_name, '%azeem%',
      r.column_name, expr
    );
    GET DIAGNOSTICS n = ROW_COUNT;
    IF n > 0 THEN
      RAISE NOTICE 'rebrand: %.% -> % row(s)', r.table_name, r.column_name, n;
    END IF;
  END LOOP;
END
$$;
  `)

  // Column defaults created by the initial schema migration.
  await db.execute(sql`
   ALTER TABLE IF EXISTS "site_settings" ALTER COLUMN "site_name" SET DEFAULT 'Pharmadent Remedies';
   ALTER TABLE IF EXISTS "site_settings" ALTER COLUMN "seo_title_template" SET DEFAULT '%s | Pharmadent Remedies';
   ALTER TABLE IF EXISTS "about_page" ALTER COLUMN "hero_title" SET DEFAULT 'About Pharmadent Remedies';
  `)
}

/**
 * Content rewrites are not reversed (we cannot tell rebranded text apart from
 * text written after the rebrand). Only the column defaults are restored.
 */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE IF EXISTS "site_settings" ALTER COLUMN "site_name" SET DEFAULT 'Azeem Pharmaceuticals';
   ALTER TABLE IF EXISTS "site_settings" ALTER COLUMN "seo_title_template" SET DEFAULT '%s | Azeem Pharmaceuticals';
   ALTER TABLE IF EXISTS "about_page" ALTER COLUMN "hero_title" SET DEFAULT 'About Azeem Pharmaceuticals';
  `)
}
