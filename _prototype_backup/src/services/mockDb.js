const DEFAULT_PRODUCTS = [
  {
    id: "prod-1",
    name: "Pempek Kapal Selam",
    slug: "pempek-kapal-selam",
    description: "Pempek ukuran besar berisi telur ayam utuh disajikan dengan cuko kental pedas manis asam yang pas dan taburan bubuk ebi serta irisan timun segar.",
    price: 25000,
    status: "published",
    is_featured: true,
    images: [
      "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=600&auto=format&fit=crop&q=80"
    ],
    seo_title: "Pempek Kapal Selam Asli Palembang Enak Serpong - Cek Lis",
    seo_description: "Beli Pempek Kapal Selam jumbo isi telur ayam utuh di Serpong Tangerang Selatan. Dibuat dari ikan tenggiri segar berkualitas dengan cuko mantap."
  },
  {
    id: "prod-2",
    name: "Pempek Lenjer Besar",
    slug: "pempek-lenjer-besar",
    description: "Pempek lenjer ukuran besar dengan tekstur kenyal lembut rasa ikan tenggiri yang sangat terasa, pas disantap bersama keluarga.",
    price: 24000,
    status: "published",
    is_featured: true,
    images: [
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80"
    ],
    seo_title: "Pempek Lenjer Besar Tenggiri Asli Serpong - Cek Lis",
    seo_description: "Pempek Lenjer Besar asli Palembang di Tangerang Selatan. Terbuat dari ikan tenggiri premium, tanpa pengawet, kenyal, gurih, dan lezat."
  },
  {
    id: "prod-3",
    name: "Pempek Adaan (Bulat)",
    slug: "pempek-adaan",
    description: "Pempek berbentuk bulat gurih dengan campuran santan dan daun bawang, memberikan cita rasa khas wangi dan gurih.",
    price: 5000,
    status: "published",
    is_featured: true,
    images: [
      "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80"
    ],
    seo_title: "Pempek Adaan Bulat Gurih Tangerang Selatan - Cek Lis",
    seo_description: "Pempek Adaan gurih dengan daun bawang dan santan kelapa. Sangat pas dicocol ke cuko pedas manis khas Pempek Cek Lis Serpong."
  },
  {
    id: "prod-4",
    name: "Pempek Kulit Crispy",
    slug: "pempek-kulit",
    description: "Pempek yang terbuat dari kulit ikan tenggiri, digoreng garing di luar namun tetap lembut di dalam. Sangat renyah dan gurih.",
    price: 5000,
    status: "published",
    is_featured: true,
    images: [
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80"
    ],
    seo_title: "Pempek Kulit Ikan Tenggiri Renyah Tangerang Selatan - Cek Lis",
    seo_description: "Pempek kulit ikan tenggiri garing crispy diluar, kenyal didalam. Temukan pempek kulit terenak di Serpong BSD hanya di Pempek Cek Lis."
  },
  {
    id: "prod-5",
    name: "Tekwan Spesial Cek Lis",
    slug: "tekwan-spesial",
    description: "Sup khas Palembang dengan bulatan pempek kecil terbuat dari tenggiri, disajikan dengan kuah kaldu udang gurih, soun, jamur kuping, bengkoang, dan taburan daun seledri serta bawang goreng.",
    price: 20000,
    status: "published",
    is_featured: true,
    images: [
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop&q=80"
    ],
    seo_title: "Tekwan Asli Palembang Kuah Kaldu Udang Serpong - Cek Lis",
    seo_description: "Nikmati kesegaran sup Tekwan asli Palembang dengan kuah udang gurih di Tangerang Selatan. Cocok dinikmati hangat-hangat setiap hari."
  },
  {
    id: "prod-6",
    name: "Pempek Keriting",
    slug: "pempek-keriting",
    description: "Pempek dengan bentuk keriting unik yang dibuat menggunakan cetakan khusus. Memberikan sensasi makan pempek yang renyah dan menyerap kuah cuko dengan maksimal.",
    price: 5000,
    status: "published",
    is_featured: true,
    images: [
      "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=600&auto=format&fit=crop&q=80"
    ],
    seo_title: "Pempek Keriting Unik Lembut Asli Palembang - Cek Lis",
    seo_description: "Beli Pempek Keriting khas Palembang di Serpong. Bentuk unik keriting yang empuk menyerap cuko ebi lezat."
  },
  {
    id: "prod-7",
    name: "Paket Pempek Campur (20 Pcs)",
    slug: "paket-pempek-campur",
    description: "Paket hemat isi 20 pcs pempek campur (Adaan, Kulit, Lenjer Kecil, Keriting) lengkap dengan 1 botol cuko pedas sedang 250ml.",
    price: 95000,
    status: "published",
    is_featured: false,
    images: [
      "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80"
    ],
    seo_title: "Paket Pempek Campur Hemat Murah Tangerang Selatan - Cek Lis",
    seo_description: "Paket hemat pempek campur isi 20 pcs pas untuk kumpul keluarga. Dilengkapi cuko pedas mantap. Pesan antar area Tangsel."
  }
];

