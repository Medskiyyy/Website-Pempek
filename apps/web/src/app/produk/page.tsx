import React from "react";
import { dbProducts } from "@pempek-ceklis/lib";
import CatalogClient from "./CatalogClient";

export const revalidate = 60; // ISR 60s

export const metadata = {
  title: "Beli Pempek Online - Daftar Menu Pempek Cek Lis",
  description: "Pesan pempek asli Palembang secara online. Kami melayani delivery pempek area Tangerang Selatan, Serpong, Pamulang, dan sekitarnya. Harga terjangkau!",
  alternates: {
    canonical: "/produk"
  },
  openGraph: {
    title: "Beli Pempek Online - Daftar Menu Pempek Cek Lis",
    description: "Pesan pempek asli Palembang secara online. Kami melayani delivery pempek area Tangerang Selatan, Serpong, Pamulang, dan sekitarnya. Harga terjangkau!",
    url: "/produk"
  }
};
export default async function Page() {
  // Fetch published products on the server
  const products = await dbProducts.getAll("published");

  return <CatalogClient products={products} />;
}
