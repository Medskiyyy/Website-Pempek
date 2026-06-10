"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@pempek-ceklis/lib";

export default function RealtimeListener() {
  const router = useRouter();

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // Anonymous clients must subscribe to specific tables explicitly for RLS to evaluate correctly
    const tables = ["products", "banners", "testimonials", "gallery", "settings"];
    
    const channel = supabase.channel("db-realtime-sync");
    
    tables.forEach((tableName) => {
      channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table: tableName },
        (payload) => {
          console.log(`[RealtimeListener] Table "${tableName}" changed:`, payload.eventType);
          router.refresh();
        }
      );
    });

    channel.subscribe((status) => {
      console.log("[RealtimeListener] Realtime subscription status:", status);
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
