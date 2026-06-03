"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@pempek-ceklis/types";
import { dbProducts, uploadImage } from "@pempek-ceklis/lib";
import { useAuth } from "@/context/AuthContext";
import { PlusIcon, EditIcon, TrashIcon, CheckIcon } from "@/components/Icons";

interface ProductsClientProps {
  initialProducts: Product[];
}

export default function ProductsClient({ initialProducts }: ProductsClientProps) {
  const { role } = useAuth();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const router = useRouter();

  const isDev = role === "developer";

  const unsplashSuggestions = [
    "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=600&auto=format&fit=crop&q=80"
  ];

  const handleOpenAddForm = () => {
    setEditingItem({
      name: "",
      slug: "",
      description: "",
      price: 0,
      status: "published",
      featured: false,
      images: [unsplashSuggestions[Math.floor(Math.random() * unsplashSuggestions.length)]],
      seoTitle: "",
      seoDescription: ""
    });
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (item: Product) => {
    setEditingItem({ ...item });
    setIsFormOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setSubmitting(true);

    try {
      let itemToSave = { ...editingItem };
      // Automate SEO for Admin (non-developer)
      if (!isDev) {
        itemToSave = {
          ...itemToSave,
          seoTitle: `${itemToSave.name} - Pempek Palembang Cek Lis`,
          seoDescription: `Beli ${itemToSave.name} asli Palembang di Tangerang Selatan. ${itemToSave.description.substring(0, 110)}...`
        };
      }

      await dbProducts.save(itemToSave);
      
      const fresh = await dbProducts.getAll();
      setProducts(fresh);
      setIsFormOpen(false);
      setEditingItem(null);
      router.refresh();
    } catch (err) {
      console.error("Gagal menyimpan produk:", err);
      alert("Gagal menyimpan produk, silakan periksa koneksi atau kredensial Supabase Anda.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      try {
        await dbProducts.delete(id);
        const fresh = await dbProducts.getAll();
        setProducts(fresh);
        router.refresh();
      } catch (err) {
        console.error("Gagal menghapus produk:", err);
        alert("Gagal menghapus produk.");
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file gambar maksimal adalah 2MB.");
      return;
    }

    setUploadingImage(true);

    try {
      const url = await uploadImage(file, "products");
      if (editingItem) {
        const newImgs = [...editingItem.images];
        newImgs[0] = url;
        setEditingItem({ ...editingItem, images: newImgs });
      }
    } catch (err) {
      console.error("Gagal mengunggah file:", err);
      alert("Gagal mengunggah & mengompres gambar produk.");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2>Kelola Produk & Menu</h2>
        <button onClick={handleOpenAddForm} className="btn btn-primary btn-sm">
          <PlusIcon size={16} /> Tambah Produk
        </button>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nama Produk</th>
              <th>Harga</th>
              <th>Status</th>
              <th>Unggulan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  <img src={p.images[0]} alt={p.name} style={{ width: "45px", height: "45px", borderRadius: "6px", objectFit: "cover" }} />
                </td>
                <td>
                  <strong>{p.name}</strong>
                  <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-secondary)" }}>{p.slug}</span>
                </td>
                <td>Rp {p.price.toLocaleString("id-ID")}</td>
                <td>
                  <span className={`badge ${p.status === "published" ? "badge-success" : "badge-neutral"}`}>
                    {p.status === "published" ? "Published" : "Draft"}
                  </span>
                </td>
                <td>{p.featured ? "⭐ Unggulan" : "Biasa"}</td>
                <td>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => handleOpenEditForm(p)} className="action-btn-edit" title="Edit">
                      <EditIcon size={16} />
                    </button>
                    {p.id && (
                      <button onClick={() => handleDeleteItem(p.id!)} className="action-btn-delete" title="Hapus">
                        <TrashIcon size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CRUD Modal Form */}
      {isFormOpen && editingItem && (
        <div className="admin-modal-overlay">
          <div className="admin-modal glass-card">
            <h3 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "12px", marginBottom: "20px", color: "var(--primary)" }}>
              {editingItem.id ? "Edit Produk" : "Tambah Produk Baru"}
            </h3>

            <form onSubmit={handleSaveItem}>
              <div className="form-group">
                <label className="form-label">Nama Produk</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Harga (Rp)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Status Produk</label>
                  <select
                    className="form-control"
                    value={editingItem.status}
                    onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value as "published" | "draft" })}
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Deskripsi Lengkap</label>
                <textarea
                  rows={3}
                  className="form-control"
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Foto Utama Produk</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {editingItem.images[0] && (
                    <div style={{ position: "relative", width: "120px", height: "120px", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border-color)", background: "rgba(0,0,0,0.02)" }}>
                      <img
                        src={editingItem.images[0]}
                        alt="Pratinjau Foto Produk"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                  )}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: "none" }}
                      id="product-image-file"
                      disabled={uploadingImage}
                    />
                    <label htmlFor="product-image-file" className="btn btn-secondary btn-sm" style={{ margin: 0, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                      📁 {uploadingImage ? "Memproses & Kompres..." : editingItem.images[0] ? "Ubah Foto (Upload Lokal)" : "Pilih & Upload Foto"}
                    </label>
                    <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "6px" }}>
                      Format: JPG, PNG, WEBP. Maksimal 2MB. Gambar akan dikompres otomatis.
                    </span>
                  </div>
                </div>
              </div>

              <div className="form-group form-check" style={{ margin: "16px 0" }}>
                <input
                  type="checkbox"
                  id="featured"
                  checked={editingItem.featured}
                  onChange={(e) => setEditingItem({ ...editingItem, featured: e.target.checked })}
                />
                <label htmlFor="featured" className="form-label" style={{ margin: 0, cursor: "pointer" }}>
                  Tampilkan di Produk Favorit Halaman Utama
                </label>
              </div>

              {/* SEO Metadata: Only show for Developer role */}
              {isDev ? (
                <div style={{ background: "rgba(0,0,0,0.02)", padding: "16px", borderRadius: "8px", marginTop: "16px" }}>
                  <h4 style={{ fontSize: "0.9rem", marginBottom: "12px", color: "var(--primary)" }}>SEO Metadata (Developer Mode)</h4>
                  <div className="form-group">
                    <label className="form-label">SEO Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingItem.seoTitle || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, seoTitle: e.target.value })}
                      placeholder="Judul SEO untuk Google Search"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">SEO Description</label>
                    <textarea
                      rows={2}
                      className="form-control"
                      value={editingItem.seoDescription || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, seoDescription: e.target.value })}
                      placeholder="Deskripsi ringkas yang muncul di hasil Google Search"
                    ></textarea>
                  </div>
                </div>
              ) : (
                <div style={{ background: "rgba(27, 94, 32, 0.03)", padding: "12px 16px", borderRadius: "8px", marginTop: "16px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  ✨ <strong>SEO Otomatis Aktif:</strong> Judul & deskripsi SEO untuk pencarian Google akan dibuat otomatis berdasarkan nama dan deskripsi produk saat data disimpan.
                </div>
              )}

              {/* Modal buttons */}
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", borderTop: "1px solid var(--border-color)", paddingTop: "16px", marginTop: "24px" }}>
                <button type="button" onClick={() => { setIsFormOpen(false); setEditingItem(null); }} className="btn btn-secondary btn-sm">
                  Batalkan
                </button>
                <button type="submit" disabled={submitting || uploadingImage} className="btn btn-primary btn-sm">
                  <CheckIcon size={16} /> {submitting ? "Menyimpan..." : "Simpan Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
