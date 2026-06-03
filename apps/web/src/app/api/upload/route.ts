import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Client with service_role key for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

export async function POST(req: NextRequest) {
  console.log("[API Upload] Menerima permintaan upload gambar...");
  try {
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Kredensial server Supabase (URL/Service Role Key) belum di-setup." },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "Tidak ada file yang dikirimkan." }, { status: 400 });
    }

    // Convert file to ArrayBuffer and then Buffer for upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique name
    const fileName = `${folder}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    console.log("[API Upload] Mengunggah file ke Supabase Storage via admin:", fileName);

    const { data, error } = await supabaseAdmin.storage
      .from("pempek-cek-lis")
      .upload(fileName, buffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || "image/jpeg"
      });

    if (error) {
      console.error("[API Upload] Gagal upload ke storage:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from("pempek-cek-lis")
      .getPublicUrl(fileName);

    if (!urlData || !urlData.publicUrl) {
      return NextResponse.json({ error: "Gagal mendapatkan URL publik gambar" }, { status: 500 });
    }

    console.log("[API Upload] Berhasil diunggah. URL Publik:", urlData.publicUrl);
    return NextResponse.json({ url: urlData.publicUrl });
  } catch (err) {
    console.error("[API Upload] Terjadi kesalahan fatal:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
