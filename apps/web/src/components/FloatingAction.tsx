"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { WhatsAppIcon, InstagramIcon, MapsIcon } from "./Icons";
import { Settings } from "@pempek-ceklis/types";

interface FloatingActionProps {
  settings: Settings;
}

export default function FloatingAction({ settings }: FloatingActionProps) {
  const pathname = usePathname();
  
  const openLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const getMapsSearchUrl = () => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`;
  };

  // Hide floating action buttons on admin panel pages and login page
  const isAdminPage = pathname === "/login" || [
    "/dashboard",
    "/products",
    "/banners",
    "/gallery",
    "/testimonials",
    "/settings",
    "/users"
  ].some(path => pathname === path || pathname.startsWith(path + "/"));

  if (isAdminPage) return null;

  return (
    <div className="fab-container">
      <button
        onClick={() => openLink(getMapsSearchUrl())}
        className="fab-btn fab-maps"
        title="Lokasi Google Maps"
        aria-label="Google Maps Location"
      >
        <MapsIcon size={26} />
      </button>
      <button
        onClick={() => openLink(`https://instagram.com/${settings.instagram}`)}
        className="fab-btn fab-ig"
        title="Instagram"
        aria-label="Instagram Profile"
      >
        <InstagramIcon size={26} />
      </button>
      <button
        onClick={() => openLink(`https://wa.me/${settings.whatsapp}?text=Halo%20Pempek%20Cek%20Lis%2C%20saya%20tertarik%20membeli%20pempek%20Anda.`)}
        className="fab-btn fab-wa"
        title="WhatsApp Chat"
        aria-label="WhatsApp Chat"
      >
        <WhatsAppIcon size={26} />
      </button>
    </div>
  );
}
