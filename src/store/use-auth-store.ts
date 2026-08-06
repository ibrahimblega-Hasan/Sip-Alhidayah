import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@/types";
import { DEMO_ACCOUNTS, ROLE_LABELS } from "@/lib/constants";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email, password) => {
        const account = DEMO_ACCOUNTS.find(
          (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
        );
        if (!account) {
          return { success: false, message: "Email atau kata sandi salah." };
        }
        set({
          user: {
            id: account.email,
            name: account.name,
            email: account.email,
            role: account.role,
            avatarUrl: `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(account.name)}`,
          },
          isAuthenticated: true,
        });
        return { success: true };
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "sip-auth" }
  )
);

export { ROLE_LABELS };
