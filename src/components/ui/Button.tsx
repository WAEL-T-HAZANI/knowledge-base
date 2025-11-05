"use client";

import React from "react";
import clsx from "clsx";
import { useThemeStore } from "@/src/store/theme";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
}

export default function Button({
  variant = "primary",
  loading = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const { theme } = useThemeStore();
  const palette =
    (useThemeStore.getState() as any)._storage?.state?.theme || theme;

  const { primary, foreground, background, borderColor } =
    useThemeStore.getState().theme === "dark"
      ? {
          primary: "#60a5fa",
          foreground: "#f9fafb",
          background: "#111827",
          borderColor: "#475569",
        }
      : {
          primary: "#0051ff",
          foreground: "#000",
          background: "#fff",
          borderColor: "#d1d5db",
        };

  const base =
    "px-4 py-2 rounded-md font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed";

  const variants: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: primary, color: "#fff", border: "none" },
    secondary: {
      backgroundColor: background,
      color: foreground,
      border: `1px solid ${borderColor}`,
    },
    danger: {
      backgroundColor: "#dc2626",
      color: "#fff",
      border: "none",
    },
  };

  return (
    <button
      className={clsx(base, className)}
      style={variants[variant]}
      {...props}
    >
      {loading ? "..." : children}
    </button>
  );
}
