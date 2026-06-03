"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Settings } from "@pempek-ceklis/types";

interface NavbarProps {
  settings: Settings;
}

export default function Navbar({ settings }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { href: "/", label: "Beranda" },
    { href: "/produk", label: "Menu Pempek" },
    { href: "/galeri", label: "Galeri" },
    { href: "/testimoni", label: "Testimoni" },
    { href: "/tentang", label: "Tentang Kami" },
    { href: "/kontak", label: "Kontak" }
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    // Prevent normal Link redirection to '/' if click counter is active
    const now = Date.now();
    
    // Reset click count if time gap between clicks is larger than 2 seconds
    if (now - lastClickTime > 2000) {
      setClickCount(1);
    } else {
      const nextCount = clickCount + 1;
      setClickCount(nextCount);
      if (nextCount === 5) {
        e.preventDefault();
        setClickCount(0);
        // Navigate to the hidden admin login panel
        router.push("/login");
      }
    }
    setLastClickTime(now);
  };

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        <Link 
          href="/" 
          onClick={handleLogoClick}
          className="navbar-logo" 
          title={settings?.siteName || "Pempek Palembang Cek Lis"}
        >
          {/* Logo can be dynamically set via logoUrl in settings or fall back to text */}
          {/* Note: since logoUrl is part of Settings schema, we support it */}
          {/* For this version, let's display text unless settings siteName is set */}
          <span className="navbar-logo-text">
            Pempek <span className="text-accent">Cek Lis</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar-desktop-nav">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${isActive(item.href) ? "active" : ""}`}
            >
              {item.label}
            </Link>
          ))}

        </nav>

        {/* Mobile menu toggle */}
        <button
          className="navbar-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-drawer">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`mobile-nav-link ${isActive(item.href) ? "active" : ""}`}
            >
              {item.label}
            </Link>
          ))}

        </div>
      )}
    </header>
  );
}
