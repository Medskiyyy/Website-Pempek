import React from "react";

export const revalidate = 3600; // Cache for 1 hour

export default async function Page() {

  return (
    <div className="about-page container section-padding animate-fade-in-simple">
      <div className="section-title-wrapper">
        <h1 className="section-title">Tentang Pempek Cek Lis</h1>
        <p className="section-subtitle">Kisah kami dalam menjaga cita rasa warisan kuliner asli nusantara</p>
      </div>

      <div className="about-grid grid-2" style={{ alignItems: "center" }}>
        <div className="about-image-wrapper">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80"
            alt="Dapur Pempek Cek Lis"
            className="about-img glass-card"
            style={{ width: "100%" }}
          />
        </div>
        <div className="about-content">
          <h2 style={{ color: "var(--primary)", marginBottom: "16px" }}>Warisan Rasa Otentik Palembang</h2>
          <p style={{ marginBottom: "16px", color: "var(--text-secondary)" }}>
            Pempek Palembang Cek Lis berawal dari kecintaan kami terhadap masakan khas Sumatera Selatan. Kami berkomitmen menyajikan hidangan pempek dengan cita rasa asli yang tidak dikurangi kualitasnya sedikit pun.
          </p>
          <p style={{ marginBottom: "16px", color: "var(--text-secondary)" }}>
            Setiap butir pempek kami diproduksi secara higienis menggunakan daging ikan tenggiri segar kualitas premium, tepung sagu pilihan, dan bumbu rempah alami. Kami sangat menghindari penggunaan pengawet buatan, pemutih, maupun bahan kimia berbahaya lainnya.
          </p>
          <p style={{ color: "var(--text-secondary)" }}>
            Tidak kalah penting, Cuko Pempek Cek Lis diolah khusus menggunakan gula merah batok asli dari Linggau yang menghasilkan warna cokelat gelap pekat, bertekstur kental, dengan rasa manis, pedas, gurih, dan asam belimbing wuluh yang berpadu sempurna.
          </p>
        </div>
      </div>

      {/* Pillars / Core Values */}
      <div className="about-pillars grid-3" style={{ marginTop: "60px" }}>
        <div className="glass-card pillar-card text-center" style={{ padding: "32px 24px" }}>
          <div className="pillar-icon" style={{ fontSize: "2.5rem", marginBottom: "16px" }}>🐟</div>
          <h3 style={{ color: "var(--primary)", marginBottom: "12px" }}>100% Tenggiri Segar</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Kami hanya menggunakan ikan tenggiri segar yang diproses langsung secara bersih untuk menjaga kesegaran rasa gurih alaminya.
          </p>
        </div>

        <div className="glass-card pillar-card text-center" style={{ padding: "32px 24px" }}>
          <div className="pillar-icon" style={{ fontSize: "2.5rem", marginBottom: "16px" }}>🍯</div>
          <h3 style={{ color: "var(--primary)", marginBottom: "12px" }}>Cuko Gula Aren Linggau</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Cuko kental legendaris kami menggunakan gula aren batok berkualitas tinggi langsung dikirim dari sentra pembuatannya di Sumatera.
          </p>
        </div>

        <div className="glass-card pillar-card text-center" style={{ padding: "32px 24px" }}>
          <div className="pillar-icon" style={{ fontSize: "2.5rem", marginBottom: "16px" }}>✨</div>
          <h3 style={{ color: "var(--primary)", marginBottom: "12px" }}>Higienis & Sehat</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Seluruh proses memasak, merebus, dan menggoreng dilakukan dengan standar kebersihan tinggi demi kesehatan pelanggan.
          </p>
        </div>
      </div>
    </div>
  );
}
