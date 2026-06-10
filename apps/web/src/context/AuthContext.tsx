"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase, dbUsers, isSupabaseConfigured } from "@pempek-ceklis/lib";

interface AuthContextType {
  user: SupabaseUser | null;
  role: "developer" | "admin" | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [role, setRole] = useState<"developer" | "admin" | null>(null);
  const [loading, setLoading] = useState(true);

  const userRef = React.useRef<SupabaseUser | null>(null);
  const roleRef = React.useRef<"developer" | "admin" | null>(null);

  useEffect(() => {
    userRef.current = user;
    roleRef.current = role;
  }, [user, role]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      const checkMockAuth = async () => {
        await Promise.resolve();
        const mockSession = typeof window !== "undefined" ? sessionStorage.getItem("ceklis_mock_user") : null;
        if (mockSession) {
          const mockUser = JSON.parse(mockSession);
          setUser(mockUser as unknown as SupabaseUser);
          setRole(mockUser.role);
        } else {
          setUser(null);
          setRole(null);
        }
        setLoading(false);
      };
      checkMockAuth();
      return () => {};
    }

    setLoading(true);

    // Listen for auth events (Supabase auth listener fires automatically with the initial session on load)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[AuthContext] Auth event:", event, "User ID:", session?.user?.id);

      // If the event is TOKEN_REFRESHED and user ID has not changed, just update the token
      if (event === "TOKEN_REFRESHED" && userRef.current?.id === session?.user?.id) {
        if (session?.user) {
          setUser(session.user);
        }
        return;
      }

      const nextUser = session?.user || null;
      const currentUser = userRef.current;
      const hasUserChanged = currentUser?.id !== nextUser?.id;

      // Only set loading to true if the user changed
      if (hasUserChanged) {
        setLoading(true);
      }

      if (nextUser) {
        setUser(nextUser);
        try {
          // Fetch role only if the user changed or role is missing
          if (hasUserChanged || !roleRef.current) {
            const userRole = await dbUsers.getRole(nextUser.id);
            setRole(userRole);
          }
        } catch (e) {
          console.error("Gagal memuat peran user dari Supabase:", e);
          setRole(null);
        }
      } else {
        setUser(null);
        setRole(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, pass: string) => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      const normalizedEmail = email.trim().toLowerCase();
      if (normalizedEmail === "dev@pempekceklis.com" || normalizedEmail === "admin@pempekceklis.com") {
        const uid = normalizedEmail === "dev@pempekceklis.com" ? "dev-user-uid" : "admin-user-uid";
        const userRole = normalizedEmail === "dev@pempekceklis.com" ? "developer" : "admin";
        const mockUser = { id: uid, email: normalizedEmail, role: userRole };
        
        if (typeof window !== "undefined") {
          sessionStorage.setItem("ceklis_mock_user", JSON.stringify(mockUser));
        }
        setUser(mockUser as unknown as SupabaseUser);
        setRole(userRole);
        setLoading(false);
        return;
      } else {
        setLoading(false);
        throw new Error("Email tidak terdaftar pada sistem draf lokal. Gunakan dev@pempekceklis.com atau admin@pempekceklis.com.");
      }
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: pass
      });
      if (error) throw error;
    } catch (e) {
      setLoading(false);
      throw e;
    }
  };

  const signOut = async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("ceklis_mock_user");
      }
      setUser(null);
      setRole(null);
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (e) {
      console.error("Gagal keluar:", e);
    } finally {
      setUser(null);
      setRole(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return context;
};
