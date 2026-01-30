import { useMutation, type UseMutationResult } from "@tanstack/react-query";

import { getMe, login, type LoginPayload, type Me } from "@/shared/api/auth";
import { useAuthStore } from "@/shared/stores/authStore";

export const useLogin = (): UseMutationResult<Me, Error, LoginPayload> => {
  const { setAuth, clearAuth, setAuthLoading } = useAuthStore();

  return useMutation({
    mutationFn: async (payload) => {
      await login(payload);
      return await getMe();
    },
    onMutate: () => {
      setAuthLoading(true);
    },
    onSuccess: (me) => {
      setAuth(me);
    },
    onError: () => {
      clearAuth();
    },
    onSettled: () => {
      setAuthLoading(false);
    },
  });
};
