"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { GalleryItem } from "@pempek-ceklis/types";
import { dbGallery, uploadImage } from "@pempek-ceklis/lib";
import { PlusIcon, EditIcon, TrashIcon, CheckIcon } from "@/components/Icons";

interface GalleryClientProps {
  initialGallery: GalleryItem[];
}

export default function GalleryClient({ initialGallery }: GalleryClientProps) {
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "product" | "store">("all");
  const router = useRouter();

  const unsplashSuggestions = [
    "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80"
  ];

  const handleOpenAddForm = () => {
    if (gallery.length >= 50) {
      alert("Batas maksimal galeri foto adalah 50. Silakan hapus foto lama terlebih dahulu sebelum menambah foto baru.");
      return;
    }

    setEditingItem({
      type: "product",
      imageUrl: unsplashSuggestions[Math.floor(Math.random() * unsplashSuggestions.length)],
      caption: "",
      sortOrder: gallery.length + 1
    });
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (item: GalleryItem) => {
    setEditingItem({ ...item });
    setIsFormOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!editingItem.id && gallery.length >= 50) {
      alert("Gagal menambahkan: Batas galeri 50 foto telah tercapai.");
      return;
    }

    setSubmitting(true);

    try {
      await dbGallery.save(editingItem);
      const fresh = await dbGallery.getAll();
      setGallery(fresh);
      setIsFormOpen(false);
      setEditingItem(null);
      router.refresh();
    } catch (err) {
      console.error("Gagal menyimpan item galeri:", err);
      alert("Gagal menyimpan galeri foto, silakan periksa koneksi Supabase.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus foto ini dari galeri?")) {
      try {
        await dbGallery.delete(id);
        const fresh = await dbGallery.getAll();
        setGallery(fresh);
        router.refresh();
      } catch (err) {
        console.error("Gagal menghapus item galeri:", err);
        alert("Gagal menghapus item galeri.");
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

    setUploading(true);

    try {
      const url = await uploadImage(file, "gallery");
      if (editingItem) {
        setEditingItem({ ...editingItem, imageUrl: url });
      }
    } catch (err) {
      console.error("Gagal mengunggah file:", err);
      alert("Gagal mengunggah & mengompres foto galeri.");
    } finally {
      setUploading(false);
    }
  };

  const filteredGallery = gallery.filter((item) => {
    if (filterType === "all") return true;
    return item.type === filterType;
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h2>Kelola Galeri Foto</h2>
        <button onClick={handleOpenAddForm} className="btn btn-primary btn-sm">
          <PlusIcon size={16} /> Tambah Foto
        </button>
      </div>

      {/* Progress/Capacity Bar */}
      <div className="glass-card" style={{ padding: "16px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "0.85rem" }}>
            <strong>Kapasitas Galeri</strong>
            <span>{gallery.length} / 50 Foto</span>
          </div>
          <div style={{ width: "100%", height: "8px", background: "rgba(0,0,0,0.08)", borderRadius: "4px", overflow: "hidden" }}>
            <div 
              style={{ 
                width: `${(gallery.length / 50) * 100}%`, 
                height: "100%", 
                background: gallery.length >= 45 ? "var(--error)" : "var(--primary)",
                borderRadius: "4px",
                transition: "width 0.3s ease"
              }} 
            />
          </div>
        </div>
        {gallery.length >= 50 && (
          <span className="badge badge-success" style={{ backgroundColor: "#FFEBEE", color: "var(--error)", fontSize: "0.8rem" }}>
            Penuh
          </span>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        <button 
          onClick={() => setFilterType("all")} 
          className={`btn btn-sm ${filterType === "all" ? "btn-primary" : "btn-secondary"}`}
          style={{ padding: "6px 12px" }}
        >
          Semua ({gallery.length})
        </button>
        <button 
          onClick={() => setFilterType("product")} 
          className={`btn btn-sm ${filterType === "product" ? "btn-primary" : "btn-secondary"}`}
          style={{ padding: "6px 12px" }}
        >
          Produk ({gallery.filter(g => g.type === "product").length})
        </button>
        <button 
          onClick={() => setFilterType("store")} 
          className={`btn btn-sm ${filterType === "store" ? "btn-primary" : "btn-secondary"}`}
          style={{ padding: "6px 12px" }}
        >
          Outlet/Toko ({gallery.filter(g => g.type === "store").length})
        </button>
      </div>

      {/* Card Grid style instead of Table for Photos */}
      <div className="grid-4" style={{ gap: "20px" }}>
        {filteredGallery.map((g) => (
          <div 
            key={g.id} 
            className="glass-card" 
            style={{ 
              overflow: "hidden", 
              display: "flex", 
              flexDirection: "column", 
              height: "100%",
              padding: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
            }}
          >
            <div style={{ position: "relative", width: "100%", paddingBottom: "100%", overflow: "hidden", borderRadius: "8px" }}>
              <img 
                src={g.imageUrl} 
                alt={g.caption || "Gallery"} 
                style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} 
              />
              <span 
                className="badge" 
                style={{ 
                  position: "absolute", 
                  top: "8px", 
                  left: "8px", 
                  backgroundColor: g.type === "product" ? "var(--primary)" : "var(--accent)", 
                  color: g.type === "product" ? "white" : "var(--primary)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                }}
              >
                {g.type === "product" ? "Produk" : "Toko"}
              </span>
            </div>

            <div style={{ marginTop: "12px", flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "8px" }}>
              <div>
                <p style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 500, minHeight: "36px", lineClamp: 2 }}>
                  {g.caption || <span style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>Tanpa Keterangan</span>}
                </p>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                  Urutan: {g.sortOrder}
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px", borderTop: "1px solid var(--border-color)", paddingTop: "8px" }}>
                <button onClick={() => handleOpenEditForm(g)} className="action-btn-edit" style={{ flex: 1, height: "32px", display: "flex", justifyContent: "center", alignItems: "center" }} title="Edit">
                  <EditIcon size={14} /> <span style={{ fontSize: "0.8rem", marginLeft: "4px" }}>Edit</span>
                </button>
                {g.id && (
                  <button onClick={() => handleDeleteItem(g.id!)} className="action-btn-delete" style={{ flex: 1, height: "32px", display: "flex", justifyContent: "center", alignItems: "center" }} title="Hapus">
                    <TrashIcon size={14} /> <span style={{ fontSize: "0.8rem", marginLeft: "4px" }}>Hapus</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredGallery.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>
            Belum ada foto dalam kategori ini.
          </div>
        )}
      </div>

      {/* CRUD Modal Form */}
      {isFormOpen && editingItem && (
        <div className="admin-modal-overlay">
          <div className="admin-modal glass-card" style={{ maxWidth: "450px" }}>
            <h3 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "12px", marginBottom: "20px", color: "var(--primary)" }}>
              {editingItem.id ? "Edit Foto Galeri" : "Tambah Foto Baru"}
            </h3>

            <form onSubmit={handleSaveItem}>
              <div className="form-group">
                <label className="form-label">Kategori Foto</label>
                <select
                  className="form-control"
                  value={editingItem.type}
                  onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value as "product" | "store" })}
                >
                  <option value="product">Produk Pempek/Makanan</option>
                  <option value="store">Area Outlet/Toko/Proses Pembuatan</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Gambar Galeri</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {editingItem.imageUrl && (
                    <div style={{ position: "relative", width: "120px", height: "120px", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border-color)", background: "rgba(0,0,0,0.02)" }}>
                      <img src={editingItem.imageUrl} alt="Pratinjau Galeri" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: "none" }}
                      id="gallery-image-file"
                      disabled={uploading}
                    />
                    <label htmlFor="gallery-image-file" className="btn btn-secondary btn-sm" style={{ margin: 0, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                      📁 {uploading ? "Memproses & Kompres..." : editingItem.imageUrl ? "Ubah Foto (Upload Lokal)" : "Pilih & Upload Foto"}
                    </label>
                    <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "6px" }}>
                      Format: JPG, PNG, WEBP. Maksimal 2MB. Gambar akan dikompres otomatis.
                    </span>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Keterangan Foto (Caption)</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingItem.caption || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, caption: e.target.value })}
                  placeholder="Contoh: Pempek Lenjer Jumbo disajikan dengan ebi"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Urutan Tampilan</label>
                <input
                  type="number"
                  className="form-control"
                  value={editingItem.sortOrder}
                  onChange={(e) => setEditingItem({ ...editingItem, sortOrder: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>

              {/* Modal buttons */}
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", borderTop: "1px solid var(--border-color)", paddingTop: "16px", marginTop: "24px" }}>
                <button type="button" onClick={() => { setIsFormOpen(false); setEditingItem(null); }} className="btn btn-secondary btn-sm">
                  Batalkan
                </button>
                <button type="submit" disabled={submitting || uploading} className="btn btn-primary btn-sm">
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
