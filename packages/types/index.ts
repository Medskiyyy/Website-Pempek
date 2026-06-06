import { z } from "zod";

// 1. Products
export const ProductStatusSchema = z.enum(["draft", "published"]);
export type ProductStatus = z.infer<typeof ProductStatusSchema>;

export const ProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nama produk wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  description: z.string().min(1, "Deskripsi produk wajib diisi"),
  price: z.number().min(0, "Harga tidak boleh negatif"),
  featured: z.boolean().default(false),
  status: ProductStatusSchema.default("draft"),
  seoTitle: z.string().optional().default(""),
  seoDescription: z.string().optional().default(""),
  images: z.array(z.string()).max(5, "Maksimal 5 gambar"),
  createdAt: z.any().optional(),
  updatedAt: z.any().optional()
});

export type Product = z.infer<typeof ProductSchema>;

// 2. Banners
export const BannerSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Judul promo wajib diisi"),
  desktopImage: z.string().min(1, "URL Gambar Desktop wajib diisi"),
  mobileImage: z.string().min(1, "URL Gambar Mobile wajib diisi"),
  buttonText: z.string().optional().default(""),
  buttonUrl: z.string().optional().default(""),
  active: z.boolean().default(true),
  startDate: z.string().min(1, "Tanggal mulai wajib diisi"), // ISO YYYY-MM-DD
  endDate: z.string().min(1, "Tanggal berakhir wajib diisi"), // ISO YYYY-MM-DD
  sortOrder: z.number().default(0),
  createdAt: z.any().optional(),
  updatedAt: z.any().optional()
});

export type Banner = z.infer<typeof BannerSchema>;

// 3. Testimonials
export const TestimonialSchema = z.object({
  id: z.string().optional(),
  customerName: z.string().min(1, "Nama pelanggan wajib diisi"),
  content: z.string().min(1, "Isi testimoni wajib diisi"),
  published: z.boolean().default(true),
  createdAt: z.any().optional(),
  updatedAt: z.any().optional()
});

export type Testimonial = z.infer<typeof TestimonialSchema>;

// 4. Gallery Items
export const GalleryTypeSchema = z.enum(["product", "store"]);
export type GalleryType = z.infer<typeof GalleryTypeSchema>;

export const GallerySchema = z.object({
  id: z.string().optional(),
  type: GalleryTypeSchema.default("product"),
  imageUrl: z.string().min(1, "URL gambar wajib diisi"),
  caption: z.string().optional().default(""),
  sortOrder: z.number().default(0),
  createdAt: z.any().optional()
});

export type GalleryItem = z.infer<typeof GallerySchema>;

// 5. Settings
export const SettingsSchema = z.object({
  siteName: z.string().min(1, "Nama website wajib diisi"),
  heroTitle: z.string().min(1, "Judul hero wajib diisi"),
  heroSubtitle: z.string().min(1, "Subjudul hero wajib diisi"),
  heroImage: z.string().optional(),
  phone: z.string().min(1, "Nomor telepon wajib diisi"),
  whatsapp: z.string().min(1, "Nomor WhatsApp wajib diisi"),
  instagram: z.string().min(1, "Username Instagram wajib diisi"),
  address: z.string().min(1, "Alamat outlet wajib diisi"),
  googleMapsUrl: z.string().min(1, "Link Google Maps embed wajib diisi"),
  businessHours: z.string().min(1, "Jam operasional wajib diisi"),
  updatedAt: z.any().optional()
});

export type Settings = z.infer<typeof SettingsSchema>;

// 6. Users
export const UserRoleSchema = z.enum(["developer", "admin"]);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserSchema = z.object({
  uid: z.string(),
  email: z.string().email("Format email salah"),
  role: UserRoleSchema.default("admin"),
  createdAt: z.any().optional(),
  updatedAt: z.any().optional()
});

export type User = z.infer<typeof UserSchema>;
