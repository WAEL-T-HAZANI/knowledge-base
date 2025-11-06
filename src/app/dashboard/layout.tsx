"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import SectionHeader from "@/src/components/ui/SectionHeader";
import { Moon, Sun } from "lucide-react";
import { useLocaleStore } from "@/src/store/locale";
import { useThemeStore } from "@/src/store/theme";
import { useDashboardStore } from "@/src/store/dashboard";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

//  Lazy-load Sidebar
const Sidebar = dynamic(() => import("@/src/components/sidebar"), {
  ssr: false,
});

// ✅ Lazy-load GuidedTour
const GuidedTour = dynamic(() => import("@/src/components/ui/GuidedTour"), {
  ssr: false,
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { dir, locale, toggleLocale } = useLocaleStore();
  const { theme, toggleTheme } = useThemeStore();
  const { activeTab, subTab, setActiveTab } = useDashboardStore();
  const pathname = usePathname();
  const t = useTranslations("dashboard");

  useEffect(() => {
    const match = pathname.match(/\/dashboard\/([^/]+)(?:\/([^/]+))?/);
    const tab = match?.[1] || "dashboard";
    const sub = match?.[2] || null;
    if (tab !== activeTab || sub !== subTab) setActiveTab(tab, sub);
  }, [pathname, activeTab, subTab, setActiveTab]);

  let titleKey = "title";
  let subtitleKey = "subtitle";

  if (activeTab && activeTab !== "dashboard") {
    if (subTab) {
      titleKey = `${subTab}_title`;
      subtitleKey = `${subTab}_subtitle`;
    } else {
      titleKey = `${activeTab}_title`;
      subtitleKey = `${activeTab}_subtitle`;
    }
  }

  let title = t.has?.(titleKey) ? t(titleKey) : t("title");
  let subtitle = t.has?.(subtitleKey) ? t(subtitleKey) : t("subtitle");

  const dividerColor =
    theme === "dark" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)";

  return (
    <div
      dir={dir}
      data-theme={theme}
      className="flex min-h-screen transition-colors duration-300 relative"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      {/* === Sidebar Section === */}
      <Sidebar className="sidebar min-h-screen flex-shrink-0" />

      {/* === Main Content === */}
      <main
        className="dashboard-main flex-1 flex flex-col p-8 overflow-y-auto"
        style={{
          borderLeft: dir === "ltr" ? `1px solid ${dividerColor}` : "none",
          borderRight: dir === "rtl" ? `1px solid ${dividerColor}` : "none",
        }}
      >
        {/* === Header Section === */}
        <SectionHeader
          title={title}
          subtitle={subtitle}
          rightSlot={
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="theme-toggle px-3 py-1 border rounded-md transition-all"
                style={{
                  borderColor: "var(--borderColor)",
                  color: "var(--foreground)",
                }}
                title={theme === "light" ? t("dark_label") : t("light_label")}
              >
                {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              {/* Language Toggle */}
              <button
                onClick={toggleLocale}
                className="language-toggle px-3 py-1 border rounded-md transition-all"
                style={{
                  borderColor: "var(--borderColor)",
                  color: "var(--foreground)",
                }}
              >
                {locale === "en" ? "AR" : "EN"}
              </button>
            </div>
          }
        />

        <hr
          className="mb-8 border-t"
          style={{ borderColor: "var(--borderColor)" }}
        />

        {/* === Page Content === */}
        <div className="flex-1">{children}</div>
      </main>

      {/*  Client-only Guided Tour */}
      <GuidedTour />
    </div>
  );
}
