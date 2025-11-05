"use client";

import React from "react";
import { useThemeStore } from "@/src/store/theme";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
}

export default function SectionHeader({
  title,
  subtitle,
  rightSlot,
}: SectionHeaderProps) {
  const { theme } = useThemeStore();
  const secondary = theme === "dark" ? "#cbd5e1" : "#6b7280";

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">{title}</h2>
        {subtitle && (
          <p className="text-sm" style={{ color: secondary }}>
            {subtitle}
          </p>
        )}
      </div>
      {rightSlot}
    </div>
  );
}
