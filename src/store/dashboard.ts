"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DashboardState {
  activeTab: string;
  subTab: string | null;
  setActiveTab: (tab: string, sub?: string | null) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      activeTab: "dashboard",
      subTab: null,
      setActiveTab: (tab, sub = null) => set({ activeTab: tab, subTab: sub }),
    }),
    { name: "dashboard-tab-storage" }
  )
);
