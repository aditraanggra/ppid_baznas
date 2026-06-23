import { pgTable, uuid, varchar, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'

export const kategoriPengaduanEnum = pgEnum('kategori_pengaduan', [
  'pelayanan',
  'penyaluran_zis',
  'keberatan',
  'lainnya',
])

export const statusPengaduanEnum = pgEnum('status_pengaduan', [
  'pending',
  'diproses',
  'ditindaklanjuti',
  'selesai',
])

export const pengaduan = pgTable('pengaduan', {
  id:            uuid('id').defaultRandom().primaryKey(),
  nomorTiket:    varchar('nomor_tiket', { length: 20 }).notNull().unique(),
  nama:          varchar('nama', { length: 100 }).notNull(),
  email:         varchar('email', { length: 255 }).notNull(),
  nomorTelepon:  varchar('nomor_telepon', { length: 15 }),
  kategori:      kategoriPengaduanEnum('kategori').notNull(),
  subjek:        varchar('subjek', { length: 200 }).notNull(),
  isiPengaduan:  text('isi_pengaduan').notNull(),
  lampiran:      varchar('lampiran', { length: 500 }),
  status:        statusPengaduanEnum('status').notNull().default('pending'),
  catatanAdmin:  text('catatan_admin'),
  createdAt:     timestamp('created_at').defaultNow().notNull(),
  updatedAt:     timestamp('updated_at').defaultNow().notNull(),
})

export type Pengaduan       = typeof pengaduan.$inferSelect
export type PengaduanInsert = typeof pengaduan.$inferInsert
export type KategoriPengaduan = typeof kategoriPengaduanEnum.enumValues[number]
export type StatusPengaduan   = typeof statusPengaduanEnum.enumValues[number]
