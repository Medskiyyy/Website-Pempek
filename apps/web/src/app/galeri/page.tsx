import React from "react";
import { dbGallery } from "@pempek-ceklis/lib";
import GalleryClient from "./GalleryClient";

export const revalidate = 60; // ISR 60s

export const metadata = {
  title: "Galeri Foto - Pempek Cek Lis",
  description: "Lihat galeri foto produk pempek, suasana toko, dan testimoni pelanggan Pempek Cek Lis. Menggugah selera dan terjamin kualitasnya.",
  alternates: {
    canonical: "/galeri"
  },
  openGraph: {
    title: "Galeri Foto - Pempek Cek Lis",
    description: "Lihat galeri foto produk pempek, suasana toko, dan testimoni pelanggan Pempek Cek Lis. Menggugah selera dan terjamin kualitasnya.",
    url: "/galeri"
  }
};
export default async function Page() {
  const gallery = await dbGallery.getAll();

  return <GalleryClient gallery={gallery} />;
}
