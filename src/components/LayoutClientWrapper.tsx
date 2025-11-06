"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/src/store/theme";

/**
 * This wrapper applies the Zustand theme reactively on the client side.
 */
export default function LayoutClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      {children}
    </div>
  );
}
