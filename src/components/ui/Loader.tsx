"use client";
import React from "react";
import { useThemeStore } from "@/src/store/theme";

interface LoaderProps {
  size?: "small" | "medium" | "large";
  color?: string; // optional override
}

const Loader: React.FC<LoaderProps> = ({ size = "medium", color }) => {
  const { theme } = useThemeStore();

  const sizeClasses = {
    small: "w-6 h-6 border-2",
    medium: "w-10 h-10 border-4",
    large: "w-16 h-16 border-4",
  };

  // automatically choose color from current theme
  const themeColor =
    color ||
    (theme === "dark"
      ? "var(--primary)" // uses your CSS variable
      : "var(--primary)");

  return (
    <div
      className={`rounded-full animate-spin ${sizeClasses[size]}`}
      style={{
        borderColor: themeColor,
        borderTopColor: "transparent",
      }}
      role="status"
    />
  );
};

export default Loader;
