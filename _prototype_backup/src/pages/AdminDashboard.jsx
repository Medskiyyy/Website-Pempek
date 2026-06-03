import React, { useState } from "react";
import { PlusIcon, EditIcon, TrashIcon, CheckIcon } from "../components/Icons";

export default function AdminDashboard({
  products,
  banners,
  testimonials,
  gallery,
  settings,
  onUpdateDb
}) {
  // Authentication Sim
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Role Sim
  const [userRole, setUserRole] = useState("admin"); // 'admin' or 'developer'

  // Dashboard Navigation Tabs
  const [activeTab, setActiveTab] = useState("products");

  // Form Modals / Drawer State
  const [editingItem, setEditingItem] = useState(null); // holds item being edited/added
  const [itemType, setItemType] = useState(null); // 'product', 'banner', 'gallery', 'testimonial'
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Settings local state
  const [localSettings, setLocalSettings] = useState({ ...settings });

  // Quick helper for Unsplash URL suggestions
  const unsplashSuggestions = [
    "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=600&auto=format&fit=crop&q=80"
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      setIsAuthenticated(true);
      setUserRole("admin");
      setLoginError("");
    } else if (username === "dev" && password === "dev") {
      setIsAuthenticated(true);
      setUserRole("developer");
      setLoginError("");
    } else {
      setLoginError("Username atau password salah! (Gunakan admin/admin atau dev/dev untuk prototipe)");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
  };

  // --- CRUD Operations ---
  const handleOpenAddForm = (type) => {
    setItemType(type);
    setIsFormOpen(true);
    if (type === "product") {
      setEditingItem({
        name: "",
        description: "",
        price: 0,
        status: "published",
        is_featured: false,
        images: [unsplashSuggestions[Math.floor(Math.random() * unsplashSuggestions.length)]],
        seo_title: "",
        seo_description: ""
      });
    } else if (type === "banner") {
      setEditingItem({
        title: "",
        desktop_image_url: unsplashSuggestions[0],
        mobile_image_url: unsplashSuggestions[0],
        cta_label: "Pesan Sekarang",
        cta_url: "",
        start_date: new Date().toISOString().substring(0, 10),
        end_date: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().substring(0, 10),
        is_active: true
      });
    } else if (type === "gallery") {
      setEditingItem({
        image_url: unsplashSuggestions[0],
        caption: "",
        gallery_type: "product"
      });
    } else if (type === "testimonial") {
      setEditingItem({
        customer_name: "",
        content: "",
        is_published: true
      });
    }
  };

  const handleOpenEditForm = (type, item) => {
    setItemType(type);
    setEditingItem({ ...item });
    setIsFormOpen(true);
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    onUpdateDb(itemType, "save", editingItem);
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (type, id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus item ini?")) {
      onUpdateDb(type, "delete", { id });
    }
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    onUpdateDb("settings", "save", localSettings);
    alert("Pengaturan toko berhasil disimpan!");
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-page container section-padding animate-fade-in" style={{ maxWidth: "450px" }}>
        <div className="glass-card login-card" style={{ padding: "40px" }}>
          <h2 className="text-center" style={{ color: "var(--primary)", marginBottom: "8px" }}>
            Admin Panel Login
          </h2>
          <p className="text-center" style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "24px" }}>
            Kelola katalog produk, banner promo, galeri, dan testimoni.
          </p>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                required
              />
            </div>

            {loginError && <p style={{ color: "var(--error)", fontSize: "0.85rem", marginBottom: "16px" }}>{loginError}</p>}

            <button type="submit" className="btn btn-primary btn-block">
              Masuk Dashboard
            </button>
          </form>

          <div style={{ marginTop: "24px", background: "rgba(var(--secondary-rgb), 0.05)", padding: "12px", borderRadius: "8px", fontSize: "0.85rem" }}>
            <p><strong>Akses Demo Prototipe:</strong></p>
            <p>• Role Admin: <code>admin</code> / <code>admin</code></p>
            <p>• Role Developer: <code>dev</code> / <code>dev</code></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard container section-padding animate-fade-in">
      {/* Dashboard Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", borderBottom: "1px solid var(--border-color)", paddingBottom: "20px" }}>
        <div>
          <h1 style={{ color: "var(--primary)", fontSize: "2rem" }}>Dashboard Pengelola</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Status Login: <strong style={{ textTransform: "capitalize" }}>{userRole}</strong> (Demo Mode)
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          {userRole === "developer" && (
            <span className="badge badge-success" style={{ backgroundColor: "#E3F2FD", color: "#1E88E5", display: "flex", alignItems: "center" }}>
              Developer Mode (Full Access)
            </span>
          )}
          <button onClick={handleLogout} className="btn btn-secondary btn-sm">
            Keluar
          </button>
        </div>
      </div>

      <div className="admin-dashboard-grid" style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "32px" }}>
        {/* Left Navigation Sidebar */}
        <aside className="admin-sidebar glass-card" style={{ padding: "16px", height: "fit-content" }}>
          <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <button
              onClick={() => setActiveTab("products")}
              className={`admin-side-btn ${activeTab === "products" ? "active" : ""}`}
            >
              📦 Produk/Menu
            </button>
            <button
              onClick={() => setActiveTab("banners")}
              className={`admin-side-btn ${activeTab === "banners" ? "active" : ""}`}
            >
              🎟️ Banner Promo
            </button>
            <button
              onClick={() => setActiveTab("gallery")}
              className={`admin-side-btn ${activeTab === "gallery" ? "active" : ""}`}
            >
              🖼️ Galeri Foto
            </button>
            <button
              onClick={() => setActiveTab("testimonials")}
              className={`admin-side-btn ${activeTab === "testimonials" ? "active" : ""}`}
            >
              💬 Testimoni
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`admin-side-btn ${activeTab === "settings" ? "active" : ""}`}
            >
              ⚙️ Pengaturan Toko
            </button>
          </nav>
        </aside>

        {/* Right Content Panel */}
        <main className="admin-main-panel glass-card" style={{ padding: "32px" }}>
          {/* TAB 1: PRODUCTS */}
          {activeTab === "products" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h2>Kelola Produk & Menu</h2>
                <button onClick={() => handleOpenAddForm("product")} className="btn btn-primary btn-sm">
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
                        <td>{p.is_featured ? "⭐ Unggulan" : "Biasa"}</td>
                        <td>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button onClick={() => handleOpenEditForm("product", p)} className="action-btn-edit" title="Edit">
                              <EditIcon size={16} />
                            </button>
                            <button onClick={() => handleDeleteItem("product", p.id)} className="action-btn-delete" title="Hapus">
                              <TrashIcon size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: BANNERS */}
          {activeTab === "banners" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h2>Kelola Banner Promo</h2>
                <button onClick={() => handleOpenAddForm("banner")} className="btn btn-primary btn-sm">
                  <PlusIcon size={16} /> Tambah Banner
                </button>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Gambar</th>
                      <th>Judul Promo</th>
                      <th>Aktif</th>
                      <th>Periode</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {banners.map((b) => (
                      <tr key={b.id}>
                        <td>
                          <img src={b.desktop_image_url} alt={b.title} style={{ width: "80px", height: "45px", borderRadius: "6px", objectFit: "cover" }} />
                        </td>
                        <td>
                          <strong>{b.title}</strong>
                          {b.cta_label && <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-secondary)" }}>CTA: {b.cta_label}</span>}
                        </td>
                        <td>
                          <span className={`badge ${b.is_active ? "badge-success" : "badge-neutral"}`}>
                            {b.is_active ? "Aktif" : "Nonaktif"}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: "0.8rem" }}>
                            {b.start_date} s/d {b.end_date}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button onClick={() => handleOpenEditForm("banner", b)} className="action-btn-edit" title="Edit">
                              <EditIcon size={16} />
                            </button>
                            <button onClick={() => handleDeleteItem("banner", b.id)} className="action-btn-delete" title="Hapus">
                              <TrashIcon size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: GALLERY */}
          {activeTab === "gallery" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h2>Kelola Galeri Foto</h2>
                <button onClick={() => handleOpenAddForm("gallery")} className="btn btn-primary btn-sm">
                  <PlusIcon size={16} /> Tambah Foto
                </button>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Foto</th>
                      <th>Keterangan (Caption)</th>
                      <th>Kategori</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gallery.map((g) => (
                      <tr key={g.id}>
                        <td>
                          <img src={g.image_url} alt="Galeri" style={{ width: "50px", height: "50px", borderRadius: "6px", objectFit: "cover" }} />
                        </td>
                        <td>{g.caption || "-"}</td>
                        <td>
                          <span className="badge badge-neutral" style={{ textTransform: "capitalize" }}>
                            {g.gallery_type === "product" ? "Produk" : "Toko/Dapur"}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button onClick={() => handleOpenEditForm("gallery", g)} className="action-btn-edit" title="Edit">
                              <EditIcon size={16} />
                            </button>
                            <button onClick={() => handleDeleteItem("gallery", g.id)} className="action-btn-delete" title="Hapus">
                              <TrashIcon size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: TESTIMONIALS */}
          {activeTab === "testimonials" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h2>Kelola Testimoni Pelanggan</h2>
                <button onClick={() => handleOpenAddForm("testimonial")} className="btn btn-primary btn-sm">
                  <PlusIcon size={16} /> Tambah Testimoni
                </button>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nama Pelanggan</th>
                      <th>Isi Testimoni</th>
                      <th>Publish</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testimonials.map((t) => (
                      <tr key={t.id}>
                        <td><strong>{t.customer_name}</strong></td>
                        <td style={{ maxWidth: "350px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                          {t.content}
                        </td>
                        <td>
                          <span className={`badge ${t.is_published ? "badge-success" : "badge-neutral"}`}>
                            {t.is_published ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button onClick={() => handleOpenEditForm("testimonial", t)} className="action-btn-edit" title="Edit">
                              <EditIcon size={16} />
                            </button>
                            <button onClick={() => handleDeleteItem("testimonial", t.id)} className="action-btn-delete" title="Hapus">
                              <TrashIcon size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === "settings" && (
            <div>
              <h2>Pengaturan Konfigurasi Toko</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "24px" }}>
                Perubahan pada halaman ini langsung memperbarui kontak WhatsApp, Instagram, Alamat Maps, dan Logo di seluruh website.
              </p>

              {userRole === "admin" && (
                <div style={{ padding: "12px", background: "#FFF3E0", borderLeft: "4px solid #FF9800", borderRadius: "4px", marginBottom: "20px", fontSize: "0.85rem" }}>
                  <strong>Informasi Peran:</strong> Sebagai <strong>Admin</strong>, Anda memiliki izin terbatas. Anda tidak dapat mengubah nama brand dan integrasi maps. Masuk sebagai <strong>Developer</strong> untuk membuka akses penuh.
                </div>
              )}

              <form onSubmit={handleSaveSettings}>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Nama Brand</label>
                    <input
                      type="text"
                      className="form-control"
                      value={localSettings.brandName}
                      onChange={(e) => setLocalSettings({ ...localSettings, brandName: e.target.value })}
                      disabled={userRole === "admin"}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Link Logo URL (Kosongkan jika ingin logo teks)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={localSettings.logoUrl}
                      onChange={(e) => setLocalSettings({ ...localSettings, logoUrl: e.target.value })}
                      placeholder="https://link-ke-logo-anda.png"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Tagline Brand</label>
                  <input
                    type="text"
                    className="form-control"
                    value={localSettings.tagline}
                    onChange={(e) => setLocalSettings({ ...localSettings, tagline: e.target.value })}
                    required
                  />
                </div>

                <div className="grid-3">
                  <div className="form-group">
                    <label className="form-label">Nomor WhatsApp (Format: 628xxxx)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={localSettings.whatsappNumber}
                      onChange={(e) => setLocalSettings({ ...localSettings, whatsappNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Username Instagram (Tanpa @)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={localSettings.instagramUsername}
                      onChange={(e) => setLocalSettings({ ...localSettings, instagramUsername: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">URL GoFood Outlet</label>
                    <input
                      type="text"
                      className="form-control"
                      value={localSettings.gojekUrl}
                      onChange={(e) => setLocalSettings({ ...localSettings, gojekUrl: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Alamat Outlet Fisik</label>
                  <textarea
                    rows="2"
                    className="form-control"
                    value={localSettings.address}
                    onChange={(e) => setLocalSettings({ ...localSettings, address: e.target.value })}
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Jam Operasional Toko</label>
                  <input
                    type="text"
                    className="form-control"
                    value={localSettings.workingHours}
                    onChange={(e) => setLocalSettings({ ...localSettings, workingHours: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">URL Embed Google Maps Iframe</label>
                  <input
                    type="text"
                    className="form-control"
                    value={localSettings.googleMapsEmbedUrl}
                    onChange={(e) => setLocalSettings({ ...localSettings, googleMapsEmbedUrl: e.target.value })}
                    disabled={userRole === "admin"}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: "12px" }}>
                  Simpan Semua Pengaturan
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* CRUD MODAL FORM */}
      {isFormOpen && editingItem && (
        <div className="admin-modal-overlay">
          <div className="admin-modal glass-card">
            <h3 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "12px", marginBottom: "20px", color: "var(--primary)" }}>
              {editingItem.id ? "Edit Record" : "Tambah Record Baru"} (Kategori: {itemType})
            </h3>

            <form onSubmit={handleSaveItem}>
              {/* Product Form */}
              {itemType === "product" && (
                <>
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
                        onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Deskripsi Lengkap</label>
                    <textarea
                      rows="3"
                      className="form-control"
                      value={editingItem.description}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Link Gambar Utama (URL)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingItem.images[0] || ""}
                      onChange={(e) => {
                        const newImgs = [...editingItem.images];
                        newImgs[0] = e.target.value;
                        setEditingItem({ ...editingItem, images: newImgs });
                      }}
                      required
                    />
                    <div className="suggestion-pill-box" style={{ marginTop: "8px" }}>
                      <span style={{ fontSize: "0.75rem", display: "block", color: "var(--text-secondary)", marginBottom: "4px" }}>Rekomendasi Foto Unsplash (Klik untuk gunakan):</span>
                      {unsplashSuggestions.map((url, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            const newImgs = [...editingItem.images];
                            newImgs[0] = url;
                            setEditingItem({ ...editingItem, images: newImgs });
                          }}
                          className="unsplash-suggest-btn"
                        >
                          Foto {i + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group form-check" style={{ margin: "16px 0" }}>
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={editingItem.is_featured}
                      onChange={(e) => setEditingItem({ ...editingItem, is_featured: e.target.checked })}
                    />
                    <label htmlFor="is_featured" className="form-label" style={{ margin: 0, cursor: "pointer" }}>
                      Tampilkan di Produk Favorit Halaman Utama
                    </label>
                  </div>

                  <div style={{ background: "rgba(0,0,0,0.02)", padding: "16px", borderRadius: "8px", marginTop: "16px" }}>
                    <h4 style={{ fontSize: "0.9rem", marginBottom: "12px", color: "var(--primary)" }}>SEO Metadata</h4>
                    <div className="form-group">
                      <label className="form-label">SEO Title</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingItem.seo_title || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, seo_title: e.target.value })}
                        placeholder="Judul SEO untuk Google Search"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">SEO Description</label>
                      <textarea
                        rows="2"
                        className="form-control"
                        value={editingItem.seo_description || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, seo_description: e.target.value })}
                        placeholder="Deskripsi ringkas yang muncul di hasil Google Search"
                      ></textarea>
                    </div>
                  </div>
                </>
              )}

              {/* Banner Form */}
              {itemType === "banner" && (
                <>
                  <div className="form-group">
                    <label className="form-label">Judul Promo</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingItem.title}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">URL Gambar Banner Desktop (1200x400)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingItem.desktop_image_url}
                      onChange={(e) => setEditingItem({ ...editingItem, desktop_image_url: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">URL Gambar Banner Mobile (600x400)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingItem.mobile_image_url}
                      onChange={(e) => setEditingItem({ ...editingItem, mobile_image_url: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Label Tombol CTA</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingItem.cta_label}
                        onChange={(e) => setEditingItem({ ...editingItem, cta_label: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">URL Link CTA (Bisa link WA/Menu)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingItem.cta_url}
                        onChange={(e) => setEditingItem({ ...editingItem, cta_url: e.target.value })}
                        placeholder="Contoh: #produk atau https://wa.me/..."
                      />
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Tanggal Mulai</label>
                      <input
                        type="date"
                        className="form-control"
                        value={editingItem.start_date}
                        onChange={(e) => setEditingItem({ ...editingItem, start_date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tanggal Berakhir</label>
                      <input
                        type="date"
                        className="form-control"
                        value={editingItem.end_date}
                        onChange={(e) => setEditingItem({ ...editingItem, end_date: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group form-check" style={{ margin: "16px 0" }}>
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={editingItem.is_active}
                      onChange={(e) => setEditingItem({ ...editingItem, is_active: e.target.checked })}
                    />
                    <label htmlFor="is_active" className="form-label" style={{ margin: 0, cursor: "pointer" }}>
                      Banner Aktif & Tampil
                    </label>
                  </div>
                </>
              )}

              {/* Gallery Form */}
              {itemType === "gallery" && (
                <>
                  <div className="form-group">
                    <label className="form-label">URL Gambar (Rasio 1:1 direkomendasikan)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingItem.image_url}
                      onChange={(e) => setEditingItem({ ...editingItem, image_url: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Keterangan Foto (Caption)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingItem.caption}
                      onChange={(e) => setEditingItem({ ...editingItem, caption: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Kategori Galeri</label>
                    <select
                      className="form-control"
                      value={editingItem.gallery_type}
                      onChange={(e) => setEditingItem({ ...editingItem, gallery_type: e.target.value })}
                    >
                      <option value="product">Produk Makanan</option>
                      <option value="store">Suasana Outlet / Dapur</option>
                    </select>
                  </div>
                </>
              )}

              {/* Testimonial Form */}
              {itemType === "testimonial" && (
                <>
                  <div className="form-group">
                    <label className="form-label">Nama Pelanggan</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingItem.customer_name}
                      onChange={(e) => setEditingItem({ ...editingItem, customer_name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Isi Testimoni</label>
                    <textarea
                      rows="4"
                      className="form-control"
                      value={editingItem.content}
                      onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <div className="form-group form-check" style={{ margin: "16px 0" }}>
                    <input
                      type="checkbox"
                      id="is_published"
                      checked={editingItem.is_published}
                      onChange={(e) => setEditingItem({ ...editingItem, is_published: e.target.checked })}
                    />
                    <label htmlFor="is_published" className="form-label" style={{ margin: 0, cursor: "pointer" }}>
                      Publikasikan Testimoni Secara Langsung
                    </label>
                  </div>
                </>
              )}

              {/* Form buttons */}
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", borderTop: "1px solid var(--border-color)", paddingTop: "16px", marginTop: "24px" }}>
                <button type="button" onClick={() => { setIsFormOpen(false); setEditingItem(null); }} className="btn btn-secondary btn-sm">
                  Batalkan
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  <CheckIcon size={16} /> Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
