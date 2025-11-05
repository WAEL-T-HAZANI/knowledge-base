"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LocaleState {
  locale: "en" | "ar";
  dir: "ltr" | "rtl";
  defaultLocale: "en" | "ar";
  toggleLocale: () => void;
  setLocale: (locale: "en" | "ar") => void;
  setDefaultLocale: (locale: "en" | "ar") => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set, get) => ({
      locale: "en",
      dir: "ltr",
      defaultLocale: "en",

      toggleLocale: () => {
        const newLocale = get().locale === "en" ? "ar" : "en";
        const newDir = newLocale === "ar" ? "rtl" : "ltr";

        document.documentElement.setAttribute("lang", newLocale);
        document.documentElement.setAttribute("dir", newDir);
        set({ locale: newLocale, dir: newDir });
      },

      setLocale: (locale) => {
        const dir = locale === "ar" ? "rtl" : "ltr";
        document.documentElement.setAttribute("lang", locale);
        document.documentElement.setAttribute("dir", dir);
        set({ locale, dir });
      },

      setDefaultLocale: (locale) => {
        const dir = locale === "ar" ? "rtl" : "ltr";
        document.documentElement.setAttribute("lang", locale);
        document.documentElement.setAttribute("dir", dir);
        set({ defaultLocale: locale, locale, dir });
      },
    }),
    { name: "locale-storage" }
  )
);
