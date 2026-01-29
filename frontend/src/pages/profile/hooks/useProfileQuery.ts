import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { fetchMyProfile, fetchUserProfile } from "../api/profile.api";

import type { UserProfile } from "../api/profile.types";

export const profileQueryKey = (userId?: string) =>
  userId ? (["profile", "user", userId] as const) : (["profile", "me"] as const);

type UseProfileOptions = {
  enabled?: boolean;
};

export const useProfileQuery = (
  userId?: string,
  options: UseProfileOptions = {},
): UseQueryResult<UserProfile, Error> => {
  const { enabled = true } = options;
  return useQuery<UserProfile, Error>({
    queryKey: profileQueryKey(userId),
    queryFn: () => (userId ? fetchUserProfile(userId) : fetchMyProfile()),
    enabled,
  });
};
