import { useNotificationStore, type Notification } from "@/shared/stores/notification.store";

type NotificationDto = {
  uuid: string;
  type: string;
  content: string;
  reportId?: number | null;
  createdAt: string;
};

const mapDtoToNotification = (dto: NotificationDto): Notification => ({
  id: dto.uuid,
  type: dto.type,
  message: dto.content,
  createdAt: dto.createdAt,
  payload: dto.reportId ? { jobId: String(dto.reportId) } : undefined,
});

const isToastType = (type?: string) => type === "체형 진단" || type === "가상 피팅";

const SSE_URL = "https://bonetobe.site/api/notifications/subscribe";

let eventSource: EventSource | null = null;
let isConnecting = false;
let shouldReconnect = false;
let reconnectAttempt = 0;
let reconnectTimer: number | null = null;

const normalizeConnectionState = () => {
  if (eventSource && eventSource.readyState === EventSource.CLOSED) {
    eventSource = null;
  }
};

const clearReconnectTimer = () => {
  if (reconnectTimer !== null) {
    window.clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
};

const scheduleReconnect = () => {
  if (!shouldReconnect || typeof window === "undefined") {
    return;
  }
  clearReconnectTimer();
  const delay = Math.min(1000 * 2 ** reconnectAttempt, 10000);
  reconnectAttempt += 1;
  reconnectTimer = window.setTimeout(() => {
    reconnectTimer = null;
    connect();
  }, delay);
};

export const connect = () => {
  if (typeof window === "undefined" || typeof EventSource === "undefined") {
    return;
  }

  shouldReconnect = true;
  normalizeConnectionState();
  if (eventSource || isConnecting) {
    return;
  }

  isConnecting = true;
  const source = new EventSource(SSE_URL, { withCredentials: true });
  eventSource = source;

  source.onopen = () => {
    isConnecting = false;
    reconnectAttempt = 0;
    clearReconnectTimer();
    useNotificationStore.getState().setConnected(true);
  };

  source.onmessage = (event) => {
    if (typeof event.data !== "string") {
      return;
    }

    console.log("[SSE] notifications/subscribe message:", event.data);

    try {
      const dto = JSON.parse(event.data) as NotificationDto;
      if (!dto?.uuid || !dto.content || !dto.createdAt) {
        return;
      }
      const notification = mapDtoToNotification(dto);
      const store = useNotificationStore.getState();
      store.push(notification);
      if (isToastType(dto.type)) {
        store.pushToast({
          id: notification.id,
          message: notification.message,
          type: notification.type,
          reportId: dto.reportId != null ? String(dto.reportId) : undefined,
          createdAt: notification.createdAt,
        });
      }
    } catch {
      return;
    }
  };

  source.onerror = () => {
    isConnecting = false;
    source.close();
    eventSource = null;
    useNotificationStore.getState().setConnected(false);
    scheduleReconnect();
  };
};

export const disconnect = () => {
  shouldReconnect = false;
  isConnecting = false;
  reconnectAttempt = 0;
  clearReconnectTimer();
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }
  useNotificationStore.getState().setConnected(false);
};
