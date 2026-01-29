import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";

import { deleteMe, type DeleteMeResponse } from "@/shared/api/user";

export const useDeleteMe = (): UseMutationResult<DeleteMeResponse, Error, void> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMe,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};
