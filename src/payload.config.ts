import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { seoPlugin } from '@payloadcms/plugin-seo'
import {
  BoldFeature,
  EXPERIMENTAL_TableFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnderlineFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig, type Plugin } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Certifications } from './collections/Certifications'
import { Countries } from './collections/Countries'
import { Facilities } from './collections/Facilities'
import { Inquiries } from './collections/Inquiries'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { Users } from './collections/Users'
import { migrations } from './migrations'
import { Homepage } from './globals/Homepage'
import { SiteSettings } from './globals/SiteSettings'
import {
  AboutPage,
  ContactPage,
  GlobalPresencePage,
  InquiryPage,
  LicensesPage,
  ManufacturingPage,
  ProductsPage,
  QualityPage,
} from './globals/pages'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

if (process.env.NODE_ENV === 'production' && !process.env.PAYLOAD_SECRET) {
  throw new Error('PAYLOAD_SECRET must be set in production')
}
if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SERVER_URL) {
  console.warn('[config] NEXT_PUBLIC_SERVER_URL is not set – canonical URLs, sitemap and structured data will point at localhost')
}

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const dbUrl = process.env.DATABASE_URL || 'file:./data/pharma.db'

/**
 * Database: SQLite (zero-config, file based) by default – ideal for local development
 * and single-server hosting. Set DATABASE_URL to a postgres:// connection string
 * (Neon, Supabase, RDS…) for serverless / multi-instance production.
 */
const db = dbUrl.startsWith('postgres')
  ? postgresAdapter({
      pool: {
        connectionString: dbUrl,
        max: 5,
        // Neon's pooled endpoint (PgBouncer) can silently drop a connection that sits idle
        // for a while – long enough to happen during a sequential Next.js build. TCP
        // keepalives stop the socket from going idle long enough to be reaped.
        keepAlive: true,
        keepAliveInitialDelayMillis: 10_000,
      },
      push: process.env.NODE_ENV !== 'production',
      prodMigrations: migrations,
    })
  : sqliteAdapter({ client: { url: dbUrl }, push: true })

/** Email: SMTP when configured; otherwise Payload logs emails to the console. */
const email = process.env.SMTP_HOST
  ? nodemailerAdapter({
      defaultFromAddress: process.env.SMTP_FROM || 'no-reply@example.com',
      defaultFromName: process.env.SMTP_FROM_NAME || 'Pharmadent Remedies',
      transportOptions: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      },
    })
  : undefined

const plugins: Plugin[] = [
  // We embed the SEO fields directly in each collection (see src/fields/seo.ts);
  // the plugin still powers the "Auto-generate" buttons and preview.
  seoPlugin({
    collections: [],
    globals: [],
    uploadsCollection: 'media',
    generateTitle: ({ doc }) => {
      const t = doc?.title || doc?.name || doc?.hero?.title || ''
      return t ? `${t} | Pharmadent Remedies` : 'Pharmadent Remedies'
    },
    generateDescription: ({ doc }) =>
      doc?.shortDescription ||
      doc?.summary ||
      doc?.hero?.subtitle ||
      doc?.description?.root?.children?.[0]?.children?.[0]?.text ||
      '',
    generateImage: ({ doc }) => {
      const first = Array.isArray(doc?.images) ? doc.images[0] : doc?.image || doc?.hero?.image
      return typeof first === 'object' && first ? first.id : first || ''
    },
    generateURL: ({ doc, collectionSlug, globalSlug }) => {
      if (collectionSlug === 'products') return `${serverURL}/products/${doc?.slug}`
      if (collectionSlug === 'categories')
        return `${serverURL}/categories/${doc?.path || doc?.slug}`
      if (collectionSlug === 'countries') return `${serverURL}/global-presence/${doc?.slug}`
      if (globalSlug === 'homepage') return serverURL
      if (globalSlug) return `${serverURL}/${globalSlug.replace(/-page$/, '')}`
      return serverURL
    },
  }),
]

// Optional: store uploads in Vercel Blob when deploying to Vercel.
if (process.env.BLOB_READ_WRITE_TOKEN) {
  plugins.push(
    vercelBlobStorage({
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  )
}

export default buildConfig({
  serverURL,
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    components: {
      graphics: {
        Logo: '@/components/admin/Logo#AdminLogo',
        Icon: '@/components/admin/Logo#AdminIcon',
      },
      beforeDashboard: ['@/components/admin/Dashboard#BeforeDashboard'],
    },
    meta: {
      titleSuffix: ' · Pharmadent Admin',
      description: 'Content & catalogue management for the Pharmadent Remedies website.',
    },
    dateFormat: 'dd MMM yyyy, HH:mm',
  },
  collections: [
    Products,
    Categories,
    Inquiries,
    Countries,
    Certifications,
    Facilities,
    Media,
    Users,
  ],
  globals: [
    SiteSettings,
    Homepage,
    ProductsPage,
    AboutPage,
    QualityPage,
    ManufacturingPage,
    GlobalPresencePage,
    LicensesPage,
    ContactPage,
    InquiryPage,
  ],
  editor: lexicalEditor({
    features: () => [
      ParagraphFeature(),
      HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      OrderedListFeature(),
      UnorderedListFeature(),
      LinkFeature(),
      HorizontalRuleFeature(),
      EXPERIMENTAL_TableFeature(),
      FixedToolbarFeature(),
      InlineToolbarFeature(),
    ],
  }),
  db,
  email,
  sharp,
  plugins,
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-me',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  cors: [serverURL],
  csrf: [serverURL],
  upload: { limits: { fileSize: 10 * 1024 * 1024 } },
  defaultDepth: 1,
  maxDepth: 3,
})
