"use client";

import dynamic from "next/dynamic";
import React from "react";
import { useThemeStore } from "@/src/store/theme";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface AreaChartProps {
  title?: string;
  series: { name: string; data: number[] }[];
  categories: string[];
  theme?: "light" | "dark";
  height?: number;
}

export default function ViewsArea({
  title,
  series,
  categories,
  theme,
  height = 350,
}: AreaChartProps) {
  const { theme: activeTheme } = useThemeStore();
  const mode = theme || activeTheme;

  const options = {
    chart: { type: "area" as const, background: "transparent" },
    xaxis: { categories },
    theme: { mode },
    stroke: { curve: "smooth", width: 3 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0.4,
        opacityFrom: 0.7,
        opacityTo: 0.3,
      },
    },
    grid: { borderColor: "rgba(200,200,200,0.1)" },
    dataLabels: { enabled: false },
    colors:
      mode === "dark"
        ? ["#60a5fa", "#34d399", "#facc15"]
        : ["#2563eb", "#059669", "#ca8a04"],
  };

  return (
    <div className="p-4 rounded-2xl border border-[var(--borderColor)] bg-[var(--background)] shadow-sm transition-all">
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)] text-center">
          {title}
        </h3>
      )}
      <Chart options={options} series={series} type="area" height={height} />
    </div>
  );
}
