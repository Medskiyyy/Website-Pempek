import React from "react";
import { dbProducts } from "@pempek-ceklis/lib";
import CatalogClient from "./CatalogClient";

export const revalidate = 60; // ISR 60s

export default async function Page() {
  // Fetch published products on the server
  const products = await dbProducts.getAll("published");

  return <CatalogClient products={products} />;
}
