// components/common/UserProfileProvider.jsx
"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "ateliux:profile";

const DEFAULT_PROFILE = {
  name: "Administrador Ateliux",
  email: "contato@ateliux.com",
  phone: "+55 11 99999-0000",
  role: "Operações",
  language: "pt-BR",
  avatar: "https://i.pravatar.cc/64?img=68",
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
};

const UserProfileContext = createContext(null);

export function UserProfileProvider({ children }) {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfile((prev) => ({
          ...prev,
          ...parsed,
          notifications: { ...prev.notifications, ...(parsed.notifications || {}) },
        }));
      }
    } catch (err) {
      console.warn("Falha ao carregar perfil local", err);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready || typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile, ready]);

  const value = useMemo(
    () => ({
      profile,
      ready,
      updateProfile: (updates) =>
        setProfile((prev) => ({
          ...prev,
          ...updates,
          notifications: updates.notifications
            ? { ...prev.notifications, ...updates.notifications }
            : prev.notifications,
        })),
      resetProfile: () => setProfile(DEFAULT_PROFILE),
    }),
    [profile, ready]
  );

  return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>;
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) {
    throw new Error("useUserProfile precisa estar dentro de UserProfileProvider");
  }
  return ctx;
}
