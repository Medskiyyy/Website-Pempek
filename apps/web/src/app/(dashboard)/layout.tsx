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
    <div className="admin-dashboard container section-padding animate-fade-in-simple" style={{ minHeight: "100vh" }}>
      {/* Dashboard Top bar */}
      <div className="admin-top-bar">
        <div>
          <h1 className="admin-title">Dashboard Pengelola</h1>
          <p className="admin-status">
            Status Login: <strong style={{ textTransform: "capitalize" }}>{role || "admin"}</strong> (Live Database)
          </p>
        </div>
        <div className="admin-top-bar-actions">
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

      <div className="admin-dashboard-grid">
        {/* Left Navigation Sidebar */}
        <aside className="admin-sidebar glass-card">
          <nav className="admin-nav-list">
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
        <main className="admin-main-panel glass-card">
          {children}
        </main>
      </div>
    </div>
  );
}
