import { create } from "zustand";

import type { Me } from "@/shared/api/auth";

interface AuthState {
  me: Me | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  hasCheckedAuth: boolean;
  isLoginModalOpen: boolean;
  isAuthRequiredModalOpen: boolean;
  authRequiredReturnPath: string | null;
  setAuth: (me: Me) => void;
  clearAuth: () => void;
  setAuthLoading: (value: boolean) => void;
  setHasCheckedAuth: (value: boolean) => void;
  login: (userInfo: Me) => void;
  logout: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openAuthRequiredModal: (returnPath?: string) => void;
  closeAuthRequiredModal: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  me: null,
  isAuthenticated: false,
  isAuthLoading: true,
  hasCheckedAuth: false,
  isLoginModalOpen: false,
  isAuthRequiredModalOpen: false,
  authRequiredReturnPath: null,
  setAuth: (me) => set({ me, isAuthenticated: true }),
  clearAuth: () => set({ me: null, isAuthenticated: false }),
  setAuthLoading: (value) => set({ isAuthLoading: value }),
  setHasCheckedAuth: (value) => set({ hasCheckedAuth: value }),
  login: (userInfo) => set({ me: userInfo, isAuthenticated: true }),
  logout: () => set({ me: null, isAuthenticated: false }),
  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),
  openAuthRequiredModal: (returnPath) =>
    set({
      isAuthRequiredModalOpen: true,
      isLoginModalOpen: false,
      authRequiredReturnPath: returnPath || null,
    }),
  closeAuthRequiredModal: () =>
    set({ isAuthRequiredModalOpen: false, authRequiredReturnPath: null }),
}));
