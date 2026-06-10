import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingAction from "@/components/FloatingAction";
import { dbSettings } from "@pempek-ceklis/lib";
import { AuthProvider } from "@/context/AuthContext";
import RealtimeListener from "@/components/RealtimeListener";

const outfit = Outfit({
  variable: "--font-title",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"]
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "Pempek Palembang Cek Lis - Cita Rasa Otentik Tangerang Selatan",
  description: "Beli Pempek asli Palembang yang lezat dan bergizi di Tangerang Selatan. Dibuat menggunakan ikan tenggiri segar berkualitas dengan cuko kental pedas manis ebi.",
  keywords: [
    "pempek palembang tangerang selatan",
    "pempek enak tangerang selatan",
    "pempek serpong",
    "tekwan tangerang selatan",
    "pempek asli palembang"
  ]
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch store configuration settings dynamically
  const settings = await dbSettings.get();

  return (
    <html lang="id" className={`${outfit.variable} ${inter.variable}`}>
      <body>
        <AuthProvider>
          <RealtimeListener />
          <div className="app-container">
            <Navbar settings={settings} />
            <main className="main-content-wrapper">{children}</main>
            <Footer settings={settings} />
            <FloatingAction settings={settings} />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
