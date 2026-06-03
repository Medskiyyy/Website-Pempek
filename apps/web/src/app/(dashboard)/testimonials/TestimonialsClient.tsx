"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Testimonial } from "@pempek-ceklis/types";
import { dbTestimonials } from "@pempek-ceklis/lib";
import { PlusIcon, EditIcon, TrashIcon, CheckIcon } from "@/components/Icons";

interface TestimonialsClientProps {
  initialTestimonials: Testimonial[];
}

export default function TestimonialsClient({ initialTestimonials }: TestimonialsClientProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleOpenAddForm = () => {
    setEditingItem({
      customerName: "",
      content: "",
      published: true
    });
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (item: Testimonial) => {
    setEditingItem({ ...item });
    setIsFormOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setSubmitting(true);

    try {
      await dbTestimonials.save(editingItem);
      const fresh = await dbTestimonials.getAll();
      setTestimonials(fresh);
      setIsFormOpen(false);
      setEditingItem(null);
      router.refresh();
    } catch (err) {
      console.error("Gagal menyimpan testimoni:", err);
      alert("Gagal menyimpan testimoni, silakan periksa koneksi Firebase.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublish = async (item: Testimonial) => {
    try {
      const updated = { ...item, published: !item.published };
      await dbTestimonials.save(updated);
      const fresh = await dbTestimonials.getAll();
      setTestimonials(fresh);
      router.refresh();
    } catch (err) {
      console.error("Gagal mengubah status publish:", err);
      alert("Gagal mengubah status publish.");
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus testimoni ini?")) {
      try {
        await dbTestimonials.delete(id);
        const fresh = await dbTestimonials.getAll();
        setTestimonials(fresh);
        router.refresh();
      } catch (err) {
        console.error("Gagal menghapus testimoni:", err);
        alert("Gagal menghapus testimoni.");
      }
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2>Kelola Testimoni Pelanggan</h2>
        <button onClick={handleOpenAddForm} className="btn btn-primary btn-sm">
          <PlusIcon size={16} /> Tambah Testimoni
        </button>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nama Pelanggan</th>
              <th>Isi Testimoni</th>
              <th>Status Publikasi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map((t) => (
              <tr key={t.id}>
                <td style={{ minWidth: "150px" }}>
                  <strong>{t.customerName}</strong>
                </td>
                <td style={{ fontStyle: "italic", fontSize: "0.9rem", color: "var(--text-primary)" }}>
                  &ldquo;{t.content}&rdquo;
                </td>
                <td>
                  <button 
                    onClick={() => handleTogglePublish(t)} 
                    className={`badge ${t.published ? "badge-success" : "badge-neutral"}`}
                    style={{ border: "none", cursor: "pointer", outline: "none" }}
                    title="Klik untuk ubah status publikasi"
                  >
                    {t.published ? "🟢 Dipublikasikan" : "🔴 Draft/Disembunyikan"}
                  </button>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => handleOpenEditForm(t)} className="action-btn-edit" title="Edit">
                      <EditIcon size={16} />
                    </button>
                    {t.id && (
                      <button onClick={() => handleDeleteItem(t.id!)} className="action-btn-delete" title="Hapus">
                        <TrashIcon size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {testimonials.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", color: "var(--text-secondary)", padding: "20px" }}>
                  Belum ada testimoni. Klik Tambah Testimoni untuk menginput baru.
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
              {editingItem.id ? "Edit Testimoni" : "Tambah Testimoni Baru"}
            </h3>

            <form onSubmit={handleSaveItem}>
              <div className="form-group">
                <label className="form-label">Nama Pelanggan</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingItem.customerName}
                  onChange={(e) => setEditingItem({ ...editingItem, customerName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Isi Testimoni</label>
                <textarea
                  rows={4}
                  className="form-control"
                  value={editingItem.content}
                  onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                  required
                  placeholder="Masukkan ulasan atau masukan dari pelanggan..."
                ></textarea>
              </div>

              <div className="form-group form-check" style={{ margin: "16px 0" }}>
                <input
                  type="checkbox"
                  id="published"
                  checked={editingItem.published}
                  onChange={(e) => setEditingItem({ ...editingItem, published: e.target.checked })}
                />
                <label htmlFor="published" className="form-label" style={{ margin: 0, cursor: "pointer" }}>
                  Publikasikan testimoni ini agar muncul di halaman depan website
                </label>
              </div>

              {/* Modal buttons */}
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", borderTop: "1px solid var(--border-color)", paddingTop: "16px", marginTop: "24px" }}>
                <button type="button" onClick={() => { setIsFormOpen(false); setEditingItem(null); }} className="btn btn-secondary btn-sm">
                  Batalkan
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary btn-sm">
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
