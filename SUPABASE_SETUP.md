# Panduan Setup Supabase - Pempek Palembang Cek Lis

Dokumen ini memandu Anda melakukan migrasi dan konfigurasi backend Supabase (Database, Auth, dan Storage).

---

## 1. Buat Proyek di Supabase
1. Buka [Supabase Dashboard](https://supabase.com/) dan buat proyek baru (misalnya dengan nama `pempek-ceklis`).
2. Masukkan password database dan pilih region terdekat (misal: **Singapore / asia-southeast1**).
3. Setelah proyek selesai dibuat, buka menu **Project Settings > API** di sidebar bawah untuk mendapatkan:
   - **Project URL** (Gunakan sebagai `NEXT_PUBLIC_SUPABASE_URL`)
   - **API Key Anon / Public** (Gunakan sebagai `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

---

## 2. Setup Database Schema & Policies
1. Buka menu **SQL Editor** pada sidebar kiri panel Supabase Anda.
2. Klik **New query** (Kueri baru).
3. Salin seluruh isi berkas [supabase_schema.sql](file:///C:/Users/Ahmad/.gemini/antigravity/scratch/pempek-cek-lis/supabase_schema.sql) dari proyek lokal Anda dan tempel (*paste*) ke editor.
4. Klik tombol **Run** (Jalankan) di bagian kanan bawah.
5. Skema tabel PostgreSQL, relasi, fungsi pembantu, dan aturan keamanan (Row Level Security) akan otomatis terkonfigurasi.

---

## 3. Konfigurasi Storage Bucket (Unggah Gambar)
1. Buka menu **Storage** di sidebar kiri panel Supabase.
2. Klik tombol **New bucket** (Bucket baru).
3. Beri nama bucket **`pempek-cek-lis`**.
4. Aktifkan opsi **Public bucket** (agar gambar yang diunggah dapat diakses/di-render di website utama secara langsung tanpa token privat).
5. Klik **Save**.
6. Buka tab **Policies** pada bucket tersebut, pastikan RLS mengizinkan penulisan (Write) bagi pengguna terautentikasi (sudah diatur otomatis oleh skema SQL). Jika belum, tambahkan policy baru untuk bucket `pempek-cek-lis`:
   - Opsi: `Insert`, `Update`, `Delete`.
   - Syarat: `auth.role() = 'authenticated'` (atau `true` untuk testing bebas).

---

## 4. Isi Variabel Lingkungan (.env.local)
Perbarui berkas `.env.local` pada kedua aplikasi Anda:

### A. Untuk Aplikasi Web ([apps/web/.env.local](file:///C:/Users/Ahmad/.gemini/antigravity/scratch/pempek-cek-lis/apps/web/.env.local))
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### B. Untuk Portal Admin ([apps/admin/.env.local](file:///C:/Users/Ahmad/.gemini/antigravity/scratch/pempek-cek-lis/apps/admin/.env.local))
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 5. Jalankan Seeding Awal
Setelah berkas `.env.local` terisi dengan benar, buka terminal di folder proyek Anda dan jalankan perintah berikut untuk mengisi data awal produk, banner promo, dan setelan toko ke Supabase:
```bash
pnpm --filter @pempek-ceklis/lib seed
```

---

## 6. Buat Akun Admin Pertama
1. Buka menu **Authentication > Users** di panel Supabase Anda.
2. Klik tombol **Add user** dan pilih **Create user**.
3. Masukkan Email dan Password untuk akun administrator Anda.
4. Matikan opsi *Auto-confirm user* jika ingin memverifikasi email, atau biarkan menyala agar akun langsung aktif.
5. Klik **Create user**.
6. Setelah user terdaftar, salin **User UID** miliknya.
7. Masuk ke **Table Editor > users** di panel Supabase, tambahkan baris baru dengan:
   - `uid`: Tempelkan UID yang disalin.
   - `email`: Email admin Anda.
   - `role`: Isi dengan **`developer`** (agar memiliki akses menu penuh) atau **`admin`**.
8. Klik **Save**.

Sekarang, Anda sudah bisa login di portal admin lokal Anda (`http://localhost:3001/login`) menggunakan email dan password tersebut!
