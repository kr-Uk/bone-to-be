import { useEffect } from "react";
import styled from "styled-components";

import { useProtectedNavigate } from "@/shared/hooks/useProtectedNavigate";
import { useNotificationStore, type NotificationToast } from "@/shared/stores/notification.store";

const TOAST_DURATION_MS = 4000;

export const NotificationToastContainer = () => {
  const toasts = useNotificationStore((state) => state.toasts);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <ToastViewport role="status" aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </ToastViewport>
  );
};

const ToastItem = ({ toast }: { toast: NotificationToast }) => {
  const removeToast = useNotificationStore((state) => state.removeToast);
  const protectedNavigate = useProtectedNavigate();

  useEffect(() => {
    const timerId = window.setTimeout(() => removeToast(toast.id), TOAST_DURATION_MS);
    return () => window.clearTimeout(timerId);
  }, [removeToast, toast.id]);

  const handleClick = () => {
    removeToast(toast.id);
    if (toast.reportId) {
      protectedNavigate(`/diagnosis/report/${toast.reportId}`);
    }
  };

  return (
    <ToastButton type="button" onClick={handleClick}>
      <ToastMessage>{toast.message}</ToastMessage>
    </ToastButton>
  );
};

const ToastViewport = styled.div`
  position: fixed;
  right: 20px;
  bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 1200;

  @media (max-width: 768px) {
    right: 12px;
    bottom: 16px;
  }
`;

const ToastButton = styled.button`
  min-width: min(320px, 85vw);
  padding: 0.85rem 1rem;
  border-radius: 0.85rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[700]};
  background: ${({ theme }) => theme.colors.gray[900]};
  color: ${({ theme }) => theme.colors.gray[50]};
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.35);
  cursor: pointer;
  text-align: left;
  display: grid;
  gap: 0.25rem;
`;

const ToastMessage = styled.div`
  font-size: 0.9rem;
  line-height: 1.3rem;
  font-weight: 600;
`;
