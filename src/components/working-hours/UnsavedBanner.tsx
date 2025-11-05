"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useWorkingHoursStore } from "@/src/store/workingHours";

export default function UnsavedBanner() {
  const t = useTranslations("hours");
  const {
    hasUnsavedChanges,
    hasConflicts,
    message,
    messageType,
    saveChanges,
    discardChanges,
    clearMessage,
  } = useWorkingHoursStore();

  useEffect(() => {
    if (message && (messageType === "success" || messageType === "info")) {
      const timer = setTimeout(() => clearMessage(), 3000);
      return () => clearTimeout(timer);
    }
  }, [message, messageType, clearMessage]);

  const colorClass =
    messageType === "success"
      ? "bg-green-100 dark:bg-green-800 text-green-900 dark:text-green-50 border-green-500"
      : messageType === "error"
      ? "bg-red-100 dark:bg-red-800 text-red-900 dark:text-red-50 border-red-500"
      : "bg-yellow-100 dark:bg-yellow-700 text-yellow-900 dark:text-yellow-50 border-yellow-500";

  if (!hasUnsavedChanges && !message) return null;

  return (
    <div
      className={`mb-4 px-4 py-3 rounded-md border shadow-sm ${colorClass}
                  flex items-center justify-between transition-colors duration-300`}
    >
      <span>
        {message
          ? t(message)
          : hasConflicts
          ? t("conflict_warning")
          : t("unsaved_banner")}
      </span>

      <div className="flex gap-2">
        {hasUnsavedChanges && (
          <>
            <button
              onClick={async () => await saveChanges()}
              disabled={hasConflicts}
              className={`px-3 py-1 rounded-md text-white transition
                         ${
                           hasConflicts
                             ? "bg-gray-400 cursor-not-allowed"
                             : "bg-green-600 hover:bg-green-700"
                         }`}
            >
              {t("save_button")}
            </button>

            <button
              onClick={async () => await discardChanges()}
              className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              {t("discard_button")}
            </button>
          </>
        )}

        {message && (
          <button
            onClick={clearMessage}
            className="px-3 py-1 border rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          >
            {t("close")}
          </button>
        )}
      </div>
    </div>
  );
}
