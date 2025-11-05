"use client";

import {
  Home,
  User,
  ChevronLeft,
  ChevronRight,
  LogOut,
  FileText,
  BarChart2,
  Clock,
  Settings,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/src/store/auth";
import { useLocaleStore } from "@/src/store/locale";
import { useSidebarStore } from "@/src/store/sidebar";
import { useDashboardStore } from "@/src/store/dashboard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const t = useTranslations("sidebar");
  const { user, logout } = useAuthStore();
  const { dir, locale } = useLocaleStore();
  const { collapsed, toggleCollapsed } = useSidebarStore();
  const { setActiveTab } = useDashboardStore();
  const router = useRouter();

  const [hydrated, setHydrated] = useState(false);
  const [activeChevron, setActiveChevron] = useState(false);
  const isRTL = dir === "rtl";

  useEffect(() => setHydrated(true), []);

  const tabs = [
    { id: "articles", label: t("articles"), icon: FileText },
    { id: "stats", label: t("stats"), icon: BarChart2 },
    { id: "hours", label: t("hours"), icon: Clock },
    { id: "settings", label: t("settings"), icon: Settings },
  ];

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    router.push(`/dashboard/${id}`);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  useEffect(() => {
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.lang = locale;
  }, [locale, dir]);

  const handleToggle = () => {
    setActiveChevron(true);
    toggleCollapsed();
    setTimeout(() => setActiveChevron(false), 300);
  };

  return (
    <aside
      className={`min-h-screen flex flex-col justify-between transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      } overflow-hidden`}
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
        borderColor: "var(--borderColor)",
        borderRight: !isRTL ? "1px solid var(--borderColor)" : "none",
        borderLeft: isRTL ? "1px solid var(--borderColor)" : "none",
        boxShadow: isRTL
          ? "-1px 0 0 var(--borderColor)"
          : "1px 0 0 var(--borderColor)",
      }}
    >
      {/* === Top Section === */}
      <div className="flex flex-col items-center relative pt-6 flex-1">
        {/* --- Collapsed Header --- */}
        {collapsed ? (
          <div className="flex flex-col items-center gap-4 mb-4">
            {/* Chevron first */}
            <button
              onClick={handleToggle}
              className="p-1 rounded-md transition"
              style={{
                color: activeChevron ? "var(--primary)" : "var(--foreground)",
                backgroundColor: "transparent",
              }}
            >
              {isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>

            {/* Home below */}
            <button
              onClick={() => router.push("/dashboard")}
              className="p-1 rounded-md transition"
              style={{
                color: "var(--foreground)",
                backgroundColor: "transparent",
              }}
              title="Dashboard Home"
            >
              <Home size={22} />
            </button>
          </div>
        ) : (
          /* --- Expanded Header --- */
          <div className="sidebar-header flex w-full justify-between items-center mb-6 px-3">
            {/* Chevron */}
            <button
              onClick={handleToggle}
              className="p-1 rounded-md transition"
              style={{
                color: activeChevron ? "var(--primary)" : "var(--foreground)",
                backgroundColor: "transparent",
              }}
            >
              {isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>

            {/* Home */}
            <button
              onClick={() => router.push("/dashboard")}
              className="p-1 rounded-md transition"
              style={{
                color: "var(--foreground)",
                backgroundColor: "transparent",
              }}
              title="Dashboard Home"
            >
              <Home size={22} />
            </button>
          </div>
        )}

        {/* === Avatar === */}
        <div
          className="rounded-full p-[3px] border"
          style={{ borderColor: "var(--borderColor)" }}
        >
          {hydrated && user?.avatar ? (
            <img
              src={user.avatar}
              alt="User avatar"
              className={`object-cover rounded-full ${
                collapsed ? "w-10 h-10" : "w-16 h-16"
              }`}
            />
          ) : (
            <User
              size={collapsed ? 28 : 40}
              style={{ color: "var(--foreground)" }}
            />
          )}
        </div>

        {!collapsed && (
          <p className="font-semibold text-lg mt-2 text-center truncate w-40">
            {hydrated ? user?.name || t("username") : ""}
          </p>
        )}

        <hr
          className="w-full mt-4 mb-4"
          style={{ borderColor: "var(--borderColor)" }}
        />

        {/* === Tabs === */}
        <nav
          className={`flex flex-col gap-2 w-full transition-all ${
            collapsed ? "items-center" : ""
          }`}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`sidebar-tab flex items-center ${
                  collapsed ? "justify-center" : "justify-start px-3"
                } py-2.5 rounded-md transition-all w-full gap-3`}
                style={{
                  backgroundColor: "transparent",
                  color: "var(--foreground)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--primary)";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "var(--foreground)";
                }}
              >
                <Icon size={18} />
                {!collapsed && <span className="ml-2">{tab.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* === Logout === */}
      <div
        className="p-4 flex items-center justify-center border-t"
        style={{ borderColor: "var(--borderColor)" }}
      >
        <button
          onClick={handleLogout}
          className={`w-full flex items-center justify-center gap-2 rounded-md py-2 transition-all ${
            collapsed ? "justify-center" : ""
          }`}
          style={{
            backgroundColor: "#e53935",
            color: "#fff",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#d32f2f")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#e53935")
          }
        >
          <LogOut size={18} />
          {!collapsed && <span>{t("logout")}</span>}
        </button>
      </div>
    </aside>
  );
}
