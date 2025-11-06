"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TimeRange {
  id: string;
  start: string;
  end: string;
}

export interface DaySchedule {
  day: string;
  ranges: TimeRange[];
}

interface WorkingHoursState {
  week: DaySchedule[];
  savedWeek: DaySchedule[];
  hasConflicts: boolean;
  hasUnsavedChanges: boolean;
  message: string | null;
  messageType: "success" | "error" | "info" | null;

  addRange: (day: string) => void;
  deleteRange: (day: string, rangeId: string) => void;
  copyRange: (day: string, rangeId: string) => void;
  updateRange: (
    day: string,
    rangeId: string,
    field: "start" | "end",
    value: string
  ) => void;
  checkConflicts: () => void;
  saveChanges: () => void;
  discardChanges: () => void;
  clearMessage: () => void;
}

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function rangesOverlap(a: TimeRange, b: TimeRange) {
  return a.start < b.end && b.start < a.end;
}

export const useWorkingHoursStore = create<WorkingHoursState>()(
  persist(
    (set, get) => ({
      week: days.map((d) => ({ day: d, ranges: [] })),
      savedWeek: days.map((d) => ({ day: d, ranges: [] })),
      hasConflicts: false,
      hasUnsavedChanges: false,
      message: null,
      messageType: null,

      addRange(day) {
        set((state) => {
          const newWeek = state.week.map((d) =>
            d.day === day
              ? {
                  ...d,
                  ranges: [
                    ...d.ranges,
                    { id: crypto.randomUUID(), start: "09:00", end: "17:00" },
                  ],
                }
              : d
          );
          return { week: newWeek, hasUnsavedChanges: true };
        });
        get().checkConflicts();
      },

      deleteRange(day, rangeId) {
        set((state) => {
          const newWeek = state.week.map((d) =>
            d.day === day
              ? { ...d, ranges: d.ranges.filter((r) => r.id !== rangeId) }
              : d
          );
          return { week: newWeek, hasUnsavedChanges: true };
        });
        get().checkConflicts();
      },

      copyRange(day, rangeId) {
        const { week } = get();
        const sourceDay = week.find((d) => d.day === day);
        const rangeToCopy = sourceDay?.ranges.find((r) => r.id === rangeId);
        if (!rangeToCopy) return;

        const newWeek = week.map((d) => {
          if (d.day === day) return d; // skip same day
          return {
            ...d,
            ranges: [
              ...d.ranges,
              {
                ...rangeToCopy,
                id: crypto.randomUUID(), // new ID for each day
              },
            ],
          };
        });

        set({
          week: newWeek,
          hasUnsavedChanges: true,
        });
        get().checkConflicts();
      },

      updateRange(day, rangeId, field, value) {
        set((state) => {
          const newWeek = state.week.map((d) =>
            d.day === day
              ? {
                  ...d,
                  ranges: d.ranges.map((r) =>
                    r.id === rangeId ? { ...r, [field]: value } : r
                  ),
                }
              : d
          );
          return { week: newWeek, hasUnsavedChanges: true };
        });
        get().checkConflicts();
      },

      checkConflicts() {
        const { week } = get();
        let conflict = false;
        for (const day of week) {
          for (let i = 0; i < day.ranges.length; i++) {
            for (let j = i + 1; j < day.ranges.length; j++) {
              if (rangesOverlap(day.ranges[i], day.ranges[j])) conflict = true;
            }
          }
        }
        set({ hasConflicts: conflict });
      },

      saveChanges() {
        const { hasConflicts, week } = get();
        if (hasConflicts) {
          set({
            message: "conflict_warning",
            messageType: "error",
          });
          return;
        }

        set({
          savedWeek: JSON.parse(JSON.stringify(week)),
          hasUnsavedChanges: false,
          message: "save_success",
          messageType: "success",
        });
      },

      discardChanges() {
        const { savedWeek } = get();
        set({
          week: JSON.parse(JSON.stringify(savedWeek)),
          hasUnsavedChanges: false,
          message: "discard_success",
          messageType: "info",
        });
      },

      clearMessage() {
        set({ message: null, messageType: null });
      },
    }),
    { name: "working-hours-storage" }
  )
);
