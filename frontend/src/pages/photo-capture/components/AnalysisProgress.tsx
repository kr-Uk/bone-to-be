import styled, { keyframes } from "styled-components";

import type { AnalysisStatus } from "@/shared/types/diagnosis";

type AnalysisProgressProps = {
  isOpen: boolean;
  currentStep: AnalysisStatus;
};

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  z-index: 9999;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xl};
  max-width: 400px;
  text-align: center;
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid ${({ theme }) => theme.colors.gray[700]};
  border-top-color: ${({ theme }) => theme.colors.purple[600]};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.heading.lg.fontSize};
  font-weight: ${({ theme }) => theme.typography.heading.lg.fontWeight};
  color: ${({ theme }) => theme.colors.secondary};
  margin: 0;
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.body.lg.regular.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.lg.regular.fontWeight};
  color: ${({ theme }) => theme.colors.gray[300]};
  margin: 0;
  line-height: 1.6;
`;

const getStepText = (step: AnalysisStatus) => {
  switch (step) {
    case "s3-upload":
      return {
        title: "이미지 업로드 중",
        description: "촬영하신 사진을 업로드하고 있습니다...",
      };
    case "analysis-request":
      return {
        title: "분석 요청 중",
        description: "AI 분석을 시작하고 있습니다...",
      };
    case "processing":
      return {
        title: "체형 분석 중",
        description: "AI가 당신의 체형을 분석하고 있습니다.\n잠시만 기다려 주세요.",
      };
    default:
      return {
        title: "처리 중",
        description: "요청을 처리하고 있습니다...",
      };
  }
};

export function AnalysisProgress({ isOpen, currentStep }: AnalysisProgressProps) {
  const { title, description } = getStepText(currentStep);

  return (
    <Overlay $isOpen={isOpen}>
      <ModalContent>
        <Spinner />
        <div>
          <Title>{title}</Title>
          <Description style={{ marginTop: "16px" }}>{description}</Description>
        </div>
      </ModalContent>
    </Overlay>
  );
}