const DEFAULT_BANNERS = [
  {
    id: "banner-1",
    title: "Diskon Grand Opening 20%",
    desktop_image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop&q=80",
    mobile_image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80",
    cta_label: "Pesan Sekarang via WA",
    cta_url: "https://wa.me/6281234567890?text=Halo%20Pempek%20Cek%20Lis%2C%20saya%20ingin%20pesan%20promo%20Grand%20Opening%20diskon%2020%25",
    start_date: "2026-06-01",
    end_date: "2026-06-30",
    is_active: true
  },
  {
    id: "banner-2",
    title: "Promo Paket Kebersamaan Ramadan",
    desktop_image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&auto=format&fit=crop&q=80",
    mobile_image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80",
    cta_label: "Lihat Paket Promo",
    cta_url: "#produk",
    start_date: "2026-06-01",
    end_date: "2026-07-15",
    is_active: true
  }
];

const DEFAULT_TESTIMONIALS = [
  {
    id: "test-1",
    customer_name: "Budi Santoso",
    content: "Pempek Kapal Selamnya juara banget! Cukonya kental, pedas mantap dan beneran pakai ikan tenggiri asli berasa banget ikannya. Rekomen buat yang di BSD Tangsel.",
    is_published: true
  },
  {
    id: "test-2",
    customer_name: "Dewi Lestari",
    content: "Suka banget sama Pempek Kulit Crispy-nya, digoreng garing tapi dalemnya masih empuk. Anak-anak juga doyan sama Tekwannya yang kuahnya segar gurih rasa udang.",
    is_published: true
  },
  {
    id: "test-3",
    customer_name: "Rian Hidayat",
    content: "Pelayanannya cepat ramah lewat WhatsApp, langsung dikirim pakai GrabExpress nyampe rumah masih hangat. Pempek adaan nya wangi daun bawang gurih abis.",
    is_published: true
  },
  {
    id: "test-4",
    customer_name: "Siti Rahma",
    content: "Rasa cukonya otentik Palembang banget, manis asem pedesnya pas gak bikin batuk. Rekomendasi kuliner pempek terbaik di area Tangerang Selatan!",
    is_published: true
  }
];

