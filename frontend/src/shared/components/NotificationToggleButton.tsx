import styled from "styled-components";

import { connect } from "@/shared/notifications/sseClient";
import { useNotificationStore } from "@/shared/stores/notification.store";

export const NotificationToggleButton = () => {
  const isConnected = useNotificationStore((state) => state.isConnected);

  const handleConnect = () => {
    if (isConnected) {
      return;
    }
    connect();
  };

  return (
    <ToggleGroup>
      <ToggleButton type="button" onClick={handleConnect} disabled={isConnected} data-active={isConnected}>
        알림 켜기
      </ToggleButton>
    </ToggleGroup>
  );
};

const ToggleGroup = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
`;

const ToggleButton = styled.button`
  padding: 0.6rem 0.75rem;
  border-radius: 0.6rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[600]};
  background: ${({ theme }) => theme.colors.gray[800]};
  color: ${({ theme }) => theme.colors.gray[200]};
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;

  &[data-active="true"] {
    background: ${({ theme }) => theme.colors.brand};
    border-color: ${({ theme }) => theme.colors.brand};
    color: ${({ theme }) => theme.colors.gray[900]};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
