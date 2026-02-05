import { memo } from "react";
import { IoCheckmarkCircle, IoWarning, IoCloseCircle } from "react-icons/io5";
import styled from "styled-components";

import type { CaptureMode } from "@/shared/types/diagnosis";
import type { PoseValidationResult } from "@/shared/utils/poseValidation";

type PoseValidationFeedbackProps = {
  validationResult: PoseValidationResult | null;
  mode: CaptureMode;
  onRetry: () => void;
};

const Container = styled.div<{ $status: "success" | "warning" | "error" }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.gray[800]};
  border: 1px solid
    ${({ $status }) => {
      if ($status === "success") return "#10B981";
      if ($status === "warning") return "#F59E0B";
      if ($status === "error") return "#EF4444";
      return "transparent";
    }};
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

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Icon = styled.div<{ $status: "success" | "warning" | "error" }>`
  font-size: 24px;
  color: ${({ $status }) => {
    if ($status === "success") return "#10B981";
    if ($status === "warning") return "#F59E0B";
    if ($status === "error") return "#EF4444";
    return "#fff";
  }};
`;

const StatusText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  flex: 1;
`;

const Title = styled.h3<{ $status: "success" | "warning" | "error" }>`
  font-size: ${({ theme }) => theme.typography.body.lg.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.lg.semibold.fontWeight};
  color: ${({ $status }) => {
    if ($status === "success") return "#10B981";
    if ($status === "warning") return "#F59E0B";
    if ($status === "error") return "#EF4444";
    return "#fff";
  }};
  margin: 0;
`;

const Score = styled.p`
  font-size: ${({ theme }) => theme.typography.body.sm.regular.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.sm.regular.fontWeight};
  color: ${({ theme }) => theme.colors.gray[400]};
  margin: 0;
`;

const MessageList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Message = styled.li`
  font-size: ${({ theme }) => theme.typography.body.sm.regular.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.sm.regular.fontWeight};
  color: ${({ theme }) => theme.colors.gray[300]};
  padding-left: ${({ theme }) => theme.spacing.md};
  position: relative;

  &::before {
    content: "•";
    position: absolute;
    left: 0;
  }
`;

const RetryButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: 6px;
  font-size: ${({ theme }) => theme.typography.body.sm.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.sm.semibold.fontWeight};
  border: 1px solid ${({ theme }) => theme.colors.gray[600]};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.gray[300]};
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[800]};
    border-color: ${({ theme }) => theme.colors.gray[500]};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.purple[600]};
    outline-offset: 2px;
  }
`;

export const PoseValidationFeedback = memo<PoseValidationFeedbackProps>(
  function PoseValidationFeedback({ validationResult, mode, onRetry }) {
    if (!validationResult) return null;

    const { isValid, errors, warnings, score } = validationResult;

    // 상태 결정
    let status: "success" | "warning" | "error" | "none" = "none";
    if (isValid && errors.length === 0) {
      status = "success";
    } else if (errors.length > 0) {
      status = "error";
    } else if (warnings.length > 0) {
      status = "warning";
    }

    const getIcon = () => {
      if (status === "success") return <IoCheckmarkCircle />;
      if (status === "warning") return <IoWarning />;
      if (status === "error") return <IoCloseCircle />;
      return null;
    };

    const getTitle = () => {
      if (status === "success") return "포즈 검증 완료";
      if (status === "warning") return "포즈 개선 권장";
      if (status === "error") return "포즈 검증 실패";
      return "";
    };

    const messages = [...errors, ...warnings];

    // Don't render if status is "none"
    if (status === "none") return null;

    return (
      <Container $status={status}>
        <Header>
          <Icon $status={status}>{getIcon()}</Icon>
          <StatusText>
            <Title $status={status}>{getTitle()}</Title>
            <Score>점수: {score} / 100</Score>
          </StatusText>
        </Header>

        {messages.length > 0 && (
          <MessageList>
            {messages.map((msg, idx) => (
              <Message key={idx}>{msg}</Message>
            ))}
          </MessageList>
        )}

        {status === "error" && (
          <RetryButton onClick={onRetry}>
            {mode === "camera" ? "다시 촬영" : "다시 선택"}
          </RetryButton>
        )}
      </Container>
    );
  },
);
