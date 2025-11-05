"use client";

import { useEffect } from "react";
import { useLocaleStore } from "@/src/store/locale";

export function LocaleInitializer() {
  const { defaultLocale, setLocale } = useLocaleStore();

  useEffect(() => {
    const dir = defaultLocale === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("lang", defaultLocale);
    document.documentElement.setAttribute("dir", dir);
    setLocale(defaultLocale);
  }, [defaultLocale, setLocale]);

  return null;
}
