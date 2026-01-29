import { useQuery } from "@tanstack/react-query";

import { getMe, type Me } from "@/shared/api/auth";

type UseAuthResult = {
  me: Me | undefined;
  isLoggedIn: boolean;
  isAuthLoading: boolean;
};

type UseAuthOptions = {
  enabled?: boolean;
};

export const useAuth = (options: UseAuthOptions = {}): UseAuthResult => {
  const { enabled = true } = options;
  const meQuery = useQuery<Me, Error>({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchInterval: 30 * 60 * 1000,
    refetchIntervalInBackground: false,
    enabled,
  });

  return {
    me: meQuery.data,
    isLoggedIn: meQuery.isSuccess,
    isAuthLoading: meQuery.isLoading,
  };
};
