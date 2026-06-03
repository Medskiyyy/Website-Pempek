"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Banner } from "@pempek-ceklis/types";
import { dbBanners, uploadImage } from "@pempek-ceklis/lib";
import { PlusIcon, EditIcon, TrashIcon, CheckIcon } from "@/components/Icons";

interface BannersClientProps {
  initialBanners: Banner[];
}

export default function BannersClient({ initialBanners }: BannersClientProps) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Banner | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingDesktop, setUploadingDesktop] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);
  const router = useRouter();

  const unsplashSuggestions = [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=1200&auto=format&fit=crop&q=80"
  ];

  const handleOpenAddForm = () => {
    const today = new Date().toISOString().split("T")[0];
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
    const end = threeMonthsLater.toISOString().split("T")[0];

    setEditingItem({
      title: "",
      desktopImage: unsplashSuggestions[0],
      mobileImage: unsplashSuggestions[0].replace("w=1200", "w=600"),
      buttonText: "Pesan Sekarang",
      buttonUrl: "#produk",
      active: true,
      startDate: today,
      endDate: end,
      sortOrder: banners.length + 1
    });
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (item: Banner) => {
    setEditingItem({ ...item });
    setIsFormOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setSubmitting(true);

    try {
      await dbBanners.save(editingItem);
      const fresh = await dbBanners.getAll();
      setBanners(fresh);
      setIsFormOpen(false);
      setEditingItem(null);
      router.refresh();
    } catch (err) {
      console.error("Gagal menyimpan banner:", err);
      alert("Gagal menyimpan banner promo, silakan periksa koneksi Supabase.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus banner ini?")) {
      try {
        await dbBanners.delete(id);
        const fresh = await dbBanners.getAll();
        setBanners(fresh);
        router.refresh();
      } catch (err) {
        console.error("Gagal menghapus banner:", err);
        alert("Gagal menghapus banner.");
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: "desktop" | "mobile") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file gambar maksimal adalah 2MB.");
      return;
    }

    if (target === "desktop") setUploadingDesktop(true);
    else setUploadingMobile(true);

    try {
      const url = await uploadImage(file, "banners");
      if (editingItem) {
        setEditingItem({
          ...editingItem,
          [target === "desktop" ? "desktopImage" : "mobileImage"]: url
        });
      }
    } catch (err) {
      console.error("Gagal mengunggah file:", err);
      alert("Gagal mengunggah & mengompres gambar.");
    } finally {
      if (target === "desktop") setUploadingDesktop(false);
      else setUploadingMobile(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2>Kelola Banner Promo</h2>
        <button onClick={handleOpenAddForm} className="btn btn-primary btn-sm">
          <PlusIcon size={16} /> Tambah Banner
        </button>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Gambar (Desktop/Mobile)</th>
              <th>Judul Promo</th>
              <th>Tombol Aksi</th>
              <th>Masa Berlaku</th>
              <th>Urutan</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((b) => (
              <tr key={b.id}>
                <td>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <img src={b.desktopImage} alt="Desktop" style={{ width: "60px", height: "35px", borderRadius: "4px", objectFit: "cover" }} />
                    <img src={b.mobileImage} alt="Mobile" style={{ width: "35px", height: "35px", borderRadius: "4px", objectFit: "cover" }} />
                  </div>
                </td>
                <td>
                  <strong>{b.title}</strong>
                </td>
                <td style={{ maxWidth: "200px" }}>
                  {b.buttonText ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{b.buttonText}</span>
                      <span 
                        style={{ fontSize: "0.75rem", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}
                        title={b.buttonUrl}
                      >
                        {b.buttonUrl}
                      </span>
                    </div>
                  ) : (
                    <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Tanpa Tombol</span>
                  )}
                </td>
                <td style={{ fontSize: "0.85rem" }}>
                  {b.startDate} s/d {b.endDate}
                </td>
                <td>{b.sortOrder}</td>
                <td>
                  <span className={`badge ${b.active ? "badge-success" : "badge-neutral"}`}>
                    {b.active ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => handleOpenEditForm(b)} className="action-btn-edit" title="Edit">
                      <EditIcon size={16} />
                    </button>
                    {b.id && (
                      <button onClick={() => handleDeleteItem(b.id!)} className="action-btn-delete" title="Hapus">
                        <TrashIcon size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {banners.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", color: "var(--text-secondary)", padding: "20px" }}>
                  Belum ada banner promo. Klik Tambah Banner untuk membuat baru.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CRUD Modal Form */}
      {isFormOpen && editingItem && (
        <div className="admin-modal-overlay">
          <div className="admin-modal glass-card">
            <h3 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "12px", marginBottom: "20px", color: "var(--primary)" }}>
              {editingItem.id ? "Edit Banner Promo" : "Tambah Banner Promo"}
            </h3>

            <form onSubmit={handleSaveItem}>
              <div className="form-group">
                <label className="form-label">Judul Promo / Teks Banner</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gambar Desktop (Rekomendasi Rasio Panjang, e.g. 1200x380)</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {editingItem.desktopImage && (
                    <div style={{ position: "relative", width: "240px", height: "76px", borderRadius: "6px", overflow: "hidden", border: "1px solid var(--border-color)", background: "rgba(0,0,0,0.02)" }}>
                      <img src={editingItem.desktopImage} alt="Pratinjau Desktop" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "desktop")}
                      style={{ display: "none" }}
                      id="desktop-image-file"
                      disabled={uploadingDesktop}
                    />
                    <label htmlFor="desktop-image-file" className="btn btn-secondary btn-sm" style={{ margin: 0, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                      📁 {uploadingDesktop ? "Memproses & Kompres..." : editingItem.desktopImage ? "Ubah Gambar Desktop (Upload Lokal)" : "Pilih & Upload Gambar Desktop"}
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Gambar Mobile (Rekomendasi Rasio Kotak/Pendek, e.g. 600x300)</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {editingItem.mobileImage && (
                    <div style={{ position: "relative", width: "120px", height: "60px", borderRadius: "6px", overflow: "hidden", border: "1px solid var(--border-color)", background: "rgba(0,0,0,0.02)" }}>
                      <img src={editingItem.mobileImage} alt="Pratinjau Mobile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "mobile")}
                      style={{ display: "none" }}
                      id="mobile-image-file"
                      disabled={uploadingMobile}
                    />
                    <label htmlFor="mobile-image-file" className="btn btn-secondary btn-sm" style={{ margin: 0, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                      📁 {uploadingMobile ? "Memproses & Kompres..." : editingItem.mobileImage ? "Ubah Gambar Mobile (Upload Lokal)" : "Pilih & Upload Gambar Mobile"}
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Teks Tombol Aksi (CTA)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingItem.buttonText}
                    onChange={(e) => setEditingItem({ ...editingItem, buttonText: e.target.value })}
                    placeholder="Contoh: Pesan Sekarang"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Link Tombol Aksi (URL/Anchor)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingItem.buttonUrl}
                    onChange={(e) => setEditingItem({ ...editingItem, buttonUrl: e.target.value })}
                    placeholder="Contoh: #produk atau link WA"
                  />
                </div>
              </div>

              <div className="grid-3">
                <div className="form-group">
                  <label className="form-label">Tanggal Mulai</label>
                  <input
                    type="date"
                    className="form-control"
                    value={editingItem.startDate}
                    onChange={(e) => setEditingItem({ ...editingItem, startDate: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tanggal Selesai</label>
                  <input
                    type="date"
                    className="form-control"
                    value={editingItem.endDate}
                    onChange={(e) => setEditingItem({ ...editingItem, endDate: e.target.value })}
                    required
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
              </div>

              <div className="form-group form-check" style={{ margin: "16px 0" }}>
                <input
                  type="checkbox"
                  id="active"
                  checked={editingItem.active}
                  onChange={(e) => setEditingItem({ ...editingItem, active: e.target.checked })}
                />
                <label htmlFor="active" className="form-label" style={{ margin: 0, cursor: "pointer" }}>
                  Aktifkan banner ini di halaman utama (sesuai tanggal aktif)
                </label>
              </div>

              {/* Modal buttons */}
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", borderTop: "1px solid var(--border-color)", paddingTop: "16px", marginTop: "24px" }}>
                <button type="button" onClick={() => { setIsFormOpen(false); setEditingItem(null); }} className="btn btn-secondary btn-sm">
                  Batalkan
                </button>
                <button type="submit" disabled={submitting || uploadingDesktop || uploadingMobile} className="btn btn-primary btn-sm">
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
