import { create } from "zustand";

export type NotificationType = string;

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

export type NotificationToast = {
  id: string;
  message: string;
  type?: string;
  reportId?: string;
  createdAt: string;
};

type NotificationStore = {
  notifications: Notification[];
  unreadCount: number;
  isConnected: boolean;
  toasts: NotificationToast[];
  push: (notification: Notification) => void;
  setNotifications: (notifications: Notification[]) => void;
  removeNotification: (notificationId: string) => void;
  markAllRead: () => void;
  setConnected: (value: boolean) => void;
  pushToast: (toast: NotificationToast) => void;
  removeToast: (toastId: string) => void;
};

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,
  isConnected: false,
  toasts: [],
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
  removeNotification: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.filter((item) => item.id !== notificationId),
    })),
  markAllRead: () => set({ unreadCount: 0 }),
  setConnected: (value) => set({ isConnected: value }),
  pushToast: (toast) =>
    set((state) => {
      if (state.toasts.some((item) => item.id === toast.id)) {
        return state;
      }
      return { toasts: [toast, ...state.toasts] };
    }),
  removeToast: (toastId) =>
    set((state) => ({ toasts: state.toasts.filter((item) => item.id !== toastId) })),
}));
