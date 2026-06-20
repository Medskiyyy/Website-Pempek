"use client";

import React, { useState } from "react";
import { submitTestimonial } from "../actions/testimonial";

export default function TestimoniForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const result = await submitTestimonial(formData);

    if (result.success) {
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } else {
      setErrorMsg(result.error || "Gagal mengirim testimoni.");
    }
    setLoading(false);
  };

  return (
    <div className="glass-card animate-fade-in" style={{ marginBottom: "3rem", padding: "2rem" }}>
      <h3 style={{ marginTop: 0, marginBottom: "1rem", color: "var(--primary)" }}>Tulis Testimoni Anda</h3>
      
      {success && (
        <div style={{ padding: "1rem", backgroundColor: "rgba(40, 167, 69, 0.1)", border: "1px solid rgba(40, 167, 69, 0.2)", color: "#28a745", borderRadius: "8px", marginBottom: "1.5rem" }}>
          Terima kasih! Testimoni Anda berhasil dikirim dan sudah dipublikasikan.
        </div>
      )}
      
      {errorMsg && (
        <div style={{ padding: "1rem", backgroundColor: "rgba(220, 53, 69, 0.1)", border: "1px solid rgba(220, 53, 69, 0.2)", color: "#dc3545", borderRadius: "8px", marginBottom: "1.5rem" }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div>
          <label htmlFor="customerName" className="form-label" style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
            Nama (Opsional)
          </label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            placeholder="Nama Anda (Kosongkan jika ingin anonim)"
            className="form-input"
            style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--card-bg)", color: "var(--text-primary)" }}
          />
        </div>
        
        <div>
          <label htmlFor="content" className="form-label" style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
            Isi Testimoni <span style={{ color: "var(--accent)" }}>*</span>
          </label>
          <textarea
            id="content"
            name="content"
            placeholder="Bagaimana pendapat Anda tentang Pempek Cek Lis?"
            required
            rows={4}
            className="form-input"
            style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--card-bg)", color: "var(--text-primary)", resize: "vertical" }}
          ></textarea>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading}
          style={{ alignSelf: "flex-start", opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Mengirim..." : "Kirim Testimoni"}
        </button>
      </form>
    </div>
  );
}
