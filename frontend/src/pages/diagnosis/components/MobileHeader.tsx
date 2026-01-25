import styled from "styled-components";

import DiagnosisHeader from "@/shared/components/DiagnosisHeader";

const ContentWrapper = styled.div``;

const StepIndicator = styled.p`
  font-size: ${({ theme }) => theme.typography.body.md.regular.fontSize};
  color: ${({ theme }) => theme.colors.gray[500]};
`;

const Title = styled.h2`
  font-size: 1.875rem;
  font-family: serif;
  font-style: italic;
`;

interface MobileHeaderTopProps {
  onClose?: () => void;
}

export const MobileHeaderTop = ({ onClose }: MobileHeaderTopProps) => {
  return <DiagnosisHeader onClose={onClose} />;
};

interface MobileHeaderContentProps {
  stepLabel: string;
  title: string;
  className?: string;
}

export const MobileHeaderContent = ({ stepLabel, title, className }: MobileHeaderContentProps) => {
  return (
    <ContentWrapper className={className}>
      <StepIndicator>{stepLabel}</StepIndicator>
      <Title>{title}</Title>
    </ContentWrapper>
  );
};
