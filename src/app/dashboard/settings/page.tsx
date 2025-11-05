"use client";

import { useTranslations } from "next-intl";
import { useAuthStore } from "@/src/store/auth";
import { useThemeStore } from "@/src/store/theme";
import { useLocaleStore } from "@/src/store/locale";
import { useDashboardStore } from "@/src/store/dashboard";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const ts = useTranslations("settings");
  const ta = useTranslations("auth");
  const { user, updateProfile } = useAuthStore();
  const { defaultTheme, setDefaultTheme } = useThemeStore();
  const { defaultLocale, setDefaultLocale, dir } = useLocaleStore();
  const { setActiveTab } = useDashboardStore();
  const toastPosition = dir === "rtl" ? "top-left" : "top-right";

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState(user?.password || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => setActiveTab("settings"), [setActiveTab]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPassword(user.password);
      setAvatar(user.avatar || "");
    }
  }, [user]);

  const handleSaveProfile = () => {
    const result = updateProfile({ name, email, password, avatar });
    const messageKey = result.message.replace(/^auth\./, "");
    result.success
      ? toast.success(ta(messageKey), { position: toastPosition })
      : toast.error(ta(messageKey), { position: toastPosition });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setAvatar(base64);
      useAuthStore.getState().updateProfile({ avatar: base64 });
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success(ta("profile_updated"), { position: toastPosition });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatar("");
    useAuthStore.getState().updateProfile({ avatar: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.success(ta("profile_picture_removed"), { position: toastPosition });
  };

  // ✅ Auto-save when theme or language changes
  const handleThemeChange = (theme: "light" | "dark") => {
    try {
      setDefaultTheme(theme);
      toast.success(ts("save_preferences_success"), {
        position: toastPosition,
      });
    } catch {
      toast.error(ts("save_error"), { position: toastPosition });
    }
  };

  const handleLangChange = (lang: "en" | "ar") => {
    try {
      setDefaultLocale(lang);
      toast.success(ts("save_preferences_success"), {
        position: toastPosition,
      });
    } catch {
      toast.error(ts("save_error"), { position: toastPosition });
    }
  };

  return (
    <div className="p-6 transition-colors duration-300">
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start w-full max-w-6xl mx-auto"
        style={{ alignItems: "stretch" }}
      >
        {/* ===== User Profile ===== */}
        <section className="flex flex-col justify-between border border-[var(--border-color)] rounded-xl p-6 bg-[var(--background)] shadow-sm h-full">
          <h2 className="text-2xl font-semibold mb-4">{ts("profile_title")}</h2>

          <div className="flex-1 space-y-4">
            {/* Avatar Upload */}
            <div>
              <label className="block mb-1 font-medium">
                {ts("avatar_label")}
              </label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer bg-blue-600 text-white text-sm px-3 py-1 rounded-md hover:bg-blue-700 transition">
                  Choose File
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>

                {avatar && (
                  <button
                    onClick={handleRemoveAvatar}
                    className="bg-red-600 text-white text-sm px-3 py-1 rounded-md hover:bg-red-700 transition"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block mb-1 font-medium">
                {ts("name_label")}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-md p-2 bg-[var(--background)] text-[var(--foreground)] border-[var(--border-color)]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 font-medium">
                {ts("email_label")}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-md p-2 bg-[var(--background)] text-[var(--foreground)] border-[var(--border-color)]"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1 font-medium">
                {ts("password_label")}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-md p-2 bg-[var(--background)] text-[var(--foreground)] border-[var(--border-color)]"
              />
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            {ts("update_button")}
          </button>
        </section>

        {/* ===== Preferences ===== */}
        <section className="flex flex-col justify-between border border-[var(--border-color)] rounded-xl p-6 bg-[var(--background)] shadow-sm h-full">
          <h3 className="text-xl font-semibold mb-4">
            {ts("preferences_title")}
          </h3>

          <div className="flex-1 space-y-6">
            <div>
              <label className="block mb-2 font-medium">
                {ts("theme_label")}
              </label>
              <select
                value={defaultTheme}
                onChange={(e) =>
                  handleThemeChange(e.target.value as "light" | "dark")
                }
                className="w-full border rounded-md p-2 bg-[var(--background)] text-[var(--foreground)] border-[var(--border-color)]"
              >
                <option value="light">{ts("light_label")}</option>
                <option value="dark">{ts("dark_label")}</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium">
                {ts("lang_label")}
              </label>
              <select
                value={defaultLocale}
                onChange={(e) =>
                  handleLangChange(e.target.value as "en" | "ar")
                }
                className="w-full border rounded-md p-2 bg-[var(--background)] text-[var(--foreground)] border-[var(--border-color)]"
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </div>
          </div>

          {/* ✅ Save button kept for design balance, optional now */}
          <button
            disabled
            className="mt-6 bg-green-600/50 text-white px-4 py-2 rounded-md cursor-not-allowed"
          >
            {ts("save_button")}
          </button>
        </section>
      </div>
    </div>
  );
}
