// ❌ NO "use client" here — this file must stay a Server Component
import "./globals.css";
import type { Metadata, LayoutProps } from "next";
import { getMessages } from "@/src/i18n";
import { LocaleProvider } from "@/src/i18n/LocaleProvider";
import { ThemeInitializer } from "@/src/store/themeInitializer";
import { LocaleInitializer } from "@/src/store/localeInitializer";
import { Toaster } from "sonner";
import LayoutClientWrapper from "@/src/components/LayoutClientWrapper";

/* ---------------------------------------------
   ✅ PWA + SEO Metadata
---------------------------------------------- */
export const metadata: Metadata = {
  title: "Knowledge Base Dashboard",
  description:
    "Bilingual Dashboard built with Next.js, Tailwind CSS, Zustand, and next-intl",
  manifest: "/manifest.json",
  themeColor: "#2563eb",
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
  appleWebApp: {
    capable: true,
    title: "Knowledge Base Dashboard",
    statusBarStyle: "default",
  },
  applicationName: "Knowledge Base Dashboard",
  formatDetection: { telephone: false },
};

/* ---------------------------------------------
   ✅ RootLayout
---------------------------------------------- */
export default async function RootLayout({ children, params }: LayoutProps) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale ?? "en";
  const messages = await getMessages(locale);

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body>
        <ThemeInitializer />
        <LocaleInitializer />

        <LocaleProvider locale={locale} messages={messages}>
          <LayoutClientWrapper>{children}</LayoutClientWrapper>
        </LocaleProvider>

        <Toaster
          richColors
          position="top-right"
          toastOptions={{
            style: {
              width: "auto",
              maxWidth: "fit-content",
              whiteSpace: "nowrap",
              padding: "0.75rem 1rem",
              fontSize: "0.95rem",
              fontWeight: 500,
            },
          }}
        />

        <noscript>You need to enable JavaScript to run this app.</noscript>
      </body>
    </html>
  );
}
