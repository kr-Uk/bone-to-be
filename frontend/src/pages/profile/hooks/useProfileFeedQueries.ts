import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { fetchMyFeeds, fetchMyScrappedFeeds, fetchUserFeeds } from "../api/profile.api";

import type { UserPost } from "../api/profile.types";

export const myFeedListQueryKey = ["profile", "feeds", "me"] as const;
export const myScrappedFeedListQueryKey = ["profile", "feeds", "scrapped"] as const;
export const userFeedListQueryKey = (userId: string) =>
  ["profile", "feeds", "user", userId] as const;

type FeedQueryOptions = {
  enabled?: boolean;
};

export const useMyFeedListQuery = (
  options: FeedQueryOptions = {},
): UseQueryResult<UserPost[], Error> => {
  const { enabled = true } = options;
  return useQuery<UserPost[], Error>({
    queryKey: myFeedListQueryKey,
    queryFn: () => fetchMyFeeds(),
    enabled,
  });
};

export const useMyScrappedFeedListQuery = (
  options: FeedQueryOptions = {},
): UseQueryResult<UserPost[], Error> => {
  const { enabled = true } = options;
  return useQuery<UserPost[], Error>({
    queryKey: myScrappedFeedListQueryKey,
    queryFn: () => fetchMyScrappedFeeds(),
    enabled,
  });
};

export const useUserFeedListQuery = (
  userId: string | null | undefined,
  options: FeedQueryOptions = {},
): UseQueryResult<UserPost[], Error> => {
  const { enabled = true } = options;
  return useQuery<UserPost[], Error>({
    queryKey: userId ? userFeedListQueryKey(userId) : ["profile", "feeds", "none"],
    queryFn: () => fetchUserFeeds(userId!),
    enabled: enabled && !!userId,
  });
};
