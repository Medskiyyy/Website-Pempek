import { supabase, isSupabaseConfigured, supabaseAdmin } from "./supabase";
import { Product, Banner, Testimonial, GalleryItem, Settings, User } from "@pempek-ceklis/types";

// Fallback Mock Data for Offline/Unconfigured Testing
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Pempek Kapal Selam",
    slug: "pempek-kapal-selam",
    description: "Pempek ukuran besar berisi telur ayam utuh disajikan dengan cuko kental pedas manis asam yang pas dan taburan bubuk ebi serta irisan timun segar.",
    price: 25000,
    status: "published",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=600&auto=format&fit=crop&q=80"
    ],
    seoTitle: "Pempek Kapal Selam Asli Palembang Enak Serpong - Cek Lis",
    seoDescription: "Beli Pempek Kapal Selam jumbo isi telur ayam utuh di Serpong Tangerang Selatan. Dibuat dari ikan tenggiri segar berkualitas dengan cuko mantap."
  },
  {
    id: "prod-2",
    name: "Pempek Lenjer Besar",
    slug: "pempek-lenjer-besar",
    description: "Pempek lenjer ukuran besar dengan tekstur kenyal lembut rasa ikan tenggiri yang sangat terasa, pas disantap bersama keluarga.",
    price: 24000,
    status: "published",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80"
    ],
    seoTitle: "Pempek Lenjer Besar Tenggiri Asli Serpong - Cek Lis",
    seoDescription: "Pempek Lenjer Besar asli Palembang di Tangerang Selatan. Terbuat dari ikan tenggiri premium, tanpa pengawet, kenyal, gurih, dan lezat."
  },
  {
    id: "prod-3",
    name: "Pempek Adaan (Bulat)",
    slug: "pempek-adaan",
    description: "Pempek berbentuk bulat gurih dengan campuran santan dan daun bawang, memberikan cita rasa khas wangi dan gurih.",
    price: 5000,
    status: "published",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80"
    ],
    seoTitle: "Pempek Adaan Bulat Gurih Tangerang Selatan - Cek Lis",
    seoDescription: "Pempek Adaan gurih dengan daun bawang dan santan kelapa. Sangat pas dicocol ke cuko pedas manis khas Pempek Cek Lis Serpong."
  },
  {
    id: "prod-4",
    name: "Pempek Kulit Crispy",
    slug: "pempek-kulit",
    description: "Pempek yang terbuat dari kulit ikan tenggiri, digoreng garing di luar namun tetap lembut di dalam. Sangat renyah dan gurih.",
    price: 5000,
    status: "published",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80"
    ],
    seoTitle: "Pempek Kulit Ikan Tenggiri Renyah Tangerang Selatan - Cek Lis",
    seoDescription: "Pempek kulit ikan tenggiri garing crispy diluar, kenyal didalam. Temukan pempek kulit terenak di Serpong BSD hanya di Pempek Cek Lis."
  },
  {
    id: "prod-5",
    name: "Tekwan Spesial Cek Lis",
    slug: "tekwan-spesial",
    description: "Sup khas Palembang dengan bulatan pempek kecil terbuat dari tenggiri, disajikan dengan kuah kaldu udang gurih, soun, jamur kuping, bengkoang, dan taburan daun seledri serta bawang goreng.",
    price: 20000,
    status: "published",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop&q=80"
    ],
    seoTitle: "Tekwan Asli Palembang Kuah Kaldu Udang Serpong - Cek Lis",
    seoDescription: "Nikmati kesegaran sup Tekwan asli Palembang dengan kuah udang gurih di Tangerang Selatan. Cocok dinikmati hangat-hangat setiap hari."
  },
  {
    id: "prod-6",
    name: "Pempek Keriting",
    slug: "pempek-keriting",
    description: "Pempek dengan bentuk keriting unik yang dibuat menggunakan cetakan khusus. Memberikan sensasi makan pempek yang renyah dan menyerap kuah cuko dengan maksimal.",
    price: 5000,
    status: "published",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=600&auto=format&fit=crop&q=80"
    ],
    seoTitle: "Pempek Keriting Unik Lembut Asli Palembang - Cek Lis",
    seoDescription: "Beli Pempek Keriting khas Palembang di Serpong. Bentuk unik keriting yang empuk menyerap cuko ebi lezat."
  },
  {
    id: "prod-7",
    name: "Paket Pempek Campur (20 Pcs)",
    slug: "paket-pempek-campur",
    description: "Paket hemat isi 20 pcs pempek campur (Adaan, Kulit, Lenjer Kecil, Keriting) lengkap dengan 1 botol cuko pedas sedang 250ml.",
    price: 95000,
    status: "published",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80"
    ],
    seoTitle: "Paket Pempek Campur Hemat Murah Tangerang Selatan - Cek Lis",
    seoDescription: "Paket hemat pempek campur isi 20 pcs pas untuk kumpul keluarga. Dilengkapi cuko pedas mantap. Pesan antar area Tangsel."
  }
];

