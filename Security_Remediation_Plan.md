# Rencana Perbaikan Keamanan & Teknis - website-pempek.vercel.app

## 1. Konfigurasi Application Layer (Next.js)
Target: Mengatasi *Missing Security Headers* dan *Information Disclosure*.

| Sub-tugas | Detail Implementasi |
| :--- | :--- |
| **Implementasi Security Headers** | Menambahkan header `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, dan `Referrer-Policy` pada file `next.config.js`. |
| **Konfigurasi Content Security Policy (CSP)** | Mendefinisikan kebijakan pemuatan resource untuk membatasi eksekusi script berbahaya dan framing situs. |
| **Penonaktifan X-Powered-By** | Mengatur properti `poweredByHeader: false` untuk menyembunyikan identitas teknologi server. |

## 2. Perbaikan Metadata & SEO
Target: Menghapus referensi lingkungan lokal pada lingkungan produksi.

| Sub-tugas | Detail Implementasi |
| :--- | :--- |
| **Koreksi robots.txt** | Mengubah direktif `Sitemap` dari `http://localhost:3000/sitemap.xml` menjadi URL produksi yang valid: `https://website-pempek.vercel.app/sitemap.xml`. |

## 3. Penguatan Keamanan Client-Side
Target: Mencegah serangan *Tabnabbing* dan kebocoran data pada navigasi eksternal.

| Sub-tugas | Detail Implementasi |
| :--- | :--- |
| **Audit Link Eksternal** | Memastikan semua elemen `<a>` yang mengarah ke domain luar (WhatsApp, Instagram, Google Maps) memiliki atribut `rel="noopener noreferrer"`. |

## 4. Validasi Pasca Perbaikan
Target: Memastikan perbaikan telah diterapkan dengan benar tanpa merusak fungsi situs.

| Sub-tugas | Metode Verifikasi |
| :--- | :--- |
| **Audit Header Ulang** | Menggunakan `curl -I` untuk memverifikasi keberadaan header baru. |
| **Pengecekan robots.txt** | Verifikasi langsung ke `/robots.txt` untuk memastikan URL sitemap sudah benar. |
| **Uji Fungsionalitas** | Memastikan elemen interaktif seperti Google Maps (iframe) tetap berfungsi di bawah kebijakan CSP yang baru. |
