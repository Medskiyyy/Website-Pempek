"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { user, signIn, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await signIn(email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg || "Email atau password salah!");
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login-page container section-padding animate-fade-in" style={{ maxWidth: "450px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <div className="glass-card login-card" style={{ padding: "40px", width: "100%" }}>
        <h2 className="text-center" style={{ color: "var(--primary)", marginBottom: "8px" }}>
          Admin Panel Login
        </h2>
        <p className="text-center" style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "24px" }}>
          Kelola katalog produk, banner promo, galeri, dan testimoni.
        </p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email admin"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
            />
          </div>

          {error && <p style={{ color: "var(--error)", fontSize: "0.85rem", marginBottom: "16px" }}>{error}</p>}

          <button type="submit" disabled={submitting || loading} className="btn btn-primary btn-block">
            {submitting ? "Memproses..." : "Masuk Dashboard"}
          </button>
        </form>


      </div>
    </div>
  );
}
