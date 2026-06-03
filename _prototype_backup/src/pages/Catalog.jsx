import React, { useState } from "react";
import { ArrowRightIcon } from "../components/Icons";

export default function Catalog({ setTab, setProductSlug, products }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("semua");

  // Get only published products
  const publishedProducts = products.filter(p => p.status === "published");

  // Simple category detector based on name/description
  const categories = [
    { id: "semua", label: "Semua Menu" },
    { id: "satuan", label: "Pempek Satuan" },
    { id: "porsi", label: "Porsi & Sup" },
    { id: "paket", label: "Paket Hemat" }
  ];

  const getProductCategory = (product) => {
    const name = product.name.toLowerCase();
    if (name.includes("paket")) return "paket";
    if (name.includes("tekwan") || name.includes("sup") || name.includes("porsi")) return "porsi";
    return "satuan";
  };

  const filteredProducts = publishedProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeCategory === "semua") {
      return matchesSearch;
    } else {
      return matchesSearch && getProductCategory(product) === activeCategory;
    }
  });

  const handleProductClick = (slug) => {
    setProductSlug(slug);
    setTab("product-detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="catalog-page container section-padding animate-fade-in">
      <div className="section-title-wrapper">
        <h1 className="section-title">Menu Lengkap Pempek Cek Lis</h1>
        <p className="section-subtitle">
          Pilihlah hidangan pempek favorit Anda yang dibuat higienis dari ikan tenggiri segar berkualitas tinggi
        </p>
      </div>

      {/* Filters & Search */}
      <div className="catalog-filters-wrapper">
        <div className="catalog-search">
          <input
            type="text"
            placeholder="Cari pempek favorit Anda..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control catalog-search-input"
          />
        </div>

        <div className="catalog-category-tags">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`catalog-tag-btn ${activeCategory === cat.id ? "active" : ""}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid-3 catalog-grid">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="glass-card product-card"
              onClick={() => handleProductClick(product.slug)}
            >
              <div className="product-card-image">
                <img src={product.images[0]} alt={product.name} className="product-img aspect-1-1" />
                {product.is_featured && <span className="product-featured-tag">Terpopuler</span>}
              </div>
              <div className="product-card-body">
                <h3 className="product-card-title">{product.name}</h3>
                <p className="product-card-price">Rp {product.price.toLocaleString("id-ID")}</p>
                <p className="product-card-desc">
                  {product.description.length > 100
                    ? `${product.description.substring(0, 100)}...`
                    : product.description}
                </p>
                <span className="product-card-link">
                  Lihat Detail & Pesan <ArrowRightIcon size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="catalog-empty text-center">
          <p>Menu pempek yang Anda cari tidak ditemukan.</p>
          <button onClick={() => { setSearchQuery(""); setActiveCategory("semua"); }} className="btn btn-primary" style={{ marginTop: "16px" }}>
            Reset Pencarian
          </button>
        </div>
      )}
    </div>
  );
}
