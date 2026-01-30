import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { fetchFollowList } from "../api/profile.api";

import type { FollowModalType, FollowUser } from "../api/profile.types";

export const followListQueryKey = (type: FollowModalType, userId?: string) =>
  userId
    ? (["profile", "user", userId, "followList", type] as const)
    : (["profile", "me", "followList", type] as const);

export const useFollowListQuery = (
  type: FollowModalType | null,
  userId?: string,
  enabled = true,
): UseQueryResult<FollowUser[], Error> => {
  return useQuery<FollowUser[], Error>({
    queryKey: type ? followListQueryKey(type, userId) : ["profile", "followList", "none"],
    queryFn: () => fetchFollowList(type ?? "follower", userId),
    enabled: enabled && !!type,
  });
};
