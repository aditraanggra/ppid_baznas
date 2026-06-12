import { pgTable, uuid, varchar, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'
import { users } from './users'

/** Enum: kategori informasi publik sesuai UU KIP */
export const kategoriInformasiEnum = pgEnum('kategori_informasi', [
  'berkala',
  'serta_merta',
  'setiap_saat',
])

/** Enum: status alur permohonan */
export const statusPermohonanEnum = pgEnum('status_permohonan', [
  'pending',        // Baru masuk, belum divalidasi admin
  'diterima',       // Admin sudah validasi, mulai proses
  'klarifikasi',    // Admin meminta klarifikasi ke pemohon
  'diproses',       // Sedang diproses oleh pejabat PPID
  'selesai',        // Jawaban/dokumen sudah diberikan
  'ditolak',        // Ditolak dengan alasan & dasar hukum
  'perpanjangan',   // Diperpanjang (max +7 hari kerja)
  'keberatan',      // Pemohon mengajukan keberatan
])

/** Enum: cara mendapatkan informasi */
export const caraMendapatkanEnum = pgEnum('cara_mendapatkan', [
  'email',
  'langsung',
  'pos',
])

export const permohonan = pgTable('permohonan', {
  id:                  uuid('id').defaultRandom().primaryKey(),
  /** Format: PPID-YYYYMM-XXXX */
  nomorTiket:          varchar('nomor_tiket', { length: 20 }).notNull().unique(),
  namaPemohon:         varchar('nama_pemohon', { length: 100 }).notNull(),
  email:               varchar('email', { length: 255 }).notNull(),
  nomorIdentitas:      varchar('nomor_identitas', { length: 16 }).notNull(),
  alamat:              text('alamat').notNull(),
  nomorTelepon:        varchar('nomor_telepon', { length: 15 }),
  tujuanPermohonan:    text('tujuan_permohonan').notNull(),
  rincianInformasi:    text('rincian_informasi').notNull(),
  kategoriInformasi:   kategoriInformasiEnum('kategori_informasi').notNull(),
  caraMendapatkan:     caraMendapatkanEnum('cara_mendapatkan').notNull().default('email'),
  /** MinIO path: permohonan-lampiran/{id}/identitas.{ext} */
  lampiranIdentitas:   varchar('lampiran_identitas', { length: 500 }),
  status:              statusPermohonanEnum('status').notNull().default('pending'),
  catatanAdmin:        text('catatan_admin'),
  /** MinIO path: permohonan-lampiran/{id}/jawaban.{ext} */
  lampiranJawaban:     varchar('lampiran_jawaban', { length: 500 }),
  tanggalDiterima:     timestamp('tanggal_diterima'),
  /** Calculated: tanggalDiterima + 10 hari kerja */
  tanggalDeadline:     timestamp('tanggal_deadline'),
  tanggalPerpanjangan: timestamp('tanggal_perpanjangan'),
  tanggalSelesai:      timestamp('tanggal_selesai'),
  adminId:             uuid('admin_id').references(() => users.id),
  createdAt:           timestamp('created_at').defaultNow().notNull(),
  updatedAt:           timestamp('updated_at').defaultNow().notNull(),
})

export type Permohonan        = typeof permohonan.$inferSelect
export type PermohonanInsert  = typeof permohonan.$inferInsert
export type StatusPermohonan  = typeof statusPermohonanEnum.enumValues[number]
export type KategoriInformasi = typeof kategoriInformasiEnum.enumValues[number]
