"use server";

/**
 * Loads translation messages dynamically from /src/locales.
 * This file runs on the server — no JSX or "use client" here.
 */
export async function getMessages(locale: string) {
  try {
    const messages = (await import(`../locales/${locale}.json`)).default;
    return messages;
  } catch (error) {
    console.error(`❌ Could not load messages for locale: ${locale}`, error);
    return {};
  }
}
