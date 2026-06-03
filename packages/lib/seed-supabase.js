import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read environment variables from env files
const getEnvVars = () => {
  const envPaths = [
    path.join(__dirname, "../../apps/admin/.env.local"),
    path.join(__dirname, "../../apps/web/.env.local"),
    path.join(__dirname, "../../../.env.local"),
    path.join(__dirname, "../.env.local")
  ];
  
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  let serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  for (const p of envPaths) {
    if (fs.existsSync(p)) {
      console.log(`Membaca variabel lingkungan dari: ${p}`);
      const content = fs.readFileSync(p, "utf-8");
      const lines = content.split("\n");
      for (const line of lines) {
        const parts = line.split("=");
        if (parts.length >= 2) {
          const key = parts[0].trim();
          const val = parts.slice(1).join("=").trim().replace(/^['"]|['"]$/g, "");
          if (key === "NEXT_PUBLIC_SUPABASE_URL") supabaseUrl = val;
          if (key === "NEXT_PUBLIC_SUPABASE_ANON_KEY") supabaseAnonKey = val;
          if (key === "SUPABASE_SERVICE_ROLE_KEY") serviceRoleKey = val;
        }
      }
      break;
    }
  }

  return { supabaseUrl, supabaseAnonKey, serviceRoleKey };
};

const { supabaseUrl, supabaseAnonKey, serviceRoleKey } = getEnvVars();

if (!supabaseUrl || (!supabaseAnonKey && !serviceRoleKey)) {
  console.error("ERROR: NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY wajib didefinisikan di berkas .env.local!");
  process.exit(1);
}

// Prefer service role key for seeding to bypass RLS policies if necessary
const clientKey = serviceRoleKey || supabaseAnonKey;
console.log(`Menghubungkan ke Supabase di: ${supabaseUrl}`);
const supabase = createClient(supabaseUrl, clientKey);

// Mock Initial Data
const PRODUCTS = [
  {
    name: "Pempek Kapal Selam",
    slug: "pempek-kapal-selam",
    description: "Pempek ukuran besar berisi telur ayam utuh disajikan dengan cuko kental pedas manis asam yang pas dan taburan bubuk ebi serta irisan timun segar.",
    price: 25000,
    status: "published",
    featured: true,
    images: ["https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=600&auto=format&fit=crop&q=80"],
    seo_title: "Pempek Kapal Selam Asli Palembang Enak Serpong - Cek Lis",
    seo_description: "Beli Pempek Kapal Selam jumbo isi telur ayam utuh di Serpong Tangerang Selatan. Dibuat dari ikan tenggiri segar berkualitas dengan cuko mantap."
  },
  {
    name: "Pempek Lenjer Besar",
    slug: "pempek-lenjer-besar",
    description: "Pempek lenjer ukuran besar dengan tekstur kenyal lembut rasa ikan tenggiri yang sangat terasa, pas disantap bersama keluarga.",
    price: 24000,
    status: "published",
    featured: true,
    images: ["https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80"],
    seo_title: "Pempek Lenjer Besar Tenggiri Asli Serpong - Cek Lis",
    seo_description: "Pempek Lenjer Besar asli Palembang di Tangerang Selatan. Terbuat dari ikan tenggiri premium, tanpa pengawet, kenyal, gurih, dan lezat."
  },
  {
    name: "Pempek Adaan (Bulat)",
    slug: "pempek-adaan",
    description: "Pempek berbentuk bulat gurih dengan campuran santan dan daun bawang, memberikan cita rasa khas wangi dan gurih.",
    price: 5000,
    status: "published",
    featured: true,
    images: ["https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80"],
    seo_title: "Pempek Adaan Bulat Gurih Tangerang Selatan - Cek Lis",
    seo_description: "Pempek Adaan gurih dengan daun bawang dan santan kelapa. Sangat pas dicocol ke cuko pedas manis khas Pempek Cek Lis Serpong."
  },
  {
    name: "Pempek Kulit Crispy",
    slug: "pempek-kulit",
    description: "Pempek yang terbuat dari kulit ikan tenggiri, digoreng garing di luar namun tetap lembut di dalam. Sangat renyah dan gurih.",
    price: 5000,
    status: "published",
    featured: true,
    images: ["https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80"],
    seo_title: "Pempek Kulit Ikan Tenggiri Renyah Tangerang Selatan - Cek Lis",
    seo_description: "Pempek kulit ikan tenggiri garing crispy diluar, kenyal didalam. Temukan pempek kulit terenak di Serpong BSD hanya di Pempek Cek Lis."
  },
  {
    name: "Tekwan Spesial Cek Lis",
    slug: "tekwan-spesial",
    description: "Sup khas Palembang dengan bulatan pempek kecil terbuat dari tenggiri, disajikan dengan kuah kaldu udang gurih, soun, jamur kuping, bengkoang, dan taburan daun seledri serta bawang goreng.",
    price: 20000,
    status: "published",
    featured: true,
    images: ["https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop&q=80"],
    seo_title: "Tekwan Asli Palembang Kuah Kaldu Udang Serpong - Cek Lis",
    seo_description: "Nikmati kesegaran sup Tekwan asli Palembang dengan kuah udang gurih di Tangerang Selatan. Cocok dinikmati hangat-hangat setiap hari."
  },
  {
    name: "Pempek Keriting",
    slug: "pempek-keriting",
    description: "Pempek dengan bentuk keriting unik yang dibuat menggunakan cetakan khusus. Memberikan sensasi makan pempek yang renyah dan menyerap kuah cuko dengan maksimal.",
    price: 5000,
    status: "published",
    featured: true,
    images: ["https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=600&auto=format&fit=crop&q=80"],
    seo_title: "Pempek Keriting Unik Lembut Asli Palembang - Cek Lis",
    seo_description: "Beli Pempek Keriting khas Palembang di Serpong. Bentuk unik keriting yang empuk menyerap cuko ebi lezat."
  },
  {
    name: "Paket Pempek Campur (20 Pcs)",
    slug: "paket-pempek-campur",
    description: "Paket hemat isi 20 pcs pempek campur (Adaan, Kulit, Lenjer Kecil, Keriting) lengkap dengan 1 botol cuko pedas sedang 250ml.",
    price: 95000,
    status: "published",
    featured: false,
    images: ["https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80"],
    seo_title: "Paket Pempek Campur Hemat Murah Tangerang Selatan - Cek Lis",
    seo_description: "Paket hemat pempek campur isi 20 pcs pas untuk kumpul keluarga. Dilengkapi cuko pedas mantap. Pesan antar area Tangsel."
  }
];

const BANNERS = [
  {
    title: "Diskon Grand Opening 20%",
    desktop_image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop&q=80",
    mobile_image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80",
    button_text: "Pesan Sekarang via WA",
    button_url: "https://wa.me/6281234567890?text=Halo%20Pempek%20Cek%20Lis%2C%20saya%20ingin%20pesan%20promo%20Grand%20Opening%20diskon%2020%25",
    active: true,
    start_date: "2026-06-01",
    end_date: "2026-12-31",
    sort_order: 1
  },
  {
    title: "Promo Paket Kebersamaan Ramadan",
    desktop_image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&auto=format&fit=crop&q=80",
    mobile_image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80",
    button_text: "Lihat Paket Promo",
    button_url: "#produk",
    active: true,
    start_date: "2026-06-01",
    end_date: "2026-08-31",
    sort_order: 2
  }
];

const TESTIMONIALS = [
  {
    customer_name: "Budi Santoso",
    content: "Pempek Kapal Selamnya juara banget! Cukonya kental, pedas mantap dan beneran pakai ikan tenggiri asli berasa banget ikannya. Rekomen buat yang di BSD Tangsel.",
    published: true
  },
  {
    customer_name: "Dewi Lestari",
    content: "Suka banget sama Pempek Kulit Crispy-nya, digoreng garing tapi dalemnya masih empuk. Anak-anak juga doyan sama Tekwannya yang kuahnya segar gurih rasa udang.",
    published: true
  },
  {
    customer_name: "Rian Hidayat",
    content: "Pelayanannya cepat ramah lewat WhatsApp, langsung dikirim pakai GrabExpress nyampe rumah masih hangat. Pempek adaan nya wangi daun bawang gurih abis.",
    published: true
  },
  {
    customer_name: "Siti Rahma",
    content: "Rasa cukonya otentik Palembang banget, manis asem pedesnya pas gak bikin batuk. Rekomendasi kuliner pempek terbaik di area Tangerang Selatan!",
    published: true
  }
];

const GALLERY = [
  { image_url: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80", caption: "Pempek Kapal Selam Siap Saji", type: "product", sort_order: 1 },
  { image_url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80", caption: "Pempek Lenjer Besar Segar", type: "product", sort_order: 2 },
  { image_url: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80", caption: "Pempek Adaan Daun Bawang", type: "product", sort_order: 3 },
  { image_url: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80", caption: "Pempek Kulit Crispy Menggoda", type: "product", sort_order: 4 },
  { image_url: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop&q=80", caption: "Tekwan Hangat Berkuah Kaldu", type: "product", sort_order: 5 },
  { image_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80", caption: "Area Kasir Toko Pempek Cek Lis", type: "store", sort_order: 6 },
  { image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80", caption: "Sajian Lengkap Pempek Palembang Cek Lis", type: "product", sort_order: 7 },
  { image_url: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=600&auto=format&fit=crop&q=80", caption: "Proses Menggoreng Pempek Keriting", type: "store", sort_order: 8 }
];

const SETTINGS = {
  id: "website",
  site_name: "Pempek Palembang Cek Lis",
  hero_title: "Pempek Palembang Cek Lis",
  hero_subtitle: "Kehangatan Cita Rasa Otentik Palembang di Tangerang Selatan",
  phone: "6281234567890",
  whatsapp: "6281234567890",
  instagram: "pempekceklis.tangsel",
  address: "Jl. Boulevard BSD No. 45, Serpong, Tangerang Selatan",
  google_maps_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126906.91423237142!2d106.63725514335938!3d-6.284149899999992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69fbc80126bb6b%3A0x6b445cc3be783ff5!2sTangerang%20Selatan%2C%20Kota%20Tangerang%20Selatan%2C%20Banten!5e0!3m2!1sid!2sid!4v1717326848000!5m2!1sid!2sid",
  business_hours: "Setiap Hari (10.00 – 21.00 WIB)"
};

async function runSeed() {
  console.log("=== Memulai Seeding Supabase ===");

  try {
    // 1. Seed Settings
    console.log("1. Mengisi Setelan Toko...");
    const { error: settingsErr } = await supabase.from("settings").upsert(SETTINGS);
    if (settingsErr) throw settingsErr;
    console.log("✔ Setelan Toko berhasil di-seed.");

    // 2. Seed Products
    console.log("2. Mengisi Data Produk...");
    // Clear and insert
    await supabase.from("products").delete().neq("id", "dummy");
    const { error: prodErr } = await supabase.from("products").insert(PRODUCTS);
    if (prodErr) throw prodErr;
    console.log("✔ Data Produk berhasil di-seed.");

    // 3. Seed Banners
    console.log("3. Mengisi Data Banner...");
    await supabase.from("banners").delete().neq("id", "dummy");
    const { error: banErr } = await supabase.from("banners").insert(BANNERS);
    if (banErr) throw banErr;
    console.log("✔ Data Banner berhasil di-seed.");

    // 4. Seed Testimonials
    console.log("4. Mengisi Data Testimoni...");
    await supabase.from("testimonials").delete().neq("id", "dummy");
    const { error: testErr } = await supabase.from("testimonials").insert(TESTIMONIALS);
    if (testErr) throw testErr;
    console.log("✔ Data Testimoni berhasil di-seed.");

    // 5. Seed Gallery
    console.log("5. Mengisi Data Galeri...");
    await supabase.from("gallery").delete().neq("id", "dummy");
    const { error: galErr } = await supabase.from("gallery").insert(GALLERY);
    if (galErr) throw galErr;
    console.log("✔ Data Galeri berhasil di-seed.");

    console.log("\nSeeding Supabase Selesai dengan Sukses!");
    console.log("CATATAN: Akun admin pertama harus dibuat secara manual di halaman registrasi Supabase Auth / Console.");
  } catch (err) {
    console.error("Gagal melakukan seeding database:", err);
    process.exit(1);
  }
}

runSeed();
