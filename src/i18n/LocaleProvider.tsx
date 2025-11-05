"use client";

import { ReactNode, useEffect, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { useLocaleStore } from "@/src/store/locale";

interface LocaleProviderProps {
  locale: string;
  messages: Record<string, any>;
  children: ReactNode;
}

export function LocaleProvider({
  locale: initialLocale,
  messages: initialMessages,
  children,
}: LocaleProviderProps) {
  const { locale, dir, setLocale } = useLocaleStore();
  const [messages, setMessages] = useState(initialMessages);

  // Load messages when locale changes
  useEffect(() => {
    async function loadMessages() {
      const msgs = (await import(`@/src/locales/${locale}.json`)).default;
      setMessages(msgs);
      document.documentElement.lang = locale;
      document.documentElement.dir = dir;
    }
    loadMessages();
  }, [locale, dir]);

  // Sync Zustand locale with initialLocale on first load
  useEffect(() => {
    if (locale !== initialLocale) setLocale(initialLocale as "en" | "ar");
  }, []);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
