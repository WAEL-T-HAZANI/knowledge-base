"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { create } from "zustand";

import { useThemeStore } from "@/src/store/theme";
import { useLocaleStore } from "@/src/store/locale";
import { useArticleStore } from "@/src/store/articles";
import { useAuthStore } from "@/src/store/auth";

//  Lazy load charts
const DonutChart = dynamic(
  () => import("@/src/components/charts/ArticlesDonut"),
  {
    ssr: false,
  }
);
const AreaChart = dynamic(() => import("@/src/components/charts/ViewsArea"), {
  ssr: false,
});

// Local Zustand store for date range
interface StatsState {
  startDate: Date;
  endDate: Date;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
}

const useStatsStore = create<StatsState>((set) => ({
  startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
  endDate: new Date(),
  setStartDate: (date) => set({ startDate: date }),
  setEndDate: (date) => set({ endDate: date }),
}));

//  Translations
import en from "@/src/locales/en.json";
import ar from "@/src/locales/ar.json";

export default function StatsPage() {
  const { theme } = useThemeStore();
  const { locale, dir } = useLocaleStore();
  const { articles } = useArticleStore();
  const { users } = useAuthStore();
  const { startDate, endDate, setStartDate, setEndDate } = useStatsStore();

  const t = locale === "ar" ? ar : en;

  // Filter articles by date range
  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const articleDate = new Date(a.date);
      return articleDate >= startDate && articleDate <= endDate;
    });
  }, [articles, startDate, endDate]);

  //  Articles per Category (using filtered ones)
  const articlesByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredArticles.forEach((a) => {
      const cat = a.category || "general";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return {
      categories: Object.keys(counts),
      values: Object.values(counts),
    };
  }, [filteredArticles]);

  //  Mock Views per Day (same as before)
  const mockViews = useMemo(() => {
    const days =
      Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;

    const labels = Array.from({ length: days }, (_, i) => {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      return d.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
        weekday: "short",
      });
    });

    const uCount = users.length || 1;
    const values = labels.map((_, i) =>
      Math.max(0, Math.floor(uCount * (1 + Math.sin(i) * 0.4)))
    );

    return { labels, values };
  }, [users, startDate, endDate, locale]);

  return (
    <div
      dir={dir}
      className="min-h-screen p-6 space-y-8 bg-[var(--background)] text-[var(--foreground)] transition-colors"
    >
      {/* Date Range Filter */}
      <div
        className={`flex flex-wrap gap-4 items-end ${
          dir === "rtl" ? "justify-end" : ""
        }`}
      >
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">
            {t.stats.start_date}
          </label>
          <DatePicker
            selected={startDate}
            onChange={(date) => date && setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="border rounded-lg px-3 py-2 bg-[var(--inputBg)] text-[var(--inputText)] border-[var(--borderColor)]"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">{t.stats.end_date}</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => date && setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className="border rounded-lg px-3 py-2 bg-[var(--inputBg)] text-[var(--inputText)] border-[var(--borderColor)]"
          />
        </div>
      </div>

      {/*  Charts Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 🥧 Articles per Category */}
        {filteredArticles.length === 0 ? (
          <div className="p-4 rounded-2xl shadow border border-[var(--borderColor)] text-center text-sm text-[var(--secondary)]">
            {t.stats.no_articles}
          </div>
        ) : (
          <DonutChart
            title={t.stats.articles_per_category}
            labels={
              articlesByCategory.categories.length > 0
                ? articlesByCategory.categories.map(
                    (cat) => t.articles?.[cat.toLowerCase()] || cat
                  )
                : [t.stats.no_articles]
            }
            series={
              articlesByCategory.values.length ? articlesByCategory.values : [0]
            }
            theme={theme}
          />
        )}

        {/*  Mock Views per Day */}
        {users.length === 0 ? (
          <div className="p-4 rounded-2xl shadow border border-[var(--borderColor)] text-center text-sm text-[var(--secondary)]">
            {t.stats.no_users}
          </div>
        ) : (
          <AreaChart
            title={t.stats.views_per_day}
            series={[
              {
                name: locale === "ar" ? "المشاهدات" : "Views",
                data: mockViews.values,
              },
            ]}
            categories={mockViews.labels}
            theme={theme}
          />
        )}
      </div>
    </div>
  );
}
