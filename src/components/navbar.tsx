"use client";

import Link from "next/link";
import { useAuthStore } from "@/src/store/auth";
import { useThemeStore } from "@/src/store/theme";
import { useLocaleStore } from "@/src/store/locale";
import { useTranslations } from "next-intl";
import { Moon, Sun } from "lucide-react";

interface NavbarProps {
  alwaysLoginButton?: boolean;
}

export default function Navbar({ alwaysLoginButton = false }: NavbarProps) {
  const t = useTranslations("navbar");
  const { isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { locale, toggleLocale } = useLocaleStore();

  return (
    <nav
      className="flex items-center justify-between px-8 py-4 border-b transition-colors duration-300"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* ===== Left: Brand ===== */}
      <Link
        href="/"
        className="text-2xl font-extrabold tracking-tight transition-colors"
        style={{
          color: theme === "light" ? "#000000" : "var(--foreground)", // black in light mode
        }}
      >
        {t("navbaricon")}
      </Link>

      {/* ===== Right: Controls ===== */}
      <div className="flex items-center gap-4">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md border transition-all duration-200 hover:scale-105"
          style={{
            borderColor: "var(--border-color)",
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
          }}
          title={theme === "light" ? t("dark") : t("light")}
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Language toggle */}
        <button
          onClick={toggleLocale}
          className="p-2 rounded-md border transition-all duration-200 hover:scale-105 font-semibold"
          style={{
            borderColor: "var(--border-color)",
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
          }}
        >
          {locale === "en" ? "AR" : "EN"}
        </button>

        {/* Auth button */}
        {alwaysLoginButton ? (
          <Link
            href="/login"
            className="px-6 py-3 rounded-md font-bold text-lg transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor:
                theme === "light"
                  ? "#1e40af"
                  : "color-mix(in srgb, var(--primary) 80%, black 20%)",
              color: "#ffffff",
            }}
            onMouseEnter={(e) => {
              if (theme === "light")
                e.currentTarget.style.backgroundColor = "#2563eb";
            }}
            onMouseLeave={(e) => {
              if (theme === "light")
                e.currentTarget.style.backgroundColor = "#1e40af";
            }}
          >
            {t("login")}
          </Link>
        ) : isAuthenticated ? (
          <button
            onClick={logout}
            className="px-6 py-3 rounded-md font-bold text-lg transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: "red",
              color: "#fff",
            }}
          >
            {t("logout")}
          </button>
        ) : (
          <Link
            href="/login"
            className="px-6 py-3 rounded-md font-bold text-lg transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor:
                theme === "light"
                  ? "#1e40af"
                  : "color-mix(in srgb, var(--primary) 80%, black 20%)",
              color: "#ffffff",
            }}
            onMouseEnter={(e) => {
              if (theme === "light")
                e.currentTarget.style.backgroundColor = "#2563eb";
            }}
            onMouseLeave={(e) => {
              if (theme === "light")
                e.currentTarget.style.backgroundColor = "#1e40af";
            }}
          >
            {t("login")}
          </Link>
        )}
      </div>
    </nav>
  );
}
