"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product, Settings } from "@pempek-ceklis/types";
import { WhatsAppIcon, InstagramIcon, ChevronLeftIcon } from "@/components/Icons";

interface ProductDetailClientProps {
  product: Product;
  settings: Settings;
}

export default function ProductDetailClient({ product, settings }: ProductDetailClientProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const handleWhatsAppOrder = () => {
    const message = `Halo Pempek Cek Lis, saya tertarik untuk memesan "${product.name}" seharga Rp ${product.price.toLocaleString("id-ID")}. Apakah masih tersedia?`;
    window.open(`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleInstagramDM = () => {
    window.open(`https://instagram.com/${settings.instagram}`, "_blank");
  };

  return (
    <div className="product-detail-page container section-padding animate-fade-in">
      <Link href="/produk" className="btn-back-link">
        <ChevronLeftIcon size={18} /> Kembali ke Menu Pempek
      </Link>

      <div className="product-detail-grid grid-2" style={{ marginTop: "24px" }}>
        {/* Left Side: Images */}
        <div className="product-detail-images">
          <div className="main-image-wrapper glass-card">
            <img
              src={product.images[activeImageIdx]}
              alt={product.name}
              className="detail-main-img aspect-1-1"
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="thumbnail-grid">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`thumbnail-btn glass-card ${idx === activeImageIdx ? "active-thumbnail" : ""}`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="thumbnail-img aspect-1-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Information */}
        <div className="product-detail-info glass-card">
          <div className="detail-header">
            <span className="badge badge-success">Tersedia / Ready Stock</span>
            {product.featured && <span className="badge badge-success" style={{ marginLeft: "8px", backgroundColor: "#FFF8E1", color: "#FFC107" }}>Terpopuler</span>}
            <h1 className="detail-title">{product.name}</h1>
            <p className="detail-price">Rp {product.price.toLocaleString("id-ID")}</p>
          </div>

          <div className="detail-body">
            <h3 className="detail-section-title">Deskripsi Produk</h3>
            <p className="detail-description">{product.description}</p>
          </div>

          <div className="detail-ctas-box">
            <p className="cta-box-text">Pesan sekarang langsung melalui kontak resmi kami di bawah ini:</p>
            <div className="detail-ctas">
              <button onClick={handleWhatsAppOrder} className="btn btn-primary btn-block">
                <WhatsAppIcon size={20} />
                Pesan Sekarang via WhatsApp
              </button>
              <button onClick={handleInstagramDM} className="btn btn-secondary btn-block">
                <InstagramIcon size={20} />
                Tanya Detail di Instagram DM
              </button>
            </div>
          </div>

          {/* SEO Metadata Simulation (Visible for Admin/Review purposes) */}
          <div className="detail-seo-preview">
            <h4 className="seo-preview-title">Metadata SEO (Simulasi)</h4>
            <p><strong>SEO Title:</strong> {product.seoTitle || `${product.name} - Pempek Cek Lis`}</p>
            <p><strong>SEO Description:</strong> {product.seoDescription || `Beli ${product.name} berkualitas asli Palembang di Serpong Tangerang Selatan.`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
