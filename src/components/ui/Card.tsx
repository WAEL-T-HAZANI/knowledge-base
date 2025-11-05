"use client";

import React from "react";
import { useThemeStore } from "@/src/store/theme";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  const { theme } = useThemeStore();

  const colors =
    theme === "dark"
      ? {
          background: "#111827",
          borderColor: "#475569",
          foreground: "#f9fafb",
        }
      : {
          background: "#fff",
          borderColor: "#d1d5db",
          foreground: "#000",
        };

  return (
    <div
      className={`p-6 rounded-2xl shadow-sm transition-colors ${className}`}
      style={{
        backgroundColor: colors.background,
        border: `1px solid ${colors.borderColor}`,
        color: colors.foreground,
      }}
    >
      {children}
    </div>
  );
}
