"use client";

import { useThemeStore } from "@/src/store/theme";

interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  const { theme } = useThemeStore();
  const color = theme === "dark" ? "#cbd5e1" : "#6b7280";

  return (
    <div
      className="flex flex-col items-center justify-center py-16 text-center"
      style={{ color }}
    >
      <p className="text-base font-medium">{message}</p>
    </div>
  );
}
