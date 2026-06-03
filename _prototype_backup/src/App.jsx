import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingAction from "./components/FloatingAction";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Testimonials from "./pages/Testimonials";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";
import { mockDb } from "./services/mockDb";

export default function App() {
  const [tab, setTab] = useState("home");
  const [productSlug, setProductSlug] = useState(null);

  // Database States
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  // Initialize DB and load data
  useEffect(() => {
    mockDb.init();
    loadAllData();
  }, []);

  const loadAllData = () => {
    setProducts(mockDb.getProducts());
    setBanners(mockDb.getBanners());
    setTestimonials(mockDb.getTestimonials());
    setGallery(mockDb.getGallery());
    setSettings(mockDb.getSettings());
    setLoading(false);
  };

  // Central DB Update Handler (CRUD actions from Admin Panel)
  const handleUpdateDb = (type, action, payload) => {
    if (type === "product") {
      if (action === "save") mockDb.saveProduct(payload);
      if (action === "delete") mockDb.deleteProduct(payload.id);
    } else if (type === "banner") {
      if (action === "save") mockDb.saveBanner(payload);
      if (action === "delete") mockDb.deleteBanner(payload.id);
    } else if (type === "gallery") {
      if (action === "save") mockDb.saveGallery(payload);
      if (action === "delete") mockDb.deleteGallery(payload.id);
    } else if (type === "testimonial") {
      if (action === "save") mockDb.saveTestimonial(payload);
      if (action === "delete") mockDb.deleteTestimonial(payload.id);
    } else if (type === "settings") {
      if (action === "save") mockDb.saveSettings(payload);
    }
    
    // Reload state after DB updates
    loadAllData();
  };

  if (loading) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", color: "var(--primary)" }}>
        Memuat Website Pempek Cek Lis...
      </div>
    );
  }

  // Page Routing Switch
  const renderPage = () => {
    switch (tab) {
      case "home":
        return (
          <Home
            setTab={setTab}
            setProductSlug={setProductSlug}
            products={products}
            banners={banners}
            testimonials={testimonials}
            gallery={gallery}
            settings={settings}
          />
        );
      case "catalog":
        return <Catalog setTab={setTab} setProductSlug={setProductSlug} products={products} />;
      case "product-detail":
        return <ProductDetail slug={productSlug} setTab={setTab} products={products} settings={settings} />;
      case "about":
        return <About settings={settings} />;
      case "gallery":
        return <Gallery gallery={gallery} />;
      case "testimonials":
        return <Testimonials testimonials={testimonials} />;
      case "contact":
        return <Contact settings={settings} />;
      case "admin":
        return (
          <AdminDashboard
            products={products}
            banners={banners}
            testimonials={testimonials}
            gallery={gallery}
            settings={settings}
            onUpdateDb={handleUpdateDb}
          />
        );
      default:
        return (
          <Home
            setTab={setTab}
            setProductSlug={setProductSlug}
            products={products}
            banners={banners}
            testimonials={testimonials}
            gallery={gallery}
            settings={settings}
          />
        );
    }
  };

  return (
    <div className="app-container">
      {/* Navbar always visible */}
      <Navbar currentTab={tab} setTab={setTab} settings={settings} />

      {/* Dynamic Content */}
      <main className="main-content-wrapper">{renderPage()}</main>

      {/* Footer always visible */}
      <Footer setTab={setTab} settings={settings} />

      {/* Floating Action buttons (Hidden on Admin screen to avoid overlapping content) */}
      {tab !== "admin" && <FloatingAction settings={settings} />}
    </div>
  );
}
