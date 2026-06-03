import React from "react";
import { dbProducts } from "@pempek-ceklis/lib";
import ProductsClient from "./ProductsClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  const products = await dbProducts.getAll();
  return <ProductsClient initialProducts={products} />;
}