const FALLBACK_BANNERS: Banner[] = [
  {
    id: "banner-1",
    title: "Diskon Grand Opening 20%",
    desktopImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop&q=80",
    mobileImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80",
    buttonText: "Pesan Sekarang via WA",
    buttonUrl: "https://wa.me/6281234567890?text=Halo%20Pempek%20Cek%20Lis%2C%20saya%20ingin%20pesan%20promo%20Grand%20Opening%20diskon%2020%25",
    active: true,
    startDate: "2026-06-01",
    endDate: "2026-12-31",
    sortOrder: 1
  },
  {
    id: "banner-2",
    title: "Promo Paket Kebersamaan Ramadan",
    desktopImage: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&auto=format&fit=crop&q=80",
    mobileImage: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80",
    buttonText: "Lihat Paket Promo",
    buttonUrl: "#produk",
    active: true,
    startDate: "2026-06-01",
    endDate: "2026-08-31",
    sortOrder: 2
  }
];

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    customerName: "Budi Santoso",
    content: "Pempek Kapal Selamnya juara banget! Cukonya kental, pedas mantap dan beneran pakai ikan tenggiri asli berasa banget ikannya. Rekomen buat yang di BSD Tangsel.",
    published: true
  },
  {
    id: "test-2",
    customerName: "Dewi Lestari",
    content: "Suka banget sama Pempek Kulit Crispy-nya, digoreng garing tapi dalemnya masih empuk. Anak-anak juga doyan sama Tekwannya yang kuahnya segar gurih rasa udang.",
    published: true
  },
  {
    id: "test-3",
    customerName: "Rian Hidayat",
    content: "Pelayanannya cepat ramah lewat WhatsApp, langsung dikirim pakai GrabExpress nyampe rumah masih hangat. Pempek adaan nya wangi daun bawang gurih abis.",
    published: true
  },
  {
    id: "test-4",
    customerName: "Siti Rahma",
    content: "Rasa cukonya otentik Palembang banget, manis asem pedesnya pas gak bikin batuk. Rekomendasi kuliner pempek terbaik di area Tangerang Selatan!",
    published: true
  }
];

