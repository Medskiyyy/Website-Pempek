"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@pempek-ceklis/lib";

export default function RealtimeListener() {
  const router = useRouter();

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // Subscribe to all changes in public schema
    const channel = supabase
      .channel("db-realtime-sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public" },
        (payload) => {
          console.log("[RealtimeListener] Database changed, refreshing page data...", payload.table);
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
