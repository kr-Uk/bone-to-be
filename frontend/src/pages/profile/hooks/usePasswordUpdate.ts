import { useMutation, type UseMutationResult } from "@tanstack/react-query";

import { updateMyPassword } from "../api/profile.api";
import type { UpdateMyPasswordRequest, UpdateMyPasswordResponse } from "../api/profile.types";

export const usePasswordUpdate = (): UseMutationResult<
  UpdateMyPasswordResponse,
  Error,
  UpdateMyPasswordRequest
> => {
  return useMutation({
    mutationFn: updateMyPassword,
  });
};
