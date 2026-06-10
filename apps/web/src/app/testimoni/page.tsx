import React from "react";
import { dbTestimonials } from "@pempek-ceklis/lib";

export const revalidate = 60; // ISR 60s

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
              <div className="testimonial-stars" style={{ color: "var(--accent)", fontSize: "1.2rem", marginBottom: "16px" }}>
                ★★★★★
              </div>
              <p className="testimonial-text" style={{ fontSize: "1.05rem", fontStyle: "italic", marginBottom: "20px", color: "var(--text-primary)" }}>
                &ldquo;{t.content}&rdquo;
              </p>
              <div className="testimonial-footer">
                <h4 className="testimonial-author" style={{ color: "var(--primary)", fontSize: "1.1rem" }}>
                  {t.customerName}
                </h4>
                <span className="badge badge-success" style={{ backgroundColor: "#E8F5E9", color: "#2E7D32" }}>
                  Verified Customer
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center" style={{ margin: "40px 0" }}>
          <p>Belum ada testimoni yang dipublikasikan.</p>
        </div>
      )}
    </div>
  );
}
