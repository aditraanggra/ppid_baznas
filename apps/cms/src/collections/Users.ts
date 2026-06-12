import type { CollectionConfig } from 'payload'

/**
 * Payload's own user collection (separate from the Drizzle `users` table
 * used for the public-side admin dashboard). This is solely for who can
 * log in to the Payload admin panel at /cms/admin.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    description: 'Pengguna yang bisa mengakses panel CMS.',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
  ],
  timestamps: true,
}
