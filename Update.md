# Saran Perbaikan Website - website-pempek.vercel.app
Tanggal: Rabu, 10 Juni 2026

Berdasarkan hasil audit teknis, berikut adalah saran perbaikan untuk meningkatkan keamanan, performa, dan SEO website Anda.

---

## 🔴 TEMUAN KEAMANAN KRITIS (VULNERABILITIES)

### 1. Broken Access Control di `/dashboard`
**Tingkat Keparahan:** CRITICAL
- **Temuan:** Halaman Dashboard Admin dapat diakses secara publik tanpa login.
- **Dampak:** Siapapun dapat melihat data internal bisnis (tayangan halaman, jumlah pengunjung unik, popularitas produk) dan detail sistem (penggunaan Supabase).
- **Saran Perbaikan:** Implementasikan pengecekan sesi (server-side check) menggunakan middleware Next.js atau pada komponen halaman dashboard. Pastikan data tidak di-fetch dari database sebelum sesi user divalidasi.

### 2. Kebocoran Informasi (Information Disclosure)
**Tingkat Keparahan:** HIGH
- **Temuan:** Metadata dan state internal (RSC Payloads) mengirimkan informasi teknis yang sensitif ke browser publik.
- **Saran Perbaikan:** Lakukan sanitasi pada data yang dikirim ke client. Jangan menyertakan detail infrastruktur database atau kunci API internal dalam payload yang bisa diintip via "View Source".

### 3. Kesalahan Konfigurasi `robots.txt`
**Tingkat Keparahan:** LOW
- **Temuan:** File `robots.txt` masih mengarah ke `http://localhost:3000/sitemap.xml`.
- **Dampak:** Mesin pencari (Google) tidak dapat menemukan sitemap Anda, yang menghambat indexing.
- **Saran Perbaikan:** Ubah URL sitemap menjadi `https://website-pempek.vercel.app/sitemap.xml`.

---

## 🟡 PENINGKATAN KEAMANAN (Security Headers)
Meskipun website sudah menggunakan HTTPS dan HSTS, beberapa header keamanan penting belum terkonfigurasi. Tambahkan konfigurasi berikut pada `next.config.js`:

- **X-Frame-Options**: Set ke `DENY` untuk mencegah serangan Clickjacking.
- **X-Content-Type-Options**: Set ke `nosniff`.
- **Content-Security-Policy (CSP)**: Tambahkan kebijakan CSP yang ketat untuk membatasi eksekusi script asing.
- **Referrer-Policy**: Set ke `strict-origin-when-cross-origin`.
- **Sembunyikan Teknologi**: Matikan header `X-Powered-By`.

---

## 🟢 SEO, MEDIA SOSIAL & PERFORMA
Website sudah memiliki optimasi lokal yang sangat baik, namun bisa ditingkatkan dengan:

- **Open Graph (OG) Tags**: Tambahkan meta tags sosial media agar preview saat share di WhatsApp/Instagram muncul dengan gambar dan judul yang menarik.
- **Canonical URL**: Tambahkan `<link rel="canonical" href="https://website-pempek.vercel.app/" />`.
- **Schema Markup**: Implementasikan *LocalBusiness* Schema (JSON-LD) untuk alamat dan jam buka.
- **Optimasi Gambar**: Pastikan semua gambar menggunakan format modern seperti WebP melalui komponen `next/image`.

---

## ✅ Checklist Verifikasi untuk AI Coding Agent:
1. [ ] Pastikan akses `/dashboard` me-redirect ke `/login` jika belum login.
2. [ ] Jalankan `curl -I` dan pastikan header `X-Frame-Options` muncul.
3. [ ] Pastikan file `robots.txt` di domain produksi tidak mengandung kata "localhost".
