import React from "react";
import Link from "next/link";
import { dbProducts, dbBanners, dbTestimonials, dbGallery, dbSettings } from "@pempek-ceklis/lib";
import PromoSlider from "@/components/PromoSlider";
import { WhatsAppIcon, InstagramIcon, ArrowRightIcon } from "@/components/Icons";

export const revalidate = 60; // Revalidate pages every 60 seconds (ISR)

export default async function Page() {
  // Fetch data concurrently on the server
  const [products, banners, testimonials, gallery, settings] = await Promise.all([
    dbProducts.getAll("published"),
    dbBanners.getAll(),
    dbTestimonials.getAll(true),
    dbGallery.getAll(),
    dbSettings.get()
  ]);

  // Featured products (is_featured = true, published, max 6)
  const featuredProducts = products.filter(p => p.featured).slice(0, 6);

  // Gallery preview (6 items)
  const galleryPreview = gallery.slice(0, 6);

  // Testimonials list (max 4)
  const activeTestimonials = testimonials.slice(0, 4);

  // Determine Hero image
  const heroImage = settings.heroImage || 
    (products.length > 0 && products[0].images && products[0].images.length > 0
      ? products[0].images[0]
      : "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=800&auto=format&fit=crop&q=80");

  // Dynamic CSS variables for background food photo blend
  const heroStyle = {
    "--hero-bg": `url(${heroImage})`
  } as React.CSSProperties;

  return (
    <div className="home-page animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section" style={heroStyle}>
        <div className="container hero-container grid-2">
          <div className="hero-content">
            <h1 className="hero-title">
              {settings.siteName === "Pempek Palembang Cek Lis" || !settings.siteName ? (
                <>
                  Pempek Palembang
                  <span className="hero-title-break"> Cek Lis</span>
                </>
              ) : (
                settings.siteName
              )}
            </h1>
            <p className="hero-tagline">{settings.heroSubtitle}</p>
            <p className="hero-description">
              Cita rasa legendaris asli Palembang di Tangerang Selatan. Dibuat menggunakan ikan tenggiri segar pilihan dengan resep turun-temurun dan cuko kental ebi yang mantap rasanya!
            </p>
            <div className="hero-ctas">
              <a
                href={`https://wa.me/${settings.whatsapp}?text=Halo%20Pempek%20Cek%20Lis%2C%20saya%20tertarik%20membeli%20pempek%20unggulan%20Anda.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <WhatsAppIcon size={20} />
                Pesan via WhatsApp
              </a>
              <a
                href={`https://instagram.com/${settings.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                <InstagramIcon size={20} />
                Ikuti di Instagram
              </a>
            </div>
          </div>
          <div className="hero-spacer"></div>
        </div>
      </section>

      {/* Promo Slider Banner */}
      <PromoSlider banners={banners} />

      {/* Produk Favorit Section */}
      <section className="section-padding featured-products-section" id="produk">
        <div className="container">
          <div className="section-title-wrapper">
            <h2 className="section-title">Produk Terfavorit</h2>
            <p className="section-subtitle">
              Menu paling populer yang selalu disukai pelanggan setia kami
            </p>
          </div>

          <div className="grid-3">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/produk/${product.slug}`}
                className="glass-card product-card"
              >
                <div className="product-card-image">
                  <img src={product.images[0]} alt={product.name} className="product-img aspect-1-1" />
                  {product.featured && <span className="product-featured-tag">Terpopuler</span>}
                </div>
                <div className="product-card-body">
                  <h3 className="product-card-title">{product.name}</h3>
                  <p className="product-card-price">Rp {product.price.toLocaleString("id-ID")}</p>
                  <p className="product-card-desc">
                    {product.description.length > 80
                      ? `${product.description.substring(0, 80)}...`
                      : product.description}
                  </p>
                  <span className="product-card-link">
                    Lihat Detail <ArrowRightIcon size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center view-all-btn-wrapper">
            <Link href="/produk" className="btn btn-secondary">
              Lihat Semua Menu Pempek
            </Link>
          </div>
        </div>
      </section>

      {/* Galeri Preview Section */}
      <section className="section-padding home-gallery-section">
        <div className="container">
          <div className="section-title-wrapper">
            <h2 className="section-title">Galeri Foto</h2>
            <p className="section-subtitle">Intip kelezatan produk dan suasana toko kami</p>
          </div>

          <div className="grid-3 home-gallery-grid">
            {galleryPreview.map((item) => (
              <div key={item.id} className="home-gallery-item">
                <img src={item.imageUrl} alt={item.caption || "Galeri"} className="gallery-img aspect-1-1" />
                <div className="gallery-item-overlay">
                  <p className="gallery-item-caption">{item.caption}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center view-all-btn-wrapper">
            <Link href="/galeri" className="btn btn-secondary">
              Buka Seluruh Galeri
            </Link>
          </div>
        </div>
      </section>

      {/* Testimoni Section */}
      <section className="section-padding home-testimonials-section">
        <div className="container">
          <div className="section-title-wrapper">
            <h2 className="section-title">Apa Kata Mereka?</h2>
            <p className="section-subtitle">Testimoni tulus dari para pencinta kuliner Pempek Cek Lis</p>
          </div>

          <div className="grid-2 testimonials-grid">
            {activeTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="glass-card testimonial-card">
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-text">&ldquo;{testimonial.content}&rdquo;</p>
                <h4 className="testimonial-author">{testimonial.customerName}</h4>
                <span className="testimonial-badge-verified">Pelanggan Terverifikasi</span>
              </div>
            ))}
          </div>

          <div className="text-center view-all-btn-wrapper">
            <Link href="/testimoni" className="btn btn-secondary">
              Lihat Semua Testimoni
            </Link>
          </div>
        </div>
      </section>

      {/* Area Layanan Section */}
      <section className="section-padding services-area-section">
        <div className="container text-center">
          <h2 className="section-title">Area Layanan Pengiriman</h2>
          <p className="section-subtitle" style={{ marginBottom: "24px" }}>
            Kami melayani pengiriman instan & same-day (Grab/Gojek) untuk wilayah berikut:
          </p>
          <div className="service-areas-list">
            {["Tangerang Selatan", "Serpong", "BSD", "Pamulang", "Ciputat"].map((area, index) => (
              <span key={index} className="service-tag">
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Lokasi Map Section */}
      <section className="section-padding location-section">
        <div className="container grid-2 location-container">
          <div className="location-info">
            <h2 className="section-title" style={{ textAlign: "left", display: "block" }}>
              Lokasi Toko Kami
            </h2>
            <p className="location-desc" style={{ marginTop: "16px" }}>
              Kunjungi outlet fisik kami di Tangerang Selatan untuk merasakan pempek hangat yang disajikan langsung.
            </p>
            <div className="location-details-card">
              <p>
                <strong>Alamat Outlet:</strong><br />
                {settings.address}
              </p>
              <p style={{ marginTop: "16px" }}>
                <strong>Jam Operasional:</strong><br />
                {settings.businessHours}
              </p>
            </div>
            <div className="location-ctas" style={{ marginTop: "24px" }}>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Petunjuk Arah Google Maps
              </a>
            </div>
          </div>
          <div className="location-map-wrapper">
            {settings.googleMapsUrl ? (
              <iframe
                title="Google Maps Location"
                src={settings.googleMapsUrl}
                width="100%"
                height="350"
                style={{ border: 0, borderRadius: "16px" }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            ) : (
              <div className="map-placeholder">Peta Lokasi Google Maps</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
