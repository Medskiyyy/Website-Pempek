import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingAction from "@/components/FloatingAction";
import { dbSettings } from "@pempek-ceklis/lib";
import { AuthProvider } from "@/context/AuthContext";
import RealtimeListener from "@/components/RealtimeListener";
import DevToolsBlocker from "@/components/DevToolsBlocker";

const outfit = Outfit({
  variable: "--font-title",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"]
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"]
});

const defaultUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://website-pempek.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Pempek Palembang Cek Lis - Cita Rasa Otentik Tangerang Selatan",
  description: "Beli Pempek asli Palembang yang lezat dan bergizi di Tangerang Selatan. Dibuat menggunakan ikan tenggiri segar berkualitas dengan cuko kental pedas manis ebi.",
  keywords: [
    "pempek palembang tangerang selatan",
    "pempek enak tangerang selatan",
    "pempek serpong",
    "tekwan tangerang selatan",
    "pempek asli palembang"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Pempek Palembang Cek Lis - Cita Rasa Otentik Tangerang Selatan",
    description: "Beli Pempek asli Palembang yang lezat dan bergizi di Tangerang Selatan. Dibuat menggunakan ikan tenggiri segar berkualitas dengan cuko kental pedas manis ebi.",
    url: "/",
    siteName: "Pempek Palembang Cek Lis",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Pempek Palembang Cek Lis"
      }
    ]
  }
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch store configuration settings dynamically
  const settings = await dbSettings.get();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://website-pempek.vercel.app";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    "name": settings?.siteName || "Pempek Palembang Cek Lis",
    "image": settings?.heroImage || `${siteUrl}/images/hero.jpg`,
    "telephone": settings?.phone || settings?.whatsapp || "",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": settings?.address || "Tangerang Selatan, Banten, Indonesia",
      "addressLocality": "Tangerang Selatan",
      "addressRegion": "Banten",
      "addressCountry": "ID"
    },
    "url": siteUrl,
    "priceRange": "$$",
    "servesCuisine": "Pempek, Palembang, Indonesian",
    "openingHours": settings?.businessHours || "09:00-21:00"
  };

  return (
    <html lang="id" className={`${outfit.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <DevToolsBlocker />
        <AuthProvider>
          <RealtimeListener />
          <div className="app-container">
            <Navbar settings={settings} />
            <main className="main-content-wrapper">{children}</main>
            <Footer settings={settings} />
            <FloatingAction settings={settings} />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
