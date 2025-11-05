"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TourState {
  run: boolean;
  stepIndex: number;
  startTour: () => void;
  stopTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  resetTour: () => void;
}

export const useTourStore = create<TourState>()(
  persist(
    (set) => ({
      run: false,
      stepIndex: 0,
      startTour: () => {
        console.log("🟢 useTourStore.startTour()");
        set({ run: true, stepIndex: 0 });
      },
      stopTour: () => {
        console.log("🔴 useTourStore.stopTour()");
        set({ run: false });
      },
      nextStep: () =>
        set((s) => {
          console.log("➡️ useTourStore.nextStep()", s.stepIndex + 1);
          return { stepIndex: s.stepIndex + 1, run: true };
        }),
      prevStep: () =>
        set((s) => {
          const idx = s.stepIndex > 0 ? s.stepIndex - 1 : 0;
          console.log("⬅️ useTourStore.prevStep()", idx);
          return { stepIndex: idx, run: true };
        }),
      resetTour: () => {
        console.log("♻️ useTourStore.resetTour()");
        set({ run: false, stepIndex: 0 });
      },
    }),
    { name: "dashboard-tour" }
  )
);
