"use server";

/**
 * Loads translation messages dynamically from /src/locales.
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
