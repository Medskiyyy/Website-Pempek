"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@pempek-ceklis/types";
import { dbUsers } from "@pempek-ceklis/lib";
import { useAuth } from "@/context/AuthContext";
import { PlusIcon, EditIcon, CheckIcon } from "@/components/Icons";

interface UsersClientProps {
  initialUsers: User[];
}

export default function UsersClient({ initialUsers }: UsersClientProps) {
  const { role, user: currentUser, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  // Load users client-side to ensure Supabase auth token is attached in browser request
  useEffect(() => {
    if (!authLoading && role === "developer") {
      const fetchUsers = async () => {
        try {
          const data = await dbUsers.getAll();
          setUsers(data);
        } catch (err) {
          console.error("Gagal memuat daftar user:", err);
        } finally {
          setLoadingUsers(false);
        }
      };
      fetchUsers();
    }
  }, [role, authLoading]);

  // Redirect or block rendering if role is not developer
  useEffect(() => {
    if (!authLoading && role !== "developer") {
      router.replace("/dashboard");
    }
  }, [role, authLoading, router]);

  if (authLoading || role !== "developer") {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "var(--text-secondary)" }}>
        Memeriksa Otorisasi Pengguna...
      </div>
    );
  }

  if (loadingUsers) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "var(--text-secondary)" }}>
        Memuat Daftar Pengguna...
      </div>
    );
  }

  const handleOpenAddForm = () => {
    setEditingItem({
      uid: "",
      email: "",
      role: "admin"
    });
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (item: User) => {
    setEditingItem({ ...item });
    setIsFormOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setSubmitting(true);

    try {
      await dbUsers.saveRole(editingItem);
      const fresh = await dbUsers.getAll();
      setUsers(fresh);
      setIsFormOpen(false);
      setEditingItem(null);
      router.refresh();
    } catch (err) {
      console.error("Gagal menyimpan data user:", err);
      alert("Gagal menyimpan data user. Periksa kembali input Anda.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h2>Kelola Akses Pengguna (RBAC)</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "4px" }}>
            Hanya Developer yang dapat mengelola daftar pengguna dan pembagian peran (Role-based Access Control).
          </p>
        </div>
        <button onClick={handleOpenAddForm} className="btn btn-primary btn-sm">
          <PlusIcon size={16} /> Daftarkan User UID
        </button>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>UID Pengguna (Supabase)</th>
              <th>Email</th>
              <th>Peran (Role)</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.uid} style={u.uid === currentUser?.id ? { backgroundColor: "rgba(27, 94, 32, 0.03)" } : {}}>
                <td>
                  <code style={{ fontSize: "0.85rem" }}>{u.uid}</code>
                  {u.uid === currentUser?.id && (
                    <span className="badge badge-success" style={{ marginLeft: "8px", fontSize: "0.7rem", padding: "2px 6px" }}>
                      Anda
                    </span>
                  )}
                </td>
                <td>
                  <strong>{u.email}</strong>
                </td>
                <td>
                  <span className={`badge ${u.role === "developer" ? "badge-success" : "badge-neutral"}`} style={{ textTransform: "capitalize" }}>
                    👤 {u.role}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button 
                      onClick={() => handleOpenEditForm(u)} 
                      className="action-btn-edit" 
                      title="Edit Peran"
                      disabled={u.uid === currentUser?.id}
                      style={u.uid === currentUser?.id ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                    >
                      <EditIcon size={16} /> Edit
                    </button>
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
          <div className="admin-modal glass-card" style={{ maxWidth: "450px" }}>
            <h3 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "12px", marginBottom: "20px", color: "var(--primary)" }}>
              {editingItem.uid ? "Edit Peran Pengguna" : "Daftarkan UID Pengguna Baru"}
            </h3>

            <form onSubmit={handleSaveItem}>
              {editingItem.uid ? (
                <div className="form-group">
                  <label className="form-label">UID Pengguna (Tidak dapat diubah)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingItem.uid}
                    disabled
                    style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
                  />
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label">UID Pengguna (Supabase User UID)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingItem.uid}
                    onChange={(e) => setEditingItem({ ...editingItem, uid: e.target.value.trim() })}
                    required
                    placeholder="Masukkan UID unik dari Supabase Auth console"
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Alamat Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={editingItem.email}
                  onChange={(e) => setEditingItem({ ...editingItem, email: e.target.value.trim() })}
                  required
                  placeholder="Contoh: admin.baru@pempekceklis.com"
                  disabled={!!editingItem.uid && editingItem.uid !== ""}
                  style={!!editingItem.uid && editingItem.uid !== "" ? { backgroundColor: "#f5f5f5", cursor: "not-allowed" } : {}}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Pilih Peran (Role)</label>
                <select
                  className="form-control"
                  value={editingItem.role}
                  onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value as "developer" | "admin" })}
                >
                  <option value="admin">Admin (Akses terbatas ke konten)</option>
                  <option value="developer">Developer (Akses penuh + Kelola User)</option>
                </select>
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
