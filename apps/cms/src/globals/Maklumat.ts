import type { GlobalConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

/**
 * Maklumat Pelayanan PPID — official service charter shown at /profil/maklumat-pelayanan.
 */
export const Maklumat: GlobalConfig = {
  slug: 'maklumat-pelayanan',
  admin: { description: 'Maklumat Pelayanan PPID sesuai UU KIP No.14/2008.' },
  access: {
    read:   () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'judul',            type: 'text',     required: true, defaultValue: 'Maklumat Pelayanan PPID' },
    { name: 'tanggalDitetapkan', type: 'date',     required: true },
    { name: 'isi',              type: 'richText', editor: lexicalEditor({}), required: true },
    {
      name: 'penandatangan',
      type: 'group',
      fields: [
        { name: 'nama',    type: 'text', required: true },
        { name: 'jabatan', type: 'text', required: true },
      ],
    },
  ],
}
