import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { dbProducts, dbSettings } from "@pempek-ceklis/lib";
import ProductDetailClient from "./ProductDetailClient";

export const revalidate = 60; // ISR 60s

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await dbProducts.getBySlug(slug);

  if (!product) {
    return {
      title: "Produk Tidak Ditemukan"
    };
  }

  const imageUrl = product.images?.[0] || "/images/og-image.jpg";
  const title = `${product.name} - Pempek Cek Lis`;
  const description = product.description;

  return {
    title,
    description,
    alternates: {
      canonical: `/produk/${slug}`
    },
    openGraph: {
      title,
      description,
      url: `/produk/${slug}`,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.name
        }
      ]
    }
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  
  // Fetch product and settings
  const [product, settings] = await Promise.all([
    dbProducts.getBySlug(slug),
    dbSettings.get()
  ]);

  if (!product) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://website-pempek.vercel.app";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images || [`${siteUrl}/images/og-image.jpg`],
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": "Pempek Cek Lis"
    },
    "offers": {
      "@type": "Offer",
      "url": `${siteUrl}/produk/${product.slug}`,
      "priceCurrency": "IDR",
      "price": product.price,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={product} settings={settings} />
    </>
  );
}
