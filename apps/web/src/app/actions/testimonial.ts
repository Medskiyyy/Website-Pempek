"use server";

import { dbTestimonials } from "@pempek-ceklis/lib";
import { revalidatePath } from "next/cache";

export async function submitTestimonial(formData: FormData) {
  try {
    const rawName = formData.get("customerName")?.toString().trim();
    const customerName = rawName || "Anonim";
    const content = formData.get("content")?.toString().trim();

    if (!content) {
      return { success: false, error: "Isi testimoni wajib diisi" };
    }

    await dbTestimonials.save({
      customerName,
      content,
      published: true, // As requested by user, auto-publish but admin can delete
    });

    revalidatePath("/testimoni");
    revalidatePath("/");
    revalidatePath("/(dashboard)/dashboard", "page");
    revalidatePath("/(dashboard)/testimonials", "page");

    return { success: true };
  } catch (error: any) {
    console.error("Error submitting testimonial:", error);
    return { success: false, error: error.message || "Terjadi kesalahan saat menyimpan testimoni" };
  }
}
