"use client";

import { Plus, Trash2, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { useWorkingHoursStore } from "@/src/store/workingHours";
import { useLocaleStore } from "@/src/store/locale";
import { toast } from "sonner";

interface Props {
  day: string;
  ranges: { id: string; start: string; end: string }[];
}

export default function DayRow({ day, ranges }: Props) {
  const t = useTranslations("hours");
  const { dir } = useLocaleStore();
  const { addRange, deleteRange, copyRange, updateRange, week } =
    useWorkingHoursStore();

  const isRTL = dir === "rtl";

  const handleTimeChange = (
    rangeId: string,
    field: "start" | "end",
    value: string
  ) => {
    const currentDay = week.find((d) => d.day === day);
    if (!currentDay) return;

    const range = currentDay.ranges.find((r) => r.id === rangeId);
    if (!range) return;

    const updatedRange = { ...range, [field]: value };

    if (
      updatedRange.start &&
      updatedRange.end &&
      updatedRange.end <= updatedRange.start
    ) {
      toast.error(t("invalid_time_range"));
      return;
    }

    updateRange(day, rangeId, field, value);
  };

  const handleAddRange = () => {
    const currentDay = week.find((d) => d.day === day);
    if (!currentDay) return;

    const existingRanges = currentDay.ranges;
    if (existingRanges.length > 0) {
      const lastRange = existingRanges[existingRanges.length - 1];
      if (!lastRange.end) {
        toast.error(t("fill_previous_range_first"));
        return;
      }

      if (lastRange.end >= "23:59") {
        toast.error(t("no_more_after_midnight"));
        return;
      }
    }

    addRange(day);
  };

  return (
    <div
      className="flex flex-col rounded-xl shadow-sm border transition-colors duration-300
                 border-[var(--border-color)] bg-[var(--cardBg)] text-[var(--foreground)]"
      dir={dir}
    >
      <div
        className="flex justify-between items-center mb-3 p-4 pb-0"
        style={{
          flexDirection: isRTL ? "row-reverse" : "row",
        }}
      >
        <h4 className="font-semibold text-lg">
          {t(`days.${day.toLowerCase()}`)}
        </h4>

        <button
          onClick={handleAddRange}
          className="flex items-center gap-1 px-3 py-1 rounded-md border border-[var(--primary)]
                     text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition"
        >
          <Plus size={16} />
          {t("add_range")}
        </button>
      </div>

      <div className="space-y-3 p-4 pt-2">
        {ranges.length === 0 ? (
          <p className="text-sm text-center text-[var(--secondary)] py-3">
            {t("noRanges")}
          </p>
        ) : (
          ranges.map((r, i) => {
            const isConflict = ranges.some(
              (r2, j) => i !== j && r.start < r2.end && r2.start < r.end
            );

            return (
              <div
                key={r.id}
                className={`flex flex-col md:flex-row items-center justify-between gap-3 p-3 rounded-lg border transition-colors
                  ${
                    isConflict
                      ? "border-red-500 bg-[var(--conflictBg)] dark:bg-[var(--conflictBgDark)]"
                      : "border-gray-300 dark:border-gray-600 bg-[var(--innerCardBg)]"
                  }`}
              >
                {isRTL ? (
                  <div className="flex items-center justify-center gap-3 w-full">
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--secondary)" }}
                    >
                      {t("from")}
                    </span>
                    <input
                      type="time"
                      value={r.start}
                      onChange={(e) =>
                        handleTimeChange(r.id, "start", e.target.value)
                      }
                      className="p-2 rounded-md border border-[var(--border-color)]
                                 bg-[var(--inputBg)] text-[var(--foreground)]
                                 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
                    />

                    <div className="flex items-center gap-1 text-[var(--primary)] font-semibold text-sm">
                      <span style={{ fontSize: "1.1rem" }}>←</span>
                      <span>{t("to")}</span>
                    </div>

                    <input
                      type="time"
                      value={r.end}
                      onChange={(e) =>
                        handleTimeChange(r.id, "end", e.target.value)
                      }
                      className="p-2 rounded-md border border-[var(--border-color)]
                                 bg-[var(--inputBg)] text-[var(--foreground)]
                                 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3 w-full">
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--secondary)" }}
                    >
                      {t("from")}
                    </span>

                    <input
                      type="time"
                      value={r.start}
                      onChange={(e) =>
                        handleTimeChange(r.id, "start", e.target.value)
                      }
                      className="p-2 rounded-md border border-[var(--border-color)]
                                 bg-[var(--inputBg)] text-[var(--foreground)]
                                 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
                    />

                    <div className="flex items-center gap-1 text-[var(--primary)] font-semibold text-sm">
                      <span style={{ fontSize: "1.1rem" }}>→</span>
                      <span>{t("to")}</span>
                    </div>

                    <input
                      type="time"
                      value={r.end}
                      onChange={(e) =>
                        handleTimeChange(r.id, "end", e.target.value)
                      }
                      className="p-2 rounded-md border border-[var(--border-color)]
                                 bg-[var(--inputBg)] text-[var(--foreground)]
                                 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyRange(day, r.id)}
                    className="px-2 py-1 rounded-md border border-blue-400 
                               text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900 
                               dark:text-blue-300 transition"
                    title={t("copy_range")}
                  >
                    <Copy size={16} />
                  </button>

                  <button
                    onClick={() => deleteRange(day, r.id)}
                    className="px-2 py-1 rounded-md border border-red-400 
                               text-red-500 hover:bg-red-100 dark:hover:bg-red-900 
                               dark:text-red-400 transition"
                    title={t("delete_range")}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {ranges.some((r1, i) =>
        ranges.some(
          (r2, j) => i !== j && r1.start < r2.end && r2.start < r1.end
        )
      ) && (
        <p className="text-sm text-red-500 mt-3 px-4 mb-2">
          {t("conflict_warning")}
        </p>
      )}
    </div>
  );
}
