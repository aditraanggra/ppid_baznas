import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pengumuman } from './collections/Pengumuman'
import { FAQ } from './collections/FAQ'
import { DokumenPublik } from './collections/DokumenPublik'
import { SiteSettings } from './globals/SiteSettings'
import { Maklumat } from './globals/Maklumat'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Payload CMS 3.x configuration.
 *
 * Database: PostgreSQL (same instance as the Drizzle-managed PPID schema —
 * Payload uses tables prefixed with `payload_` to avoid collisions).
 *
 * Storage: MinIO via the S3 adapter — see .env for credentials.
 */
export default buildConfig({
  admin: {
    user: Users.slug,
    suppressHydrationWarning: true,
    meta: {
      titleSuffix: ' — CMS PPID BAZNAS Cianjur',
    },
  },
  editor: lexicalEditor({}),
  collections: [Users, Media, Pengumuman, FAQ, DokumenPublik],
  globals: [SiteSettings, Maklumat],
  secret: process.env.PAYLOAD_SECRET ?? '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL ?? '' },
    push: false,
  }),
  plugins: [
    s3Storage({
      collections: {
        media: { prefix: 'media' },
        'dokumen-publik': { prefix: 'dokumen' },
      },
      bucket: process.env.MINIO_BUCKET_DOKUMEN ?? 'dokumen-publik',
      config: {
        endpoint: `http${process.env.MINIO_USE_SSL === 'true' ? 's' : ''}://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT ?? '9000'}`,
        region: 'us-east-1', // MinIO ignores this but the SDK requires it
        credentials: {
          accessKeyId: process.env.MINIO_ACCESS_KEY ?? '',
          secretAccessKey: process.env.MINIO_SECRET_KEY ?? '',
        },
        forcePathStyle: true, // Required for MinIO
      },
    }),
  ],
})
