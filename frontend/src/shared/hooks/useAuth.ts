import type { Me } from "@/shared/api/auth";

import { useAuthStore } from "@/shared/stores/authStore";

type UseAuthResult = {
  me: Me | undefined;
  isLoggedIn: boolean;
  isAuthLoading: boolean;
};

type UseAuthOptions = {
  enabled?: boolean;
};

export const useAuth = (_options: UseAuthOptions = {}): UseAuthResult => {
  const { me, isAuthenticated, isAuthLoading } = useAuthStore();

  return {
    me: me ?? undefined,
    isLoggedIn: isAuthenticated,
    isAuthLoading,
  };
};
