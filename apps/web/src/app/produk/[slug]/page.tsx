import React from "react";
import { notFound } from "next/navigation";
import { dbProducts, dbSettings } from "@pempek-ceklis/lib";
import ProductDetailClient from "./ProductDetailClient";

export const revalidate = 60; // ISR 60s

interface PageProps {
  params: Promise<{ slug: string }>;
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

  return <ProductDetailClient product={product} settings={settings} />;
}