const FALLBACK_GALLERY: GalleryItem[] = [
  { id: "gal-1", imageUrl: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80", caption: "Pempek Kapal Selam Siap Saji", type: "product", sortOrder: 1 },
  { id: "gal-2", imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80", caption: "Pempek Lenjer Besar Segar", type: "product", sortOrder: 2 },
  { id: "gal-3", imageUrl: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80", caption: "Pempek Adaan Daun Bawang", type: "product", sortOrder: 3 },
  { id: "gal-4", imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80", caption: "Pempek Kulit Crispy Menggoda", type: "product", sortOrder: 4 },
  { id: "gal-5", imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop&q=80", caption: "Tekwan Hangat Berkuah Kaldu", type: "product", sortOrder: 5 },
  { id: "gal-6", imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80", caption: "Area Kasir Toko Pempek Cek Lis", type: "store", sortOrder: 6 },
  { id: "gal-7", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80", caption: "Sajian Lengkap Pempek Palembang Cek Lis", type: "product", sortOrder: 7 },
  { id: "gal-8", imageUrl: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=600&auto=format&fit=crop&q=80", caption: "Proses Menggoreng Pempek Keriting", type: "store", sortOrder: 8 }
];

const FALLBACK_SETTINGS: Settings = {
  siteName: "Pempek Palembang Cek Lis",
  heroTitle: "Pempek Palembang Cek Lis",
  heroSubtitle: "Kehangatan Cita Rasa Otentik Palembang di Tangerang Selatan",
  heroImage: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=1200&auto=format&fit=crop&q=80",
  phone: "6281234567890",
  whatsapp: "6281234567890",
  instagram: "pempekceklis.tangsel",
  address: "Jl. Boulevard BSD No. 45, Serpong, Tangerang Selatan",
  googleMapsUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126906.91423237142!2d106.63725514335938!3d-6.284149899999992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69fbc80126bb6b%3A0x6b445cc3be783ff5!2sTangerang%20Selatan%2C%20Kota%20Tangerang%20Selatan%2C%20Banten!5e0!3m2!1sid!2sid!4v1717326848000!5m2!1sid!2sid",
  businessHours: "Setiap Hari (10.00 – 21.00 WIB)"
};

const FALLBACK_USERS: User[] = [
  { uid: "dev-user", email: "dev@pempekceklis.com", role: "developer" },
  { uid: "admin-user", email: "admin@pempekceklis.com", role: "admin" }
];

// Helper to serialize PostgreSQL rows to matching client Types
const serializeDate = (val: any): string | undefined => {
  if (!val) return undefined;
  return new Date(val).toISOString();
};

const getLocalData = (key: string, defaultVal: any) => {
  if (typeof window !== "undefined") {
    const val = localStorage.getItem(`ceklis_${key}`);
    if (val) return JSON.parse(val);
  }
  return defaultVal;
};

const saveLocalData = (key: string, data: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(`ceklis_${key}`, JSON.stringify(data));
  }
};

// CRUD for Products
export const dbProducts = {
  getAll: async (status?: "published" | "draft"): Promise<Product[]> => {
    if (!isSupabaseConfigured) {
      const prods = getLocalData("products", FALLBACK_PRODUCTS) as Product[];
      if (status) return prods.filter(p => p.status === status);
      return prods;
    }
    let query = supabase.from("products").select("*");
    if (status) query = query.eq("status", status);
    
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;
    
    return (data || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      featured: p.featured,
      status: p.status,
      images: p.images,
      seoTitle: p.seo_title || "",
      seoDescription: p.seo_description || "",
      createdAt: serializeDate(p.created_at),
      updatedAt: serializeDate(p.updated_at)
    })) as Product[];
  },

  getBySlug: async (slug: string): Promise<Product | null> => {
    if (!isSupabaseConfigured) {
      const prods = getLocalData("products", FALLBACK_PRODUCTS) as Product[];
      return prods.find(p => p.slug === slug) || null;
    }
    const { data, error } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: data.price,
      featured: data.featured,
      status: data.status,
      images: data.images,
      seoTitle: data.seo_title || "",
      seoDescription: data.seo_description || "",
      createdAt: serializeDate(data.created_at),
      updatedAt: serializeDate(data.updated_at)
    } as Product;
  },

  save: async (product: Product): Promise<string> => {
    if (!isSupabaseConfigured) {
      const prods = getLocalData("products", FALLBACK_PRODUCTS) as Product[];
      const id = product.id || "prod-" + Date.now();
      const updated = {
        ...product,
        id,
        createdAt: product.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      };
      const idx = prods.findIndex(p => p.id === id);
      if (idx !== -1) prods[idx] = updated;
      else prods.push(updated);
      saveLocalData("products", prods);
      return id;
    }

    const payload = {
      name: product.name,
      slug: product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      description: product.description,
      price: product.price,
      featured: product.featured,
      status: product.status,
      images: product.images,
      seo_title: product.seoTitle,
      seo_description: product.seoDescription,
      updated_at: new Date().toISOString()
    };

    if (product.id) {
      const { error } = await supabase.from("products").update(payload).eq("id", product.id);
      if (error) throw error;
      return product.id;
    } else {
      const { data, error } = await supabase.from("products").insert([{
        ...payload,
        created_at: new Date().toISOString()
      }]).select("id").single();
      if (error) throw error;
      return data.id;
    }
  },

  delete: async (id: string): Promise<void> => {
    if (!isSupabaseConfigured) {
      let prods = getLocalData("products", FALLBACK_PRODUCTS) as Product[];
      prods = prods.filter(p => p.id !== id);
      saveLocalData("products", prods);
      return;
    }
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
  }
};

// CRUD for Banners
export const dbBanners = {
  getAll: async (onlyActive = false): Promise<Banner[]> => {
    if (!isSupabaseConfigured) {
      const bans = getLocalData("banners", FALLBACK_BANNERS) as Banner[];
      if (onlyActive) {
        const now = new Date();
        return bans.filter(b => {
          if (!b.active) return false;
          if (b.startDate && new Date(b.startDate) > now) return false;
          if (b.endDate && new Date(b.endDate) < now) return false;
          return true;
        });
      }
      return bans;
    }
    let query = supabase.from("banners").select("*").order("sort_order", { ascending: true });
    const { data, error } = await query;
    if (error) throw error;

    const mapped = (data || []).map((b: any) => ({
      id: b.id,
      title: b.title,
      desktopImage: b.desktop_image,
      mobileImage: b.mobile_image,
      buttonText: b.button_text || "",
      buttonUrl: b.button_url || "",
      active: b.active,
      startDate: b.start_date,
      endDate: b.end_date,
      sortOrder: b.sort_order,
      createdAt: serializeDate(b.created_at),
      updatedAt: serializeDate(b.updated_at)
    })) as Banner[];

    if (onlyActive) {
      const now = new Date();
      return mapped.filter(b => {
        if (!b.active) return false;
        if (b.startDate && new Date(b.startDate) > now) return false;
        if (b.endDate && new Date(b.endDate) < now) return false;
        return true;
      });
    }
    return mapped;
  },

  save: async (banner: Banner): Promise<string> => {
    if (!isSupabaseConfigured) {
      const bans = getLocalData("banners", FALLBACK_BANNERS) as Banner[];
      const id = banner.id || "banner-" + Date.now();
      const updated = {
        ...banner,
        id,
        createdAt: banner.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const idx = bans.findIndex(b => b.id === id);
      if (idx !== -1) bans[idx] = updated;
      else bans.push(updated);
      saveLocalData("banners", bans);
      return id;
    }

    const payload = {
      title: banner.title,
      desktop_image: banner.desktopImage,
      mobile_image: banner.mobileImage,
      button_text: banner.buttonText,
      button_url: banner.buttonUrl,
      active: banner.active,
      start_date: banner.startDate,
      end_date: banner.endDate,
      sort_order: banner.sortOrder,
      updated_at: new Date().toISOString()
    };

    if (banner.id) {
      const { error } = await supabase.from("banners").update(payload).eq("id", banner.id);
      if (error) throw error;
      return banner.id;
    } else {
      const { data, error } = await supabase.from("banners").insert([{
        ...payload,
        created_at: new Date().toISOString()
      }]).select("id").single();
      if (error) throw error;
      return data.id;
    }
  },

  delete: async (id: string): Promise<void> => {
    if (!isSupabaseConfigured) {
      let bans = getLocalData("banners", FALLBACK_BANNERS) as Banner[];
      bans = bans.filter(b => b.id !== id);
      saveLocalData("banners", bans);
      return;
    }
    const { error } = await supabase.from("banners").delete().eq("id", id);
    if (error) throw error;
  }
};

// CRUD for Testimonials
export const dbTestimonials = {
  getAll: async (onlyPublished = false): Promise<Testimonial[]> => {
    if (!isSupabaseConfigured) {
      const tests = getLocalData("testimonials", FALLBACK_TESTIMONIALS) as Testimonial[];
      if (onlyPublished) return tests.filter(t => t.published);
      return tests;
    }
    let query = supabase.from("testimonials").select("*");
    if (onlyPublished) query = query.eq("published", true);

    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;

    return (data || []).map((t: any) => ({
      id: t.id,
      customerName: t.customer_name,
      content: t.content,
      published: t.published,
      createdAt: serializeDate(t.created_at),
      updatedAt: serializeDate(t.updated_at)
    })) as Testimonial[];
  },

  save: async (testimonial: Testimonial): Promise<string> => {
    if (!isSupabaseConfigured) {
      const tests = getLocalData("testimonials", FALLBACK_TESTIMONIALS) as Testimonial[];
      const id = testimonial.id || "test-" + Date.now();
      const updated = {
        ...testimonial,
        id,
        createdAt: testimonial.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const idx = tests.findIndex(t => t.id === id);
      if (idx !== -1) tests[idx] = updated;
      else tests.push(updated);
      saveLocalData("testimonials", tests);
      return id;
    }

    const payload = {
      customer_name: testimonial.customerName,
      content: testimonial.content,
      published: testimonial.published,
      updated_at: new Date().toISOString()
    };

    if (testimonial.id) {
      const { error } = await supabaseAdmin.from("testimonials").update(payload).eq("id", testimonial.id);
      if (error) throw error;
      return testimonial.id;
    } else {
      const { data, error } = await supabaseAdmin.from("testimonials").insert([{
        ...payload,
        created_at: new Date().toISOString()
      }]).select("id").single();
      if (error) throw error;
      return data.id;
    }
  },

  delete: async (id: string): Promise<void> => {
    if (!isSupabaseConfigured) {
      let tests = getLocalData("testimonials", FALLBACK_TESTIMONIALS) as Testimonial[];
      tests = tests.filter(t => t.id !== id);
      saveLocalData("testimonials", tests);
      return;
    }
    const { error } = await supabaseAdmin.from("testimonials").delete().eq("id", id);
    if (error) throw error;
  }
};

// CRUD for Gallery
export const dbGallery = {
  getAll: async (type?: "product" | "store", limitCount = 50): Promise<GalleryItem[]> => {
    if (!isSupabaseConfigured) {
      const items = getLocalData("gallery", FALLBACK_GALLERY) as GalleryItem[];
      const filtered = type ? items.filter(g => g.type === type) : items;
      return filtered.slice(0, limitCount);
    }
    let query = supabase.from("gallery").select("*").order("sort_order", { ascending: true });
    if (type) query = query.eq("type", type);
    
    const { data, error } = await query.limit(limitCount);
    if (error) throw error;

    return (data || []).map((g: any) => ({
      id: g.id,
      imageUrl: g.image_url,
      caption: g.caption || "",
      type: g.type,
      sortOrder: g.sort_order,
      createdAt: serializeDate(g.created_at)
    })) as GalleryItem[];
  },

  save: async (item: GalleryItem): Promise<string> => {
    if (!isSupabaseConfigured) {
      const items = getLocalData("gallery", FALLBACK_GALLERY) as GalleryItem[];
      const id = item.id || "gal-" + Date.now();
      const updated = {
        ...item,
        id,
        createdAt: item.createdAt || new Date().toISOString()
      };
      const idx = items.findIndex(g => g.id === id);
      if (idx !== -1) items[idx] = updated;
      else items.push(updated);
      saveLocalData("gallery", items);
      return id;
    }

    const payload = {
      image_url: item.imageUrl,
      caption: item.caption,
      type: item.type,
      sort_order: item.sortOrder
    };

    if (item.id) {
      const { error } = await supabase.from("gallery").update(payload).eq("id", item.id);
      if (error) throw error;
      return item.id;
    } else {
      const { data, error } = await supabase.from("gallery").insert([{
        ...payload,
        created_at: new Date().toISOString()
      }]).select("id").single();
      if (error) throw error;
      return data.id;
    }
  },

  delete: async (id: string): Promise<void> => {
    if (!isSupabaseConfigured) {
      let items = getLocalData("gallery", FALLBACK_GALLERY) as GalleryItem[];
      items = items.filter(g => g.id !== id);
      saveLocalData("gallery", items);
      return;
    }
    const { error } = await supabase.from("gallery").delete().eq("id", id);
    if (error) throw error;
  }
};

// Settings
export const dbSettings = {
  get: async (): Promise<Settings> => {
    if (!isSupabaseConfigured) {
      return getLocalData("settings", FALLBACK_SETTINGS) as Settings;
    }
    const { data, error } = await supabase.from("settings").select("*").eq("id", "website").maybeSingle();
    if (error) throw error;
    if (!data) return FALLBACK_SETTINGS;

    return {
      siteName: data.site_name,
      heroTitle: data.hero_title,
      heroSubtitle: data.hero_subtitle,
      heroImage: data.hero_image || "",
      phone: data.phone,
      whatsapp: data.whatsapp,
      instagram: data.instagram,
      address: data.address,
      googleMapsUrl: data.google_maps_url || "",
      businessHours: data.business_hours,
      updatedAt: serializeDate(data.updated_at)
    };
  },

  save: async (settings: Settings): Promise<void> => {
    if (!isSupabaseConfigured) {
      saveLocalData("settings", settings);
      return;
    }
    const payload = {
      site_name: settings.siteName,
      hero_title: settings.heroTitle,
      hero_subtitle: settings.heroSubtitle,
      hero_image: settings.heroImage || "",
      phone: settings.phone,
      whatsapp: settings.whatsapp,
      instagram: settings.instagram,
      address: settings.address,
      google_maps_url: settings.googleMapsUrl,
      business_hours: settings.businessHours,
      updated_at: new Date().toISOString()
    };
    const { error } = await supabase.from("settings").upsert({
      id: "website",
      ...payload
    });
    if (error) throw error;
  }
};

// User Roles
export const dbUsers = {
  getAll: async (): Promise<User[]> => {
    if (!isSupabaseConfigured) {
      return getLocalData("users", FALLBACK_USERS) as User[];
    }
    const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: true });
    if (error) throw error;

    return (data || []).map((u: any) => ({
      uid: u.uid,
      email: u.email,
      role: u.role,
      createdAt: serializeDate(u.created_at),
      updatedAt: serializeDate(u.updated_at)
    })) as User[];
  },

  getRole: async (uid: string): Promise<"developer" | "admin" | null> => {
    if (!isSupabaseConfigured) {
      if (uid === "dev-user-uid") return "developer";
      if (uid === "admin-user-uid") return "admin";
      
      const localUsers = getLocalData("users", FALLBACK_USERS) as User[];
      const found = localUsers.find(u => u.uid === uid);
      return found ? found.role : null;
    }
    const { data, error } = await supabase.from("users").select("role").eq("uid", uid).maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return data.role as "developer" | "admin";
  },

  saveRole: async (user: User): Promise<void> => {
    if (!isSupabaseConfigured) {
      const localUsers = getLocalData("users", FALLBACK_USERS) as User[];
      const idx = localUsers.findIndex(u => u.uid === user.uid);
      const updated = { ...user, updatedAt: new Date().toISOString() };
      if (idx !== -1) localUsers[idx] = updated;
      else localUsers.push(updated);
      saveLocalData("users", localUsers);
      return;
    }
    const { error } = await supabase.from("users").upsert({
      uid: user.uid,
      email: user.email,
      role: user.role,
      updated_at: new Date().toISOString()
    });
    if (error) throw error;
  }
};
