"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useSidebarStore } from "@/src/store/sidebar";
import { getTranslations } from "next-intl/server";

interface User {
  email: string;
  password: string;
  name: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  lastLogin: number | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => { success: boolean; message: string };
  checkSession: () => void;
}

const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24h

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      users: [
        {
          email: "omar@gmail.com",
          password: "Omar1234kk",
          name: "Omar Ahmed",
          avatar: "",
        },
        {
          email: "sara@example.com",
          password: "SaraUser123",
          name: "Sara Youssef",
          avatar: "",
        },
        {
          email: "john@example.com",
          password: "JohnTest123",
          name: "John Smith",
          avatar: "",
        },
        {
          email: "fatima@example.com",
          password: "FatimaUsr12",
          name: "Fatima Noor",
          avatar: "",
        },
        {
          email: "omar@example.com",
          password: "OmarUser123",
          name: "Omar Zain",
          avatar: "",
        },
      ],
      isAuthenticated: false,
      lastLogin: null,

      //  LOGIN
      async login(email, password) {
        const { users } = get();
        const foundUser = users.find(
          (u) => u.email === email && u.password === password
        );
        if (!foundUser) return false;

        const now = Date.now();
        set({
          user: foundUser,
          isAuthenticated: true,
          lastLogin: now,
        });
        localStorage.setItem("lastLogin", now.toString());
        useSidebarStore.getState().collapseSidebar();
        return true;
      },

      //  LOGOUT
      logout() {
        set({ user: null, isAuthenticated: false, lastLogin: null });
        localStorage.removeItem("lastLogin");
      },

      //  UPDATE PROFILE
      updateProfile(data) {
        const { user, users } = get();
        if (!user)
          return {
            success: false,
            message: "auth.no_active_user",
          };

        const newEmail = data.email?.trim() || user.email;
        const newPassword = data.password?.trim() || user.password;
        const newName = data.name?.trim() || user.name;
        const newAvatar =
          data.avatar !== undefined ? data.avatar : user.avatar || "";

        // 🧩 Validations
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/;

        if (data.email && !emailRegex.test(newEmail))
          return { success: false, message: "auth.invalid_email_format" };

        if (data.password && !passwordRegex.test(newPassword))
          return { success: false, message: "auth.invalid_password_format" };

        const duplicate = users.find(
          (u) => u.email === newEmail && u.email !== user.email
        );
        if (duplicate) return { success: false, message: "auth.email_exists" };

        //  Update user
        const updatedUser = {
          ...user,
          email: newEmail,
          password: newPassword,
          name: newName,
          avatar: newAvatar,
        };

        const updatedUsers = users.map((u) =>
          u.email === user.email ? updatedUser : u
        );

        const newState = {
          ...get(),
          user: updatedUser,
          users: updatedUsers,
        };

        set(newState);

        const persistKey = "auth-storage";
        localStorage.setItem(
          persistKey,
          JSON.stringify({ state: newState, version: 0 })
        );

        return {
          success: true,
          message:
            data.avatar === ""
              ? "auth.profile_picture_removed"
              : "auth.profile_updated",
        };
      },

      //  SESSION CHECK
      checkSession() {
        const { lastLogin } = get();
        if (!lastLogin) return;
        const now = Date.now();
        if (now - lastLogin > SESSION_DURATION) {
          set({ user: null, isAuthenticated: false, lastLogin: null });
          localStorage.removeItem("lastLogin");
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      version: 0,
      onRehydrateStorage: () => (state, error) => {
        if (error) console.error("❌ Rehydrate error:", error);
        if (!state) return;
        setTimeout(() => {
          useAuthStore.getState().checkSession();
        }, 0);
      },
    }
  )
);
