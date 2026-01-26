import { useQuery } from "@tanstack/react-query";

import { getMe } from "@/shared/api/auth";

export const useAuth = () => {
  const meQuery = useQuery({
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
