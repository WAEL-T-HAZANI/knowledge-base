"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeMode = "light" | "dark";

interface ThemeColors {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  inputBg: string;
  inputText: string;
  borderColor: string;
}

interface ThemeState {
  theme: ThemeMode;
  defaultTheme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (value: ThemeMode) => void;
  setDefaultTheme: (value: ThemeMode) => void;
}

const themes: Record<ThemeMode, ThemeColors> = {
  light: {
    background: "#ffffff",
    foreground: "#000000",
    primary: "#0051ffff",
    secondary: "#6b7280",
    inputBg: "#ffffff",
    inputText: "#000000",
    borderColor: "#d1d5db",
  },
  dark: {
    background: "#111827", // softer dark surface
    foreground: "#f9fafb", // bright readable text
    primary: "#60a5fa", // lighter blue
    secondary: "#cbd5e1", // light gray text
    inputBg: "#1e293b", // form background
    inputText: "#f8fafc",
    borderColor: "#475569", // mid gray border
  },
};

/* Apply CSS variables dynamically */
function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  const palette = themes[mode];
  root.setAttribute("data-theme", mode);

  Object.entries(palette).forEach(([key, value]) => {
    root.style.setProperty(
      `--${key.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}`,
      value
    );
  });
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "light",
      defaultTheme: "light",

      toggleTheme: () => {
        const newTheme = get().theme === "light" ? "dark" : "light";
        applyTheme(newTheme);
        set({ theme: newTheme });
      },

      setTheme: (value) => {
        applyTheme(value);
        set({ theme: value });
      },

      setDefaultTheme: (value) => {
        applyTheme(value);
        set({ defaultTheme: value, theme: value });
      },
    }),
    { name: "theme-storage" }
  )
);
