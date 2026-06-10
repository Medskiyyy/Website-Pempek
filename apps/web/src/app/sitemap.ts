import { MetadataRoute } from "next";
import { dbProducts } from "@pempek-ceklis/lib";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NODE_ENV === "production"
    ? "https://website-pempek.vercel.app"
    : (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");
  
  // Fetch published products for URLs
  let products: import("@pempek-ceklis/types").Product[] = [];
  try {
    products = await dbProducts.getAll("published");
  } catch (e) {
    console.error("Failed to fetch products for sitemap, using fallback", e);
  }

  const productUrls = products.map((p) => ({
    url: `${baseUrl}/produk/${p.slug}`,
    lastModified: new Date()
  }));

  const mainUrls = ["", "/produk", "/galeri", "/testimoni", "/tentang", "/kontak"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date()
  }));

  return [...mainUrls, ...productUrls];
}
