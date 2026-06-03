import React from "react";
import { dbSettings } from "@pempek-ceklis/lib";
import { WhatsAppIcon, InstagramIcon, ClockIcon } from "@/components/Icons";

export const revalidate = 60; // ISR 60s

export default async function Page() {
  const settings = await dbSettings.get();

  const getMapsSearchUrl = () => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`;
  };

  return (
    <div className="contact-page container section-padding animate-fade-in">
      <div className="section-title-wrapper">
        <h1 className="section-title">Hubungi & Kunjungi Kami</h1>
        <p className="section-subtitle">
          Hubungi kami melalui media sosial atau kunjungi langsung outlet kami di Tangerang Selatan
        </p>
      </div>

      <div className="contact-grid grid-2">
        {/* Left Side: Contact Information Cards */}
        <div className="contact-details-panel">
          <div className="glass-card contact-card-item" style={{ padding: "24px", marginBottom: "20px" }}>
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div className="contact-icon-box" style={{ background: "rgba(var(--primary-rgb), 0.1)", color: "var(--primary)", padding: "12px", borderRadius: "12px" }}>
                <WhatsAppIcon size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.1rem", marginBottom: "6px" }}>Layanan Pelanggan WhatsApp</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "12px" }}>
                  Tanya-tanya menu, ketersediaan produk, pemesanan katering, atau pengiriman cepat.
                </p>
                <a
                  href={`https://wa.me/${settings.whatsapp}?text=Halo%20Pempek%20Cek%20Lis%2C%20saya%20ingin%20tanya%20mengenai%20pempek.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                >
                  Hubungi WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="glass-card contact-card-item" style={{ padding: "24px", marginBottom: "20px" }}>
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div className="contact-icon-box" style={{ background: "rgba(224, 168, 0, 0.1)", color: "var(--accent)", padding: "12px", borderRadius: "12px" }}>
                <InstagramIcon size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.1rem", marginBottom: "6px" }}>Instagram Resmi</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "12px" }}>
                  Ikuti instagram kami untuk update promo terbaru, foto produk menarik, dan testimoni lainnya.
                </p>
                <a
                  href={`https://instagram.com/${settings.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                >
                  Kunjungi @{settings.instagram}
                </a>
              </div>
            </div>
          </div>

          <div className="glass-card contact-card-item" style={{ padding: "24px", marginBottom: "20px" }}>
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div className="contact-icon-box" style={{ background: "rgba(66, 133, 244, 0.1)", color: "#4285F4", padding: "12px", borderRadius: "12px" }}>
                <ClockIcon size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.1rem", marginBottom: "6px" }}>Alamat & Jam Operasional</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "8px" }}>
                  <strong>Outlet:</strong> {settings.address}
                </p>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                  <strong>Operasional:</strong> {settings.businessHours}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Google Maps Embed */}
        <div className="contact-map-panel glass-card" style={{ padding: "16px", display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, minHeight: "300px" }}>
            {settings.googleMapsUrl ? (
              <iframe
                title="Google Maps Location"
                src={settings.googleMapsUrl}
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: "12px", minHeight: "320px" }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            ) : (
              <div className="map-placeholder" style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                Google Maps Embed Placeholder
              </div>
            )}
          </div>
          <div style={{ marginTop: "16px", textAlign: "center" }}>
            <a
              href={getMapsSearchUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ width: "100%" }}
            >
              Buka Petunjuk Arah di Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
