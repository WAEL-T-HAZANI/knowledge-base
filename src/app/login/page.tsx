"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/src/store/auth";
import { useThemeStore } from "@/src/store/theme";
import { useLocaleStore } from "@/src/store/locale";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft, ArrowRight } from "lucide-react";

// ✅ Lazy-load reusable components
const SectionHeader = dynamic(
  () => import("@/src/components/ui/SectionHeader"),
  {
    ssr: false,
    loading: () => <div>Loading...</div>,
  }
);

const Button = dynamic(() => import("@/src/components/ui/Button"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

const Card = dynamic(() => import("@/src/components/ui/Card"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export default function LoginPage() {
  const t = useTranslations("login");
  const router = useRouter();
  const { login, isAuthenticated, checkSession } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { locale, dir, toggleLocale } = useLocaleStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [mounted, setMounted] = useState(false); // ✅ added rehydration guard

  const toastPosition = dir === "rtl" ? "top-left" : "top-right";

  useEffect(() => {
    checkSession();
    setMounted(true);
  }, [checkSession]);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted) return null; // ✅ prevents login flash before redirect

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { email?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/;

    // ✅ Validate both fields independently
    if (!email.trim() || !emailRegex.test(email)) {
      newErrors.email = t("invalid_email");
    }
    if (!password.trim() || !passwordRegex.test(password)) {
      newErrors.password = t("invalid_password");
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    try {
      const success = await login(email.trim(), password.trim());
      if (success) {
        toast.success(t("success"), { position: toastPosition });
        router.replace("/dashboard");
      } else {
        toast.error(t("error"), { position: toastPosition });
        setErrors({ password: t("invalid_password") });
      }
    } catch {
      toast.error(t("error"), { position: toastPosition });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center transition-colors duration-300"
      dir={dir}
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <Card
        className="w-full max-w-sm rounded-lg shadow-md p-8 flex flex-col gap-4 border transition-all duration-300"
        style={{
          backgroundColor: "var(--background)",
          borderColor: "var(--border-color)",
        }}
      >
        {/* ✅ Header */}
        <SectionHeader
          title={t("title")}
          rightSlot={
            locale === "ar" ? (
              <ArrowRight
                size={24}
                onClick={() => router.push("/")}
                className="cursor-pointer transition"
                style={{ color: "var(--foreground)" }}
              />
            ) : (
              <ArrowLeft
                size={24}
                onClick={() => router.push("/")}
                className="cursor-pointer transition"
                style={{ color: "var(--foreground)" }}
              />
            )
          }
        />

        {/* ✅ Email */}
        <div>
          <input
            type="email"
            placeholder={t("email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded-md border focus:outline-none focus:ring-2 transition"
            style={{
              backgroundColor: "var(--input-bg)",
              color: "var(--input-text)",
              borderColor: "var(--border-color)",
              caretColor: "var(--primary)",
            }}
            autoComplete="off"
          />
          {/* Reserve space for error to avoid shifting */}
          <div className="h-5 mt-1">
            {errors.email && (
              <p className="text-red-600 text-sm">{errors.email}</p>
            )}
          </div>
        </div>

        {/* ✅ Password (eye icon alignment fixed) */}
        <div className="relative w-full mb-1">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t("password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full h-11 rounded-md border focus:outline-none focus:ring-2 transition ${
                dir === "rtl" ? "pl-10 pr-3 text-right" : "pr-10 pl-3 text-left"
              }`}
              style={{
                backgroundColor: "var(--input-bg)",
                color: "var(--input-text)",
                borderColor: "var(--border-color)",
                caretColor: "var(--primary)",
                lineHeight: "2.75rem",
              }}
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 -translate-y-1/2"
              style={{
                [dir === "rtl" ? "left" : "right"]: "0.75rem",
                color: "var(--muted-foreground)",
              }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Reserve space for error so layout is stable */}
          <div className="h-5 mt-1">
            {errors.password && (
              <p className="text-red-600 text-sm text-start" dir={dir}>
                {errors.password}
              </p>
            )}
          </div>
        </div>

        {/* ✅ Submit */}
        <Button
          type="submit"
          disabled={submitting}
          variant="primary"
          className="mt-2 w-full font-bold py-2 rounded-md transition-all duration-300 hover:scale-105"
          style={{
            backgroundColor: "var(--primary)",
            color: "#ffffff",
            opacity: submitting ? 0.7 : 1,
          }}
          onClick={handleSubmit}
        >
          {submitting ? t("loading") : t("submit")}
        </Button>

        {/* ✅ Toggles */}
        <div className="flex justify-between mt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={toggleTheme}
            className="text-sm px-3 py-1 rounded-md border transition-all duration-200"
            style={{
              borderColor: "var(--border-color)",
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
            {theme === "light" ? t("dark") : t("light")}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={toggleLocale}
            className="text-sm px-3 py-1 rounded-md border transition-all duration-200"
            style={{
              borderColor: "var(--border-color)",
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
            {t("lang")}: {locale.toUpperCase()}
          </Button>
        </div>
      </Card>
    </div>
  );
}
