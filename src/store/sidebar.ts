"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SidebarState {
  collapsed: boolean;
  toggleCollapsed: () => void;
  expandSidebar: () => void;
  collapseSidebar: () => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      collapsed: true, // ✅ Default collapsed on first load
      toggleCollapsed: () => set({ collapsed: !get().collapsed }),
      expandSidebar: () => set({ collapsed: false }),
      collapseSidebar: () => set({ collapsed: true }),
    }),
    {
      name: "sidebar-storage",
      storage: createJSONStorage(() => localStorage), // ✅ Explicit storage layer
      partialize: (state) => ({ collapsed: state.collapsed }), // only save what matters
      onRehydrateStorage: () => {
        // optional: useful for debugging or rehydration sync
        console.debug("✅ Sidebar state rehydrated from localStorage");
      },
    }
  )
);
