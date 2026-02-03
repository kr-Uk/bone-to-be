import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateMyProfile } from "../api/profile.api";

import { profileQueryKey } from "./useProfileQuery";

type ProfileUpdateParams = {
  nickname: string;
  bio: string;
  profileImageId?: number;
};

export const useProfileUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: ProfileUpdateParams) => updateMyProfile(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKey() });
    },
  });
};
