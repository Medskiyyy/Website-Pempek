import React from "react";
import Link from "next/link";
import { Settings } from "@pempek-ceklis/types";

interface FooterProps {
  settings: Settings;
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-section">
      <div className="container footer-grid">
        <div className="footer-brand">
          <h3 className="footer-logo">
            Pempek <span className="text-accent">Cek Lis</span>
          </h3>
          <p className="footer-tagline">{settings.heroSubtitle}</p>
          <div className="footer-socials">
            <a href={`https://instagram.com/${settings.instagram}`} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="WhatsApp">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-links">
          <h4 className="footer-title">Navigasi</h4>
          <ul>
            <li><Link href="/" className="footer-nav-btn">Beranda</Link></li>
            <li><Link href="/produk" className="footer-nav-btn">Menu Pempek</Link></li>
            <li><Link href="/galeri" className="footer-nav-btn">Galeri Foto</Link></li>
            <li><Link href="/testimoni" className="footer-nav-btn">Testimoni</Link></li>
            <li><Link href="/tentang" className="footer-nav-btn">Tentang Kami</Link></li>
            <li><Link href="/kontak" className="footer-nav-btn">Hubungi Kami</Link></li>
          </ul>
        </div>

        <div className="footer-info">
          <h4 className="footer-title">Info Kontak</h4>
          <p className="footer-text">
            <strong>Alamat:</strong><br />
            {settings.address}
          </p>
          <p className="footer-text">
            <strong>Jam Operasional:</strong><br />
            {settings.businessHours}
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {currentYear} {settings.siteName}. All Rights Reserved. Made for culinary excellence in Tangerang Selatan.</p>
      </div>
    </footer>
  );
}
