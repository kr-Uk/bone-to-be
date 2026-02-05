import { memo } from "react";
import styled from "styled-components";

export const RotateDeviceOverlay = memo(() => {
  return (
    <Overlay>
      <RotateIcon>📱</RotateIcon>
      <Message>전신 촬영을 위해</Message>
      <Message>디바이스를 세로로 회전해주세요</Message>
    </Overlay>
  );
});

RotateDeviceOverlay.displayName = "RotateDeviceOverlay";

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  z-index: 100;
  gap: 16px;
`;

const RotateIcon = styled.div`
  font-size: 64px;
  animation: rotate 2s ease-in-out infinite;

  @keyframes rotate {
    0%,
    100% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(90deg);
    }
  }
`;

const Message = styled.p`
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  margin: 0;
`;
