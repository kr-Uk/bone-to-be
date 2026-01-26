import { useQuery } from "@tanstack/react-query";

import { getMe, type Me } from "@/shared/api/auth";

type UseAuthResult = {
  me: Me | undefined;
  isLoggedIn: boolean;
  isAuthLoading: boolean;
};

export const useAuth = (): UseAuthResult => {
  const meQuery = useQuery<Me, Error>({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
    staleTime: 60_000,
  });

  return {
    me: meQuery.data,
    isLoggedIn: meQuery.isSuccess,
    isAuthLoading: meQuery.isLoading,
  };
};
