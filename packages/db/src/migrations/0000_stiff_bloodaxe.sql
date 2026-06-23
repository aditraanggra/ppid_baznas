DO $$ BEGIN
 CREATE TYPE "public"."kategori_pengaduan" AS ENUM('pelayanan', 'penyaluran_zis', 'keberatan', 'lainnya');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."status_pengaduan" AS ENUM('pending', 'diproses', 'ditindaklanjuti', 'selesai');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."cara_mendapatkan" AS ENUM('email', 'langsung', 'pos');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."kategori_informasi" AS ENUM('berkala', 'serta_merta', 'setiap_saat');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."status_permohonan" AS ENUM('pending', 'diterima', 'klarifikasi', 'diproses', 'selesai', 'ditolak', 'perpanjangan', 'keberatan');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_role" AS ENUM('super_admin', 'admin_ppid', 'operator');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pengaduan" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nomor_tiket" varchar(20) NOT NULL,
	"nama" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"nomor_telepon" varchar(15),
	"kategori" "kategori_pengaduan" NOT NULL,
	"subjek" varchar(200) NOT NULL,
	"isi_pengaduan" text NOT NULL,
	"lampiran" varchar(500),
	"status" "status_pengaduan" DEFAULT 'pending' NOT NULL,
	"catatan_admin" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pengaduan_nomor_tiket_unique" UNIQUE("nomor_tiket")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "permohonan" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nomor_tiket" varchar(20) NOT NULL,
	"nama_pemohon" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"nomor_identitas" varchar(16) NOT NULL,
	"alamat" text NOT NULL,
	"nomor_telepon" varchar(15),
	"tujuan_permohonan" text NOT NULL,
	"rincian_informasi" text NOT NULL,
	"kategori_informasi" "kategori_informasi" NOT NULL,
	"cara_mendapatkan" "cara_mendapatkan" DEFAULT 'email' NOT NULL,
	"lampiran_identitas" varchar(500),
	"status" "status_permohonan" DEFAULT 'pending' NOT NULL,
	"catatan_admin" text,
	"lampiran_jawaban" varchar(500),
	"tanggal_diterima" timestamp,
	"tanggal_deadline" timestamp,
	"tanggal_perpanjangan" timestamp,
	"tanggal_selesai" timestamp,
	"admin_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "permohonan_nomor_tiket_unique" UNIQUE("nomor_tiket")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "riwayat_permohonan" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"permohonan_id" uuid NOT NULL,
	"status_dari" "status_permohonan",
	"status_ke" "status_permohonan" NOT NULL,
	"catatan" text,
	"user_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "admin_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" "user_role" DEFAULT 'operator' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "permohonan" ADD CONSTRAINT "permohonan_admin_id_admin_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admin_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "riwayat_permohonan" ADD CONSTRAINT "riwayat_permohonan_permohonan_id_permohonan_id_fk" FOREIGN KEY ("permohonan_id") REFERENCES "public"."permohonan"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "riwayat_permohonan" ADD CONSTRAINT "riwayat_permohonan_user_id_admin_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."admin_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
