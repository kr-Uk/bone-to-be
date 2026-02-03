import { create } from "zustand";

export type NotificationType = "IMAGE_JOB" | "FOLLOW" | "COMMENT";

export type Notification = {
  id: string;
  type: NotificationType;
  message: string;
  createdAt: string;
  payload?: {
    jobId?: string;
    status?: "QUEUED" | "RUNNING" | "DONE" | "FAIL";
    progress?: number;
  };
};

type NotificationStore = {
  notifications: Notification[];
  unreadCount: number;
  isConnected: boolean;
  push: (notification: Notification) => void;
  setNotifications: (notifications: Notification[]) => void;
  markAllRead: () => void;
  setConnected: (value: boolean) => void;
};

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,
  isConnected: false,
  push: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),
  setNotifications: (notifications) =>
    set((state) => {
      const merged = new Map<string, Notification>();
      notifications.forEach((item) => {
        merged.set(item.id, item);
      });
      state.notifications.forEach((item) => {
        if (!merged.has(item.id)) {
          merged.set(item.id, item);
        }
      });
      const next = Array.from(merged.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      return { notifications: next };
    }),
  markAllRead: () => set({ unreadCount: 0 }),
  setConnected: (value) => set({ isConnected: value }),
}));
