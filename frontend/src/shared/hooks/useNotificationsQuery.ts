import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { fetchNotifications } from "@/shared/api/notification.api";
import type { Notification } from "@/shared/stores/notification.store";

export const notificationsQueryKey = ["notifications", "list"] as const;

export const useNotificationsQuery = (enabled = true): UseQueryResult<Notification[], Error> =>
  useQuery<Notification[], Error>({
    queryKey: notificationsQueryKey,
    queryFn: fetchNotifications,
    enabled,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
