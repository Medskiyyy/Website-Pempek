"use client";

import React, { useState } from "react";
import { GalleryItem } from "@pempek-ceklis/types";

interface GalleryClientProps {
  gallery: GalleryItem[];
}

export default function GalleryClient({ gallery }: GalleryClientProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filters = [
    { id: "all", label: "Semua Foto" },
    { id: "product", label: "Foto Produk" },
    { id: "store", label: "Outlet & Dapur" }
  ];

  // Limit to 50 photos as per PRD
  const activePhotos = gallery.slice(0, 50);

  const filteredPhotos = activePhotos.filter((item) => {
    if (activeFilter === "all") return true;
    return item.type === activeFilter;
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
            <div 
              key={item.id} 
              className="gallery-item-card glass-card"
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedImage(item.imageUrl)}
            >
              <div className="gallery-img-container">
                <img src={item.imageUrl} alt={item.caption || "Pempek Cek Lis"} className="gallery-img aspect-1-1" />
              </div>
              {item.caption && (
                <div className="gallery-caption-box">
                  <p>{item.caption}</p>
                  <span className="badge badge-neutral" style={{ textTransform: "capitalize", fontSize: "0.65rem", marginTop: "4px" }}>
                    {item.type === "product" ? "Produk" : "Outlet"}
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
        Menampilkan {filteredPhotos.length} foto.
      </div>

      {/* Fullscreen Photo Lightbox Modal */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            padding: "24px",
            cursor: "zoom-out",
            animation: "fadeIn 0.2s ease-out"
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              position: "relative", 
              maxWidth: "90%", 
              maxHeight: "90%", 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center",
              cursor: "default"
            }}
          >
            <img 
              src={selectedImage} 
              alt="Pratinjau Galeri" 
              style={{ 
                maxWidth: "100%", 
                maxHeight: "80vh", 
                objectFit: "contain", 
                borderRadius: "8px", 
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                border: "2px solid rgba(255,255,255,0.1)"
              }} 
            />
            <button 
              onClick={() => setSelectedImage(null)}
              style={{
                position: "absolute",
                top: "-45px",
                right: "0",
                background: "none",
                border: "none",
                color: "white",
                fontSize: "2rem",
                cursor: "pointer",
                fontWeight: "bold",
                padding: "4px"
              }}
              title="Tutup"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
