"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useThemeStore } from "@/src/store/theme";

// ✅ Lazy-load components
const Navbar = dynamic(() => import("@/src/components/navbar"), {
  ssr: false,
  loading: () => <div className="p-4 text-center">Loading Navbar...</div>,
});

const Loader = dynamic(() => import("@/src/components/ui/Loader"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

const Button = dynamic(() => import("@/src/components/ui/Button"), {
  ssr: false,
  loading: () => <Loader />,
});

const Card = dynamic(() => import("@/src/components/ui/Card"), {
  ssr: false,
  loading: () => <Loader />,
});

const SectionHeader = dynamic(
  () => import("@/src/components/ui/SectionHeader"),
  {
    ssr: false,
    loading: () => <Loader />,
  }
);

interface LandingProps {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

/**
 * ✅ LandingPage
 * - Fully localized & themable
 * - Lazy loads Navbar and animations
 * - Reusable with props for flexible reuse
 * - Now uses reusable UI components
 */
export default function LandingPage({
  title,
  subtitle,
  ctaLabel,
  ctaHref = "/login",
}: LandingProps) {
  const t = useTranslations("landing");
  const { theme } = useThemeStore();

  // Fall back to translations if props not provided
  const pageTitle = title || t("title");
  const pageSubtitle = subtitle || t("subtitle");
  const pageCTA = ctaLabel || t("cta");

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden transition-colors duration-300"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      {/* ✅ Gradient background based on theme */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50 transition-colors duration-300"
        style={{
          background: `linear-gradient(to bottom right, var(--background), var(--primary))`,
        }}
      />

      {/* ✅ Navbar (lazy-loaded) */}
      <Suspense fallback={<Loader text="Loading Navbar..." />}>
        <Navbar alwaysLoginButton />
      </Suspense>

      {/* ✅ Hero Section */}
      <main className="flex flex-col items-center justify-center flex-1 text-center px-6 relative z-10">
        <Card className="bg-transparent border-none shadow-none p-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <SectionHeader title={pageTitle} subtitle={pageSubtitle} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Link href={ctaHref}>
              <Button
                variant="primary"
                className="inline-block rounded-md text-lg font-medium px-6 py-3 transition-transform duration-200 hover:scale-105 hover:shadow-lg"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "#ffffff",
                }}
              >
                {pageCTA}
              </Button>
            </Link>
          </motion.div>
        </Card>
      </main>

      {/* ✅ Footer */}
      <footer
        className="py-5 text-center text-sm font-medium relative z-10 border-t"
        style={{
          color: "var(--secondary)",
          borderColor: "var(--border-color)",
        }}
      >
        © <span className="font-semibold">{new Date().getFullYear()}</span>{" "}
        <span className="font-bold" style={{ color: "var(--foreground)" }}>
          Knowledge Base Dashboard
        </span>
      </footer>
    </div>
  );
}
