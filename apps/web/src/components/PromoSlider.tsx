"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "./Icons";
import { Banner } from "@pempek-ceklis/types";

interface PromoSliderProps {
  banners: Banner[];
}

export default function PromoSlider({ banners }: PromoSliderProps) {
  // Filter active banners and check date limits
  const activeBanners = banners.filter((b) => {
    if (!b.active) return false;
    const now = new Date();
    if (b.startDate && new Date(b.startDate) > now) return false;
    if (b.endDate && new Date(b.endDate) < now) return false;
    return true;
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % activeBanners.length);
    }, 5000); // 5 seconds autoplay

    return () => clearInterval(timer);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) {
    return null;
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? activeBanners.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  return (
    <section className="promo-slider-section">
      <div className="container promo-slider-container">
        <div className="promo-slider-wrapper" style={{ overflow: "hidden", position: "relative" }}>
          
          {/* Sliding Track Container */}
          <div 
            style={{ 
              display: "flex", 
              transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)", 
              transform: `translateX(-${currentIndex * 100}%)`,
              width: "100%"
            }}
          >
            {activeBanners.map((banner) => (
              <div 
                className="promo-slide" 
                key={banner.id} 
                style={{ 
                  minWidth: "100%", 
                  flexShrink: 0, 
                  position: "relative",
                  animation: "none" // Disable individual slide fade-in to let horizontal track slide operate cleanly
                }}
              >
                {/* Desktop Banner Image */}
                <img
                  src={banner.desktopImage}
                  alt={banner.title}
                  className="promo-image-desktop"
                />
                {/* Mobile Banner Image */}
                <img
                  src={banner.mobileImage || banner.desktopImage}
                  alt={banner.title}
                  className="promo-image-mobile"
                />

                {/* Banner Text overlay */}
                <div className="promo-overlay">
                  <div className="promo-content">
                    <span className="promo-tag">PROMO TERBATAS</span>
                    <h3 className="promo-title">{banner.title}</h3>
                    {banner.buttonText && (
                      <a
                        href={banner.buttonUrl || "#"}
                        className="btn btn-accent btn-sm promo-cta-btn"
                      >
                        {banner.buttonText}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          {activeBanners.length > 1 && (
            <>
              <button 
                className="slider-control-btn btn-prev" 
                onClick={handlePrev} 
                aria-label="Previous Slide"
                style={{ zIndex: 5 }}
              >
                <ChevronLeftIcon size={20} />
              </button>
              <button 
                className="slider-control-btn btn-next" 
                onClick={handleNext} 
                aria-label="Next Slide"
                style={{ zIndex: 5 }}
              >
                <ChevronRightIcon size={20} />
              </button>

              {/* Slide Indicators / Dots */}
              <div className="slider-dots" style={{ zIndex: 5 }}>
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
