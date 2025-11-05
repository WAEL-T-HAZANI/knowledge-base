"use client";

import dynamic from "next/dynamic";
import React from "react";
import { useThemeStore } from "@/src/store/theme";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface DonutChartProps {
  title?: string;
  labels: string[];
  series: number[];
  theme?: "light" | "dark";
  height?: number;
}

export default function ArticlesDonut({
  title,
  labels,
  series,
  theme,
  height = 350,
}: DonutChartProps) {
  const { theme: activeTheme } = useThemeStore();
  const mode = theme || activeTheme;

  const options = {
    chart: {
      type: "donut" as const,
      background: "transparent",
    },
    labels,
    theme: { mode },
    legend: { position: "bottom" },
    dataLabels: {
      style: { fontSize: "14px" },
    },
    stroke: { show: true, width: 2 },
    colors:
      mode === "dark"
        ? ["#60a5fa", "#f87171", "#34d399", "#facc15", "#a78bfa"]
        : ["#2563eb", "#dc2626", "#059669", "#ca8a04", "#7c3aed"],
  };

  return (
    <div className="p-4 rounded-2xl border border-[var(--borderColor)] bg-[var(--background)] shadow-sm transition-all">
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)] text-center">
          {title}
        </h3>
      )}
      <Chart options={options} series={series} type="donut" height={height} />
    </div>
  );
}
