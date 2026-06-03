import React from "react";
import { WhatsAppIcon, InstagramIcon, MapsIcon } from "./Icons";

export default function FloatingAction({ settings }) {
  const openLink = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const getMapsSearchUrl = () => {
    // If maps embed url is set, we can extract details or just open search in Google Maps for the address
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`;
  };

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
        onClick={() => openLink(`https://instagram.com/${settings.instagramUsername}`)}
        className="fab-btn fab-ig"
        title="Instagram"
        aria-label="Instagram Profile"
      >
        <InstagramIcon size={26} />
      </button>
      <button
        onClick={() => openLink(`https://wa.me/${settings.whatsappNumber}?text=Halo%20Pempek%20Cek%20Lis%2C%20saya%20ingin%20tanya%20mengenai%20pempek.`)}
        className="fab-btn fab-wa"
        title="WhatsApp Chat"
        aria-label="WhatsApp Chat"
      >
        <WhatsAppIcon size={26} />
      </button>
    </div>
  );
}
