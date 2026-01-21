import styled from "styled-components";

const LeftPanel = styled.div`
  display: flex;
  background-color: #000;
  color: #fff;
  padding: 4rem;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  width: 50%;
`;

const LeftPanelContent = styled.div``;

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 8rem;
`;

const LeftPanelText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StepIndicator = styled.p`
  font-size: 0.875rem;
  color: #9ca3af;
  letter-spacing: 0.05em;
`;

const Title = styled.h2`
  font-size: 3rem;
  font-family: serif;
  font-style: italic;
  line-height: 1.2;
`;

const Description = styled.p`
  font-size: 0.875rem;
  color: #9ca3af;
  margin-top: 1.5rem;
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
  background: purple;
  clip-path: ellipse(40% 50% at 50% 100%);
`;

const ProgressSteps = styled.div`
  display: flex;
  gap: 2rem;
  font-size: 0.875rem;
`;

const ProgressStep = styled.span<{ $active?: boolean }>`
  font-weight: ${(props) => (props.$active ? "bold" : "normal")};
  color: ${(props) => (props.$active ? "#fff" : "#4b5563")};
`;

interface DiagnosisLeftPanelProps {
  currentStep: number;
  stepLabel: string;
  title: React.ReactNode;
  description: React.ReactNode;
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
        <Logo>BONE:TOBE</Logo>
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
