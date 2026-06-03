"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { user, role, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  const isActive = (href: string) => {
    return pathname === href;
  };

  const handleLogout = async () => {
    await signOut();
    router.replace("/login");
  };

  if (loading) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", color: "var(--primary)" }}>
        Memvalidasi Sesi Admin...
      </div>
    );
  }

  // If validation is complete but user has no session, show loading and let redirect work
  if (!user) {
    return null;
  }

  return (
    <div className="admin-dashboard container section-padding animate-fade-in" style={{ minHeight: "100vh" }}>
      {/* Dashboard Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", borderBottom: "1px solid var(--border-color)", paddingBottom: "20px" }}>
        <div>
          <h1 style={{ color: "var(--primary)", fontSize: "2rem" }}>Dashboard Pengelola</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Status Login: <strong style={{ textTransform: "capitalize" }}>{role || "admin"}</strong> (Live Database)
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          {role === "developer" && (
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
            <Link
              href="/dashboard"
              className={`admin-side-btn ${isActive("/dashboard") ? "active" : ""}`}
            >
              📊 Ringkasan
            </Link>
            <Link
              href="/products"
              className={`admin-side-btn ${isActive("/products") ? "active" : ""}`}
            >
              📦 Produk/Menu
            </Link>
            <Link
              href="/banners"
              className={`admin-side-btn ${isActive("/banners") ? "active" : ""}`}
            >
              🎟️ Banner Promo
            </Link>
            <Link
              href="/gallery"
              className={`admin-side-btn ${isActive("/gallery") ? "active" : ""}`}
            >
              🖼️ Galeri Foto
            </Link>
            <Link
              href="/testimonials"
              className={`admin-side-btn ${isActive("/testimonials") ? "active" : ""}`}
            >
              💬 Testimoni
            </Link>
            <Link
              href="/settings"
              className={`admin-side-btn ${isActive("/settings") ? "active" : ""}`}
            >
              ⚙️ Pengaturan Toko
            </Link>
            {role === "developer" && (
              <Link
                href="/users"
                className={`admin-side-btn ${isActive("/users") ? "active" : ""}`}
              >
                👥 Kelola User
              </Link>
            )}
          </nav>
        </aside>

        {/* Right Content Panel */}
        <main className="admin-main-panel glass-card" style={{ padding: "32px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
