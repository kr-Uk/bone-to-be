import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { fetchFollowList } from "../api/profile.api";

import type { FollowModalType, FollowUser } from "../api/profile.types";

export const followListQueryKey = (type: FollowModalType) => ["profile", "followList", type] as const;

export const useFollowListQuery = (
  type: FollowModalType | null,
  enabled = true,
): UseQueryResult<FollowUser[], Error> => {
  return useQuery<FollowUser[], Error>({
    queryKey: type ? followListQueryKey(type) : ["profile", "followList", "none"],
    queryFn: () => fetchFollowList(type ?? "follower"),
    enabled: enabled && !!type,
  });
};
