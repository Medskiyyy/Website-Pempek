import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read environment variables from env files
const getEnvVars = () => {
  const envPaths = [
    path.join(__dirname, "../../apps/admin/.env.local"),
    path.join(__dirname, "../../apps/web/.env.local"),
    path.join(__dirname, "../../../.env.local"),
    path.join(__dirname, "../.env.local")
  ];
  
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  let serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  for (const p of envPaths) {
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, "utf-8");
      const lines = content.split("\n");
      for (const line of lines) {
        const parts = line.split("=");
        if (parts.length >= 2) {
          const key = parts[0].trim();
          const val = parts.slice(1).join("=").trim().replace(/^['"]|['"]$/g, "");
          if (key === "NEXT_PUBLIC_SUPABASE_URL") supabaseUrl = val;
          if (key === "SUPABASE_SERVICE_ROLE_KEY") serviceRoleKey = val;
        }
      }
      break;
    }
  }

  return { supabaseUrl, serviceRoleKey };
};

const { supabaseUrl, serviceRoleKey } = getEnvVars();

if (!supabaseUrl || !serviceRoleKey) {
  console.error("ERROR: NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib didefinisikan!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function run() {
  console.log("=== Membuat Bucket Supabase Storage ===");
  try {
    const { data, error } = await supabase.storage.createBucket("pempek-cek-lis", {
      public: true,
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
      fileSizeLimit: 2 * 1024 * 1024 // 2MB
    });

    if (error) {
      if (error.message.includes("already exists")) {
        console.log("✔ Bucket 'pempek-cek-lis' sudah ada.");
      } else {
        throw error;
      }
    } else {
      console.log("✔ Berhasil membuat Bucket 'pempek-cek-lis' secara publik:", data);
    }
  } catch (err) {
    console.error("Gagal membuat bucket storage:", err);
    process.exit(1);
  }
}

run();
