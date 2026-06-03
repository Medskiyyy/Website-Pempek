import React from "react";
import { dbGallery } from "@pempek-ceklis/lib";
import GalleryClient from "./GalleryClient";

export const revalidate = 60; // ISR 60s

export default async function Page() {
  const gallery = await dbGallery.getAll();

  return <GalleryClient gallery={gallery} />;
}