const DEFAULT_GALLERY = [
  { id: "gal-1", image_url: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80", caption: "Pempek Kapal Selam Siap Sajal", gallery_type: "product" },
  { id: "gal-2", image_url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80", caption: "Pempek Lenjer Besar Segar", gallery_type: "product" },
  { id: "gal-3", image_url: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80", caption: "Pempek Adaan Daun Bawang", gallery_type: "product" },
  { id: "gal-4", image_url: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80", caption: "Pempek Kulit Crispy Menggoda", gallery_type: "product" },
  { id: "gal-5", image_url: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop&q=80", caption: "Tekwan Hangat Berkuah Kaldu", gallery_type: "product" },
  { id: "gal-6", image_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80", caption: "Area Kasir Toko Pempek Cek Lis", gallery_type: "store" },
  { id: "gal-7", image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80", caption: "Sajian Lengkap Pempek Palembang Cek Lis", gallery_type: "product" },
  { id: "gal-8", image_url: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=600&auto=format&fit=crop&q=80", caption: "Proses Menggoreng Pempek Keriting", gallery_type: "store" }
];

const DEFAULT_SETTINGS = {
  logoUrl: "", // Empty will use text logo "Pempek Cek Lis"
  brandName: "Pempek Palembang Cek Lis",
  tagline: "Kehangatan Cita Rasa Otentik Palembang di Tangerang Selatan",
  whatsappNumber: "6281234567890",
  instagramUsername: "pempekceklis.tangsel",
  gojekUrl: "https://gofood.link/a/pempekceklis",
  googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126906.91423237142!2d106.63725514335938!3d-6.284149899999992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69fbc80126bb6b%3A0x6b445cc3be783ff5!2sTangerang%20Selatan%2C%20Kota%20Tangerang%20Selatan%2C%20Banten!5e0!3m2!1sid!2sid!4v1717326848000!5m2!1sid!2sid",
  address: "Jl. Boulevard BSD No. 45, Serpong, Tangerang Selatan",
  workingHours: "Setiap Hari (10.00 – 21.00 WIB)",
  serviceAreas: ["Tangerang Selatan", "Serpong", "BSD", "Pamulang", "Ciputat"]
};

// Helper keys
const KEYS = {
  PRODUCTS: "ceklis_products",
  BANNERS: "ceklis_banners",
  TESTIMONIALS: "ceklis_testimonials",
  GALLERY: "ceklis_gallery",
  SETTINGS: "ceklis_settings"
};

// Database Initialization
const initDb = () => {
  if (!localStorage.getItem(KEYS.PRODUCTS)) {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
  }
  if (!localStorage.getItem(KEYS.BANNERS)) {
    localStorage.setItem(KEYS.BANNERS, JSON.stringify(DEFAULT_BANNERS));
  }
  if (!localStorage.getItem(KEYS.TESTIMONIALS)) {
    localStorage.setItem(KEYS.TESTIMONIALS, JSON.stringify(DEFAULT_TESTIMONIALS));
  }
  if (!localStorage.getItem(KEYS.GALLERY)) {
    localStorage.setItem(KEYS.GALLERY, JSON.stringify(DEFAULT_GALLERY));
  }
  if (!localStorage.getItem(KEYS.SETTINGS)) {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  }
};

// DB calls
export const mockDb = {
  init: () => {
    initDb();
  },

  // Products
  getProducts: () => {
    initDb();
    return JSON.parse(localStorage.getItem(KEYS.PRODUCTS));
  },
  saveProduct: (product) => {
    initDb();
    const products = mockDb.getProducts();
    if (product.id) {
      // update
      const idx = products.findIndex(p => p.id === product.id);
      if (idx !== -1) {
        products[idx] = { ...products[idx], ...product };
      }
    } else {
      // insert
      const newProduct = {
        ...product,
        id: "prod-" + Date.now(),
        slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      };
      products.push(newProduct);
    }
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
    return products;
  },
  deleteProduct: (id) => {
    initDb();
    let products = mockDb.getProducts();
    products = products.filter(p => p.id !== id);
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
    return products;
  },

  // Banners
  getBanners: () => {
    initDb();
    return JSON.parse(localStorage.getItem(KEYS.BANNERS));
  },
  saveBanner: (banner) => {
    initDb();
    const banners = mockDb.getBanners();
    if (banner.id) {
      const idx = banners.findIndex(b => b.id === banner.id);
      if (idx !== -1) {
        banners[idx] = { ...banners[idx], ...banner };
      }
    } else {
      const newBanner = {
        ...banner,
        id: "banner-" + Date.now()
      };
      banners.push(newBanner);
    }
    localStorage.setItem(KEYS.BANNERS, JSON.stringify(banners));
    return banners;
  },
  deleteBanner: (id) => {
    initDb();
    let banners = mockDb.getBanners();
    banners = banners.filter(b => b.id !== id);
    localStorage.setItem(KEYS.BANNERS, JSON.stringify(banners));
    return banners;
  },

  // Testimonials
  getTestimonials: () => {
    initDb();
    return JSON.parse(localStorage.getItem(KEYS.TESTIMONIALS));
  },
  saveTestimonial: (testimonial) => {
    initDb();
    const testimonials = mockDb.getTestimonials();
    if (testimonial.id) {
      const idx = testimonials.findIndex(t => t.id === testimonial.id);
      if (idx !== -1) {
        testimonials[idx] = { ...testimonials[idx], ...testimonial };
      }
    } else {
      const newTestimonial = {
        ...testimonial,
        id: "test-" + Date.now()
      };
      testimonials.push(newTestimonial);
    }
    localStorage.setItem(KEYS.TESTIMONIALS, JSON.stringify(testimonials));
    return testimonials;
  },
  deleteTestimonial: (id) => {
    initDb();
    let testimonials = mockDb.getTestimonials();
    testimonials = testimonials.filter(t => t.id !== id);
    localStorage.setItem(KEYS.TESTIMONIALS, JSON.stringify(testimonials));
    return testimonials;
  },

  // Gallery
  getGallery: () => {
    initDb();
    return JSON.parse(localStorage.getItem(KEYS.GALLERY));
  },
  saveGallery: (galleryItem) => {
    initDb();
    const gallery = mockDb.getGallery();
    if (galleryItem.id) {
      const idx = gallery.findIndex(g => g.id === galleryItem.id);
      if (idx !== -1) {
        gallery[idx] = { ...gallery[idx], ...galleryItem };
      }
    } else {
      const newGalleryItem = {
        ...galleryItem,
        id: "gal-" + Date.now()
      };
      gallery.push(newGalleryItem);
    }
    localStorage.setItem(KEYS.GALLERY, JSON.stringify(gallery));
    return gallery;
  },
  deleteGallery: (id) => {
    initDb();
    let gallery = mockDb.getGallery();
    gallery = gallery.filter(g => g.id !== id);
    localStorage.setItem(KEYS.GALLERY, JSON.stringify(gallery));
    return gallery;
  },

  // Settings
  getSettings: () => {
    initDb();
    return JSON.parse(localStorage.getItem(KEYS.SETTINGS));
  },
  saveSettings: (settings) => {
    initDb();
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    return settings;
  }
};
