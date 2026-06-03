import React from "react";
import { dbBanners } from "@pempek-ceklis/lib";
import BannersClient from "./BannersClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  const banners = await dbBanners.getAll();
  return <BannersClient initialBanners={banners} />;
}
