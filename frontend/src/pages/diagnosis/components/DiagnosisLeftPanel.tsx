import styled from "styled-components";

const LeftPanel = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.colors.gray[900]};
  color: ${({ theme }) => theme.colors.secondary};
  padding: 3rem;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  width: 50%;
`;

const LeftPanelContent = styled.div`
  margin-top: 5rem;
`;

const LeftPanelText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const StepIndicator = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.purple[600]};
  font-weight: 700;
  line-height: 1rem;
  letter-spacing: 0.15rem;
`;

const Title = styled.h2`
  // font-size: ${({ theme }) => theme.typography.heading["2xl"].fontSize};
  // font-weight: ${({ theme }) => theme.typography.heading["2xl"].fontWeight};
  // line-height: ${({ theme }) => theme.typography.heading["2xl"].lineHeight};

  @media (min-width: 1024px) {
    font-size: 3.75rem;
    font-weight: 700;
    line-height: 1.2;
  }
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.body.md.regular.fontSize};
  font-weight: 300;
  line-height: 1.421875rem;
  color: ${({ theme }) => theme.colors.gray[300]};
`;

const DecorativeBackground = styled.div`
  position: absolute;
  inset: 0;
  z-index: -10;
  opacity: 0.2;
`;

const PurplePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.purple[600]};
  clip-path: ellipse(40% 50% at 50% 100%);
`;

const ProgressSteps = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.typography.body.md.regular.fontSize};
`;

const ProgressStep = styled.span<{ $active?: boolean }>`
  font-weight: ${({ $active }) => ($active ? "bold" : "normal")};
  color: ${({ theme, $active }) => ($active ? theme.colors.secondary : theme.colors.gray[600])};
`;

interface DiagnosisLeftPanelProps {
  currentStep: number;
  stepLabel: string;
  title: React.ReactNode;
  description: React.ReactNode;
  onClose?: () => void;
}

const DiagnosisLeftPanel = ({
  currentStep,
  stepLabel,
  title,
  description,
  
}: DiagnosisLeftPanelProps) => {
  return (
    <LeftPanel>
      <LeftPanelContent>
        <LeftPanelText>
          <StepIndicator>{stepLabel}</StepIndicator>
          <Title>{title}</Title>
          <Description>{description}</Description>
        </LeftPanelText>
      </LeftPanelContent>

      <DecorativeBackground>
        <PurplePlaceholder />
      </DecorativeBackground>

      <ProgressSteps>
        <ProgressStep $active={currentStep === 1}>01 Basic Info</ProgressStep>
        <ProgressStep $active={currentStep === 2}>02 Photo Scan</ProgressStep>
        <ProgressStep $active={currentStep === 3}>03 Analysis</ProgressStep>
      </ProgressSteps>
    </LeftPanel>
  );
};

export default DiagnosisLeftPanel;
