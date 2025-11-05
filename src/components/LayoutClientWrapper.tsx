"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/src/store/theme";

/**
 * This wrapper applies the Zustand theme reactively on the client side.
 * It should be imported and used inside your RootLayout (layout.tsx).
 */
export default function LayoutClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useThemeStore();

  // Re-apply CSS vars whenever the Zustand theme changes
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
