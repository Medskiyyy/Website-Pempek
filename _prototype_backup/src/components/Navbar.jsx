import React, { useState } from "react";

export default function Navbar({ currentTab, setTab, settings }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: "home", label: "Beranda" },
    { id: "catalog", label: "Menu Pempek" },
    { id: "gallery", label: "Galeri" },
    { id: "testimonials", label: "Testimoni" },
    { id: "about", label: "Tentang Kami" },
    { id: "contact", label: "Kontak" }
  ];

  const handleNavClick = (tabId) => {
    setTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        <div className="navbar-logo" onClick={() => handleNavClick("home")}>
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt={settings.brandName} className="navbar-logo-img" />
          ) : (
            <span className="navbar-logo-text">
              Pempek <span className="text-accent">Cek Lis</span>
            </span>
          )}
        </div>

        {/* Desktop Nav */}
        <nav className="navbar-desktop-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`nav-link ${currentTab === item.id ? "active" : ""}`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick("admin")}
            className={`btn btn-secondary btn-sm nav-admin-btn ${currentTab === "admin" ? "active-admin" : ""}`}
          >
            Admin Panel
          </button>
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
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`mobile-nav-link ${currentTab === item.id ? "active" : ""}`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick("admin")}
            className="btn btn-secondary btn-block mobile-admin-btn"
          >
            Admin Panel
          </button>
        </div>
      )}
    </header>
  );
}
