import { useNotificationStore, type Notification } from "@/shared/stores/notification.store";

const SSE_URL = "https://bonetobe.site/api/notifications/subscribe";

let eventSource: EventSource | null = null;
let isConnecting = false;

const normalizeConnectionState = () => {
  if (eventSource && eventSource.readyState === EventSource.CLOSED) {
    eventSource = null;
  }
};

export const connect = () => {
  if (typeof window === "undefined" || typeof EventSource === "undefined") {
    return;
  }

  normalizeConnectionState();
  if (eventSource || isConnecting) {
    return;
  }

  isConnecting = true;
  const source = new EventSource(SSE_URL, { withCredentials: true });
  eventSource = source;

  source.onopen = () => {
    isConnecting = false;
    useNotificationStore.getState().setConnected(true);
  };

  source.onmessage = (event) => {
    if (typeof event.data !== "string") {
      return;
    }

    try {
      const payload = JSON.parse(event.data) as Notification;
      useNotificationStore.getState().push(payload);
    } catch {
      return;
    }
  };

  source.onerror = () => {
    isConnecting = false;
    source.close();
    eventSource = null;
    useNotificationStore.getState().setConnected(false);
  };
};

export const disconnect = () => {
  isConnecting = false;
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }
  useNotificationStore.getState().setConnected(false);
};
