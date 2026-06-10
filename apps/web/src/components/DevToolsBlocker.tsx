"use client";

import { useEffect } from "react";

export default function DevToolsBlocker() {
  useEffect(() => {
    // Check if the user is exempt from DevTools blocking
    const checkIsExempt = () => {
      const hostname = window.location.hostname;
      if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "192.168.1.52") {
        return true;
      }
      const cookies = document.cookie.split(";").map(c => c.trim());
      return cookies.some(c => c.startsWith("ceklis_allow_devtools=true"));
    };

    if (checkIsExempt()) {
      return;
    }

    // Block context menu (right-click)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Block shortcut keys
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent F12 (keycode 123)
      if (e.key === "F12" || e.keyCode === 123) {
        e.preventDefault();
        return;
      }

      // Prevent Ctrl + Shift + I (Inspect)
      // Prevent Ctrl + Shift + J (Console)
      // Prevent Ctrl + Shift + C (Element selector)
      if (
        e.ctrlKey &&
        e.shiftKey &&
        (e.key === "I" || e.key === "J" || e.key === "C" || e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)
      ) {
        e.preventDefault();
        return;
      }

      // Prevent Ctrl + U (View source)
      if (e.ctrlKey && (e.key === "u" || e.key === "U" || e.keyCode === 85)) {
        e.preventDefault();
        return;
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
}
