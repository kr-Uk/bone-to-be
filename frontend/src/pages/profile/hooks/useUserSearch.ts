import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { searchUsers } from "../api/profile.api";

import type { SearchUser } from "../api/profile.types";

export const userSearchQueryKey = (nickname?: string) =>
  ["users", "search", nickname ?? ""] as const;

type UseUserSearchOptions = {
  enabled?: boolean;
};

export const useUserSearch = (
  nickname: string,
  options: UseUserSearchOptions = {},
): UseQueryResult<SearchUser[], Error> => {
  const { enabled = true } = options;
  return useQuery<SearchUser[], Error>({
    queryKey: userSearchQueryKey(nickname),
    queryFn: () => searchUsers(nickname),
    enabled,
  });
};
