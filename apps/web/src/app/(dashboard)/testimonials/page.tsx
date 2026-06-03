import React from "react";
import { dbTestimonials } from "@pempek-ceklis/lib";
import TestimonialsClient from "./TestimonialsClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  const testimonials = await dbTestimonials.getAll();
  return <TestimonialsClient initialTestimonials={testimonials} />;
}
