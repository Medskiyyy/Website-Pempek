"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Settings } from "@pempek-ceklis/types";
import { dbSettings, uploadImage } from "@pempek-ceklis/lib";
import { useAuth } from "@/context/AuthContext";
import { CheckIcon } from "@/components/Icons";

interface SettingsClientProps {
  initialSettings: Settings;
}

export default function SettingsClient({ initialSettings }: SettingsClientProps) {
  const { role } = useAuth();
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const router = useRouter();

  const isLocked = false; // Disabled role lock as requested: normal admin can edit settings fully

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file gambar maksimal adalah 2MB.");
      return;
    }

    setUploadingHero(true);

    try {
      const url = await uploadImage(file, "settings");
      setSettings((prev) => ({ ...prev, heroImage: url }));
    } catch (err) {
      console.error("Gagal mengunggah file hero:", err);
      alert("Gagal mengunggah & mengompres gambar hero.");
    } finally {
      setUploadingHero(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg("");

    let cleanedMapsUrl = settings.googleMapsUrl.trim();
    if (cleanedMapsUrl) {
      if (cleanedMapsUrl.includes("<iframe")) {
        const match = cleanedMapsUrl.match(/src=["']([^"']+)["']/);
        if (match && match[1]) {
          cleanedMapsUrl = match[1];
        }
      } else if (cleanedMapsUrl.includes("maps.app.goo.gl") || cleanedMapsUrl.includes("goo.gl/maps")) {
        cleanedMapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(settings.address)}&output=embed`;
      } else if (cleanedMapsUrl.includes("/maps/place/")) {
        const placeMatch = cleanedMapsUrl.match(/\/maps\/place\/([^/]+)/);
        if (placeMatch && placeMatch[1]) {
          const coordMatch = cleanedMapsUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
          if (coordMatch && coordMatch[1] && coordMatch[2]) {
            cleanedMapsUrl = `https://maps.google.com/maps?q=${placeMatch[1]}&ll=${coordMatch[1]},${coordMatch[2]}&z=16&output=embed`;
          } else {
            cleanedMapsUrl = `https://maps.google.com/maps?q=${placeMatch[1]}&z=16&output=embed`;
          }
        }
      } else if (cleanedMapsUrl.includes("/maps/") && cleanedMapsUrl.includes("@")) {
        const coordMatch = cleanedMapsUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (coordMatch && coordMatch[1] && coordMatch[2]) {
          cleanedMapsUrl = `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&z=16&output=embed`;
        }
      }
    }

    const updatedSettings = {
      ...settings,
      phone: settings.whatsapp, // Synchronize phone with WhatsApp
      googleMapsUrl: cleanedMapsUrl
    };

    try {
      await dbSettings.save(updatedSettings);
      setSettings(updatedSettings);
      setSuccessMsg("Pengaturan berhasil disimpan dan disinkronkan!");
      setTimeout(() => setSuccessMsg(""), 4000);
      router.refresh();
    } catch (err) {
      console.error("Gagal menyimpan pengaturan:", err);
      alert("Gagal menyimpan pengaturan, periksa koneksi Supabase Anda.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px" }}>
      <h2 style={{ marginBottom: "8px" }}>Pengaturan Toko & Informasi Kontak</h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: "24px", fontSize: "0.9rem" }}>
        Konfigurasi informasi kontak WhatsApp, Instagram, alamat outlet, jam operasional, dan data SEO global website.
      </p>



      {successMsg && (
        <div style={{ background: "#E8F5E9", border: "1px solid #C8E6C9", color: "#2E7D32", padding: "12px 16px", borderRadius: "6px", marginBottom: "24px", fontSize: "0.9rem", fontWeight: 500 }}>
          ✓ {successMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="glass-card" style={{ padding: "24px" }}>
        {/* Brand Information Section */}
        <h3 style={{ fontSize: "1.1rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px", marginBottom: "16px", color: "var(--primary)" }}>
          Identitas Brand & Teks Hero Halaman Utama
        </h3>

        <div className="form-group">
          <label className="form-label">Nama Website / Brand</label>
          <input
            type="text"
            className="form-control"
            value={settings.siteName}
            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            disabled={isLocked}
            required
            style={isLocked ? { backgroundColor: "#f5f5f5", cursor: "not-allowed" } : {}}
          />
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Judul Utama Hero (Hero Title)</label>
            <input
              type="text"
              className="form-control"
              value={settings.heroTitle}
              onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
              disabled={isLocked}
              required
              style={isLocked ? { backgroundColor: "#f5f5f5", cursor: "not-allowed" } : {}}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Subjudul Hero (Hero Subtitle)</label>
            <input
              type="text"
              className="form-control"
              value={settings.heroSubtitle}
              onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
              disabled={isLocked}
              required
              style={isLocked ? { backgroundColor: "#f5f5f5", cursor: "not-allowed" } : {}}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Foto Banner Utama (Hero Image)</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {settings.heroImage && (
              <div style={{ position: "relative", width: "240px", height: "135px", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border-color)", background: "rgba(0,0,0,0.02)" }}>
                <img
                  src={settings.heroImage}
                  alt="Pratinjau Foto Hero"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            )}
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleHeroImageUpload}
                style={{ display: "none" }}
                id="hero-image-file"
                disabled={uploadingHero}
              />
              <label htmlFor="hero-image-file" className="btn btn-secondary btn-sm" style={{ margin: 0, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                📁 {uploadingHero ? "Memproses & Kompres..." : settings.heroImage ? "Ubah Foto Hero (Upload Lokal)" : "Pilih & Upload Foto Hero"}
              </label>
              <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "6px" }}>
                Format: JPG, PNG, WEBP. Maksimal 2MB. Gambar akan dikompres otomatis.
              </span>
            </div>
          </div>
        </div>

        {/* Operational & Contact Section */}
        <h3 style={{ fontSize: "1.1rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px", marginBottom: "16px", color: "var(--primary)", marginTop: "24px" }}>
          Kontak & Alamat Outlet (Aktif)
        </h3>

        <div style={{ marginBottom: "20px" }}>
          <div className="form-group" style={{ maxWidth: "500px" }}>
            <label className="form-label">Nomor WhatsApp Order (Format Internasional)</label>
            <input
              type="text"
              className="form-control"
              value={settings.whatsapp}
              onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value, phone: e.target.value })}
              placeholder="Contoh: 6281234567890 (Jangan pakai 0 atau +)"
              required
            />
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Format angka tanpa spasi/tanda tambah, contoh: 62812xxxxxxxx</span>
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Username Instagram</label>
            <input
              type="text"
              className="form-control"
              value={settings.instagram}
              onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
              placeholder="Contoh: pempekceklis.tangsel"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Jam Operasional Toko</label>
            <input
              type="text"
              className="form-control"
              value={settings.businessHours}
              onChange={(e) => setSettings({ ...settings, businessHours: e.target.value })}
              placeholder="Contoh: Setiap Hari (10.00 – 21.00 WIB)"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Alamat Lengkap Toko</label>
          <textarea
            rows={2}
            className="form-control"
            value={settings.address}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            placeholder="Tulis alamat fisik lengkap untuk footer dan halaman kontak..."
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label className="form-label">Google Maps Link / URL Embed / Iframe HTML</label>
          <textarea
            rows={3}
            className="form-control"
            value={settings.googleMapsUrl}
            onChange={(e) => setSettings({ ...settings, googleMapsUrl: e.target.value })}
            disabled={isLocked}
            required
            placeholder="Tempel share link (https://maps.app.goo.gl/...) atau iframe HTML Sematkan Peta dari Google Maps"
            style={isLocked ? { backgroundColor: "#f5f5f5", cursor: "not-allowed", fontSize: "0.85rem", fontFamily: "monospace" } : { fontSize: "0.85rem", fontFamily: "monospace" }}
          ></textarea>
          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
            Anda dapat langsung menempelkan URL address bar browser, link bagikan (<code>https://maps.app.goo.gl/...</code>), atau seluruh tag <code>&lt;iframe&gt;</code> HTML dari Google Maps. Sistem akan memprosesnya otomatis.
          </span>
        </div>

        {/* Submit Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid var(--border-color)", paddingTop: "16px", marginTop: "24px" }}>
          <button type="submit" disabled={submitting} className="btn btn-primary btn-sm">
            <CheckIcon size={16} /> {submitting ? "Menyimpan..." : "Simpan Semua Pengaturan"}
          </button>
        </div>
      </form>
    </div>
  );
}
