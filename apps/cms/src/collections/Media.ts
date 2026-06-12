import type { CollectionConfig } from 'payload'

/**
 * Generic media collection — used for cover images, logos, gallery photos.
 * Files are uploaded to MinIO via the S3 storage adapter.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
  },
  access: {
    read:   () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'alt',     type: 'text',     required: true, label: 'Teks alternatif (alt)' },
    { name: 'caption', type: 'text',     required: false },
  ],
  timestamps: true,
}
