import { useMutation, type UseMutationResult } from "@tanstack/react-query";

import { logout } from "@/shared/api/auth";
import { useAuthStore } from "@/shared/stores/authStore";

type LogoutResponse = { message?: string };

export const useLogout = (): UseMutationResult<LogoutResponse, Error, void> => {
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAuth();
    },
  });
};
