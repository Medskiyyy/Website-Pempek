import { createClient } from "@supabase/supabase-js";
export type { User } from "@supabase/supabase-js";

// Check if credentials are valid
export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL !== "undefined" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== "" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== "undefined" &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "undefined" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "undefined";

const supabaseUrl = isSupabaseConfigured
  ? process.env.NEXT_PUBLIC_SUPABASE_URL!
  : "https://dummy-project-id.supabase.co";

const supabaseAnonKey = isSupabaseConfigured
  ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  : "dummy-key-to-avoid-build-time-crashing";

// Initialize Supabase Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client-side image compression helper (from canvas)
export const compressImage = (file: File, maxWidth = 1000, maxHeight = 1000, quality = 0.75): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    console.log("[compressImage] Memulai proses kompresi untuk:", file.name, file.size);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Resize keeping ratio
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Gagal mengambil context 2D canvas"));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          
          if (!canvas.toBlob) {
            reject(new Error("canvas.toBlob tidak didukung di browser ini"));
            return;
          }

          canvas.toBlob(
            (blob) => {
              if (blob) {
                console.log("[compressImage] Kompresi selesai. Ukuran terkompresi:", blob.size);
                resolve(blob);
              } else {
                reject(new Error("Gagal kompresi canvas"));
              }
            },
            "image/jpeg",
            quality
          );
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = (err) => reject(err);
      img.src = event.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
  });
};

// Supabase Storage upload function with 15s timeout
export const uploadImage = async (file: File, folder: string): Promise<string> => {
  console.log("[uploadImage] Memulai proses upload ke Supabase untuk folder:", folder);
  let uploadBlob: Blob = file;
  
  try {
    // 6-second timeout for image compression
    const compressionPromise = compressImage(file, 1200, 1200, 0.75);
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error("Batas waktu kompresi terlampaui")), 6000)
    );
    uploadBlob = await Promise.race([compressionPromise, timeoutPromise]);
  } catch (e) {
    console.warn("[uploadImage] Gagal/timeout kompresi gambar, menggunakan file asli:", e);
    if (typeof window !== "undefined") {
      alert(`Pemberitahuan: Gagal mengompresi gambar (${e instanceof Error ? e.message : "Error tidak diketahui"}). Gambar asli tetap akan diunggah.`);
    }
  }

  if (!isSupabaseConfigured) {
    console.log("[uploadImage] Kredensial Supabase tidak di-setup, menggunakan fallback base64.");
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(uploadBlob);
    });
  }

  // Uploading to Supabase Storage
  try {
    // 15-second timeout wrap for upload
    const uploadPromise = (async () => {
      // Check if we are running in the admin panel and can use the local server API
      // apps/admin runs on port 3001 and has the /api/upload route
      if (typeof window !== "undefined") {
        console.log("[uploadImage] Mengunggah melalui API Route internal server...");
        const formData = new FormData();
        formData.append("file", new File([uploadBlob], file.name, { type: uploadBlob.type }));
        formData.append("folder", folder);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP error! status: ${response.status}`);
        }

        const resData = await response.json();
        if (!resData.url) throw new Error("API tidak mengembalikan URL gambar.");
        
        console.log("[uploadImage] Unggah API sukses. URL:", resData.url);
        return resData.url;
      }

      // Fallback for Node.js seeding scripts/server-side direct client operations
      const fileName = `${folder}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
      const { data, error } = await supabase.storage
        .from("pempek-cek-lis")
        .upload(fileName, uploadBlob, {
          cacheControl: "3600",
          upsert: false,
          contentType: "image/jpeg"
        });

      if (error) throw error;
      if (!data) throw new Error("Gagal menerima data respon unggah dari Supabase Storage");

      const { data: urlData } = supabase.storage
        .from("pempek-cek-lis")
        .getPublicUrl(fileName);

      if (!urlData || !urlData.publicUrl) {
        throw new Error("Gagal membuat URL publik gambar");
      }

      return urlData.publicUrl;
    })();

    const uploadTimeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Batas waktu unggah ke Supabase Storage terlampaui (15 detik).")), 15000)
    );

    return await Promise.race([uploadPromise, uploadTimeout]);
  } catch (err) {
    console.error("[uploadImage] Gagal saat mengunggah ke Storage:", err);
    if (typeof window !== "undefined") {
      alert(`Gagal mengunggah gambar ke Supabase Storage: ${err instanceof Error ? err.message : "Error tidak diketahui"}. Gambar akan disimpan sebagai data lokal sementara.`);
    }
    // Fallback: save as base64 data URL to prevent UI from locking up
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(uploadBlob);
    });
  }
};
