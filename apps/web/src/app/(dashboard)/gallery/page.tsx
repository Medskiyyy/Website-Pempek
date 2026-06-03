import React from "react";
import { dbGallery } from "@pempek-ceklis/lib";
import GalleryClient from "./GalleryClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  const gallery = await dbGallery.getAll(undefined, 100); // Fetch up to 100 for admin so we can display them (though limit is 50)
  return <GalleryClient initialGallery={gallery} />;
}
