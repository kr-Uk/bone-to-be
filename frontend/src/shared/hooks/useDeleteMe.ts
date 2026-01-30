import { useMutation, type UseMutationResult } from "@tanstack/react-query";

import { deleteMe, type DeleteMeResponse } from "@/shared/api/user";
import { useAuthStore } from "@/shared/stores/authStore";

export const useDeleteMe = (): UseMutationResult<DeleteMeResponse, Error, void> => {
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: deleteMe,
    onSuccess: () => {
      clearAuth();
    },
  });
};
