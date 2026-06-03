import React, { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "./Icons";

export default function PromoSlider({ banners }) {
  // Filter active banners and check date limits
  const activeBanners = banners.filter((b) => {
    if (!b.is_active) return false;
    const now = new Date();
    if (b.start_date && new Date(b.start_date) > now) return false;
    if (b.end_date && new Date(b.end_date) < now) return false;
    return true;
  });

  if (activeBanners.length === 0) {
    return null;
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % activeBanners.length);
    }, 5000); // 5 seconds autoplay

    return () => clearInterval(timer);
  }, [activeBanners.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? activeBanners.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const currentBanner = activeBanners[currentIndex];

  return (
    <section className="promo-slider-section">
      <div className="container promo-slider-container">
        <div className="promo-slider-wrapper">
          {/* Main Slide Card */}
          <div className="promo-slide" key={currentBanner.id}>
            {/* Desktop Banner Image */}
            <img
              src={currentBanner.desktop_image_url}
              alt={currentBanner.title}
              className="promo-image-desktop"
            />
            {/* Mobile Banner Image */}
            <img
              src={currentBanner.mobile_image_url || currentBanner.desktop_image_url}
              alt={currentBanner.title}
              className="promo-image-mobile"
            />

            {/* Banner Text overlay */}
            <div className="promo-overlay">
              <div className="promo-content">
                <span className="promo-tag">PROMO TERBATAS</span>
                <h3 className="promo-title">{currentBanner.title}</h3>
                {currentBanner.cta_label && (
                  <a
                    href={currentBanner.cta_url || "#"}
                    className="btn btn-accent btn-sm promo-cta-btn"
                  >
                    {currentBanner.cta_label}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          {activeBanners.length > 1 && (
            <>
              <button className="slider-control-btn btn-prev" onClick={handlePrev} aria-label="Previous Slide">
                <ChevronLeftIcon size={20} />
              </button>
              <button className="slider-control-btn btn-next" onClick={handleNext} aria-label="Next Slide">
                <ChevronRightIcon size={20} />
              </button>

              {/* Slide Indicators / Dots */}
              <div className="slider-dots">
                {activeBanners.map((_, idx) => (
                  <button
                    key={idx}
                    className={`slider-dot ${idx === currentIndex ? "active" : ""}`}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
