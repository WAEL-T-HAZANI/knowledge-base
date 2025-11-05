"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocaleStore } from "@/src/store/locale";
import { useSidebarStore } from "@/src/store/sidebar";
import { motion } from "framer-motion";

export default function DashboardHome() {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const { dir } = useLocaleStore();
  const { expandSidebar } = useSidebarStore();

  const pages = [
    { id: "articles", label: t("articles"), color: "#2563eb" },
    { id: "stats", label: t("stats"), color: "#16a34a" },
    { id: "hours", label: t("hours"), color: "#9333ea" },
    { id: "settings", label: t("settings"), color: "#475569" },
  ];

  const handleClick = (id: string) => {
    expandSidebar();
    router.push(`/dashboard/${id}`);
  };

  return (
    <div
      dir={dir}
      className="min-h-screen flex flex-col items-center justify-start pt-10 transition-colors duration-300"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold mb-4 text-center"
      >
        {t("welcome")}
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl w-full px-6 translate-y-[10px]" // 👈 moved down by 10px
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {pages.map((p) => (
          <button
            key={p.id}
            onClick={() => handleClick(p.id)}
            className="py-14 rounded-2xl font-semibold shadow-lg transition-transform hover:scale-105"
            style={{
              backgroundColor: p.color,
              color: "#fff",
            }}
          >
            {p.label}
          </button>
        ))}
      </motion.div>
    </div>
  );
}
