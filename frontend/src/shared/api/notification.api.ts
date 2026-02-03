import axiosInstance from "@/shared/api/axios";
import type { Notification, NotificationType } from "@/shared/stores/notification.store";

type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};

type NotificationDto = {
  uuid: string;
  type: string;
  content: string;
  reportId?: number | null;
  createdAt: string;
};

const mapNotification = (dto: NotificationDto): Notification => ({
  id: dto.uuid,
  type: dto.type as NotificationType,
  message: dto.content,
  createdAt: dto.createdAt,
  payload: dto.reportId ? { jobId: String(dto.reportId) } : undefined,
});

export const fetchNotifications = async (): Promise<Notification[]> => {
  const { data } = await axiosInstance.get<ApiResponse<NotificationDto[]>>("/notifications");
  const list = Array.isArray(data?.data) ? data.data : [];
  const mapped = list.map(mapNotification);
  return mapped.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
};
