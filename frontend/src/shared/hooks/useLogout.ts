import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";

import { logout } from "@/shared/api/auth";

type LogoutResponse = { message?: string };

export const useLogout = (): UseMutationResult<LogoutResponse, Error, void> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};
