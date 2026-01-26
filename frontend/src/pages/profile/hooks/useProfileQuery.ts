import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { fetchUserProfile } from "../api/profile.api";

import type { UserProfile } from "../api/profile.types";

export const profileQueryKey = ["profile"] as const;

export const useProfileQuery = (): UseQueryResult<UserProfile, Error> => {
  return useQuery<UserProfile, Error>({
    queryKey: profileQueryKey,
    queryFn: fetchUserProfile,
  });
};
