import { useMutation, type UseMutationResult } from "@tanstack/react-query";

import {
  requestPasswordReset,
  type PasswordResetRequestPayload,
  type PasswordResetRequestResponse,
} from "@/shared/api/auth";

export const usePasswordResetRequest = (): UseMutationResult<
  PasswordResetRequestResponse,
  Error,
  PasswordResetRequestPayload
> => {
  return useMutation({
    mutationFn: requestPasswordReset,
  });
};
