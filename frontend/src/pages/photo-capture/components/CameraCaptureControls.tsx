import { memo } from "react";
import { IoCamera, IoRefresh } from "react-icons/io5";
import styled from "styled-components";

type CameraCaptureControlsProps = {
  onCapture: () => void;
  onRetake: () => void;
  hasImage: boolean;
  isValidPose: boolean;
  cameraActive: boolean;
};

const Container = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  max-width: 28rem;
  margin: ${({ theme }) => theme.spacing.lg} auto 0;

  @media (min-width: 768px) {
    max-width: none;
  }

  @media (min-width: 1024px) {
    max-width: 448px;
    margin: ${({ theme }) => theme.spacing.lg} 0 0;
  }
`;

const Button = styled.button<{ $variant?: "primary" | "secondary" }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: 9999px;
  font-size: ${({ theme }) => theme.typography.body.md.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.md.semibold.fontWeight};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};

  ${({ theme, $variant }) =>
    $variant === "primary"
      ? `
    background-color: ${theme.colors.purple[600]};
    color: ${theme.colors.secondary};

    &:hover {
      background-color: ${theme.colors.purple[900]};
    }

    &:focus {
      outline: 2px solid ${theme.colors.purple[600]};
      outline-offset: 2px;
    }

    &:disabled {
      background-color: ${theme.colors.gray[700]};
      color: ${theme.colors.gray[500]};
      cursor: not-allowed;
    }
  `
      : `
    background-color: transparent;
    color: ${theme.colors.gray[300]};
    border: 1px solid ${theme.colors.gray[600]};

    &:hover {
      background-color: ${theme.colors.gray[800]};
      border-color: ${theme.colors.gray[500]};
    }

    &:focus {
      outline: 2px solid ${theme.colors.gray[600]};
      outline-offset: 2px;
    }

    &:disabled {
      background-color: transparent;
      color: ${theme.colors.gray[600]};
      border-color: ${theme.colors.gray[700]};
      cursor: not-allowed;
    }
  `}
`;

const IconWrapper = styled.span`
  font-size: 20px;
  display: flex;
  align-items: center;
`;

export const CameraCaptureControls = memo<CameraCaptureControlsProps>(
  function CameraCaptureControls({ onCapture, onRetake, hasImage, cameraActive }) {
    return (
      <Container>
        {!hasImage ? (
          <Button $variant="primary" onClick={onCapture} disabled={!cameraActive}>
            <IconWrapper>
              <IoCamera />
            </IconWrapper>
            촬영하기
          </Button>
        ) : (
          <Button $variant="secondary" onClick={onRetake}>
            <IconWrapper>
              <IoRefresh />
            </IconWrapper>
            다시 촬영
          </Button>
        )}
      </Container>
    );
  },
);
