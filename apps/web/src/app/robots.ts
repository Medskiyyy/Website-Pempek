import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NODE_ENV === "production"
    ? "https://website-pempek.vercel.app"
    : (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");
  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
