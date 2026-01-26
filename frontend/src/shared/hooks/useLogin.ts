import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";

import { login, type LoginPayload, type LoginResponse } from "@/shared/api/auth";

export const useLogin = (): UseMutationResult<LoginResponse, Error, LoginPayload> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};
