"use client";
import { useEffect } from "react";
import { useThemeStore } from "@/src/store/theme";

export function ThemeInitializer() {
  const { defaultTheme, setTheme } = useThemeStore();

  useEffect(() => {
    // ensure it runs after hydration
    setTimeout(() => setTheme(defaultTheme), 0);
  }, [defaultTheme, setTheme]);

  return null;
}
