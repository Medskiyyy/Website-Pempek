import React from "react";
import { dbTestimonials } from "@pempek-ceklis/lib";
import TestimoniForm from "./TestimoniForm";

export const revalidate = 60; // ISR 60s

export const metadata = {
  title: "Testimoni Pelanggan - Ulasan Jujur Pempek Cek Lis",
  description: "Baca ulasan jujur dan testimoni dari pelanggan setia Pempek Cek Lis. Bukti kelezatan cita rasa pempek asli Palembang buatan kami.",
  alternates: {
    canonical: "/testimoni"
  },
  openGraph: {
    title: "Testimoni Pelanggan - Ulasan Jujur Pempek Cek Lis",
    description: "Baca ulasan jujur dan testimoni dari pelanggan setia Pempek Cek Lis. Bukti kelezatan cita rasa pempek asli Palembang buatan kami.",
    url: "/testimoni"
  }
};
export default async function Page() {
  const testimonials = await dbTestimonials.getAll(true);

  return (
    <div className="testimonials-page container section-padding animate-fade-in">
      <div className="section-title-wrapper">
        <h1 className="section-title">Testimoni Pelanggan</h1>
        <p className="section-subtitle">
          Kepuasan Anda adalah kebahagiaan kami. Berikut ulasan tulus dari para pelanggan setia Pempek Cek Lis.
        </p>
      </div>

      {testimonials.length > 0 ? (
        <div className="grid-2 testimonials-grid">
          {testimonials.map((t) => (
            <div key={t.id} className="glass-card testimonial-card animate-fade-in">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                <h4 className="testimonial-author" style={{ color: "var(--primary)", fontSize: "1.1rem", margin: 0 }}>
                  {t.customerName}
                </h4>
                <div className="testimonial-stars" style={{ color: "var(--accent)", fontSize: "1.1rem", margin: 0 }}>
                  ★★★★★
                </div>
              </div>
              <p className="testimonial-text" style={{ fontSize: "1.05rem", fontStyle: "italic", margin: 0, color: "var(--text-primary)" }}>
                &ldquo;{t.content}&rdquo;
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center" style={{ margin: "40px 0" }}>
          <p>Belum ada testimoni yang dipublikasikan.</p>
        </div>
      )}

      <TestimoniForm />
    </div>
  );
}
