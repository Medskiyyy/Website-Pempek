import React, { useState } from "react";

export default function Gallery({ gallery }) {
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all", label: "Semua Foto" },
    { id: "product", label: "Foto Produk" },
    { id: "store", label: "Outlet & Dapur" }
  ];

  // Limit of 50 photos as per PRD
  const activePhotos = gallery.slice(0, 50);

  const filteredPhotos = activePhotos.filter((item) => {
    if (activeFilter === "all") return true;
    return item.gallery_type === activeFilter;
  });

  return (
    <div className="gallery-page container section-padding animate-fade-in">
      <div className="section-title-wrapper">
        <h1 className="section-title">Galeri Foto Pempek Cek Lis</h1>
        <p className="section-subtitle">Dokumentasi visual kelezatan produk dan higienitas proses pembuatan kami</p>
      </div>

      {/* Filter Tabs */}
      <div className="gallery-filters" style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "40px" }}>
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`catalog-tag-btn ${activeFilter === f.id ? "active" : ""}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      {filteredPhotos.length > 0 ? (
        <div className="grid-3 gallery-grid">
          {filteredPhotos.map((item) => (
            <div key={item.id} className="gallery-item-card glass-card">
              <div className="gallery-img-container">
                <img src={item.image_url} alt={item.caption || "Pempek Cek Lis"} className="gallery-img aspect-1-1" />
              </div>
              {item.caption && (
                <div className="gallery-caption-box">
                  <p>{item.caption}</p>
                  <span className="badge badge-neutral" style={{ textTransform: "capitalize", fontSize: "0.65rem", marginTop: "4px" }}>
                    {item.gallery_type === "product" ? "Produk" : "Outlet"}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center" style={{ margin: "40px 0" }}>
          <p>Belum ada foto dalam kategori ini.</p>
        </div>
      )}

      <div className="text-center" style={{ marginTop: "40px", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
        Menampilkan {filteredPhotos.length} dari total {activePhotos.length} foto (Maksimal kapasitas galeri: 50 foto).
      </div>
    </div>
  );
}
