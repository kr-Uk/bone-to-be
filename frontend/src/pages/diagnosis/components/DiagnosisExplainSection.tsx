import styled from "styled-components";

const ExplainSection = styled.div<{ $variant?: "mobile" | "tablet" | "desktop" }>`
  display: flex;
  background-color: ${({ theme }) => theme.colors.gray[900]};
  color: ${({ theme }) => theme.colors.secondary};
  padding: 3rem;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;

  @media (min-width: 768px) and (max-width: 1023px) {
    width: 100%;
    padding: 2rem;
    justify-content: flex-start;
    gap: 3rem;
  }

  @media (min-width: 1024px) {
    width: 50%;
    padding: 3rem;
  }

  @media (max-width: 767px) {
    width: 100%;
    padding: 1.25rem 2rem;
    padding-top: 5rem; // Space for fixed header
    background-color: ${({ theme }) => theme.colors.gray[900]};
    justify-content: flex-start;
    gap: 1rem;
  }
`;

const ExplainContent = styled.div`
  margin-top: 5rem;

  @media (min-width: 768px) and (max-width: 1023px) {
    margin-top: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    order: 2;
    max-width: 28rem;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
  }

  @media (min-width: 1024px) {
    flex-direction: column;
  }

  @media (max-width: 767px) {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    order: 2;
    max-width: 28rem;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
  }
`;

const ContentText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};

  @media (min-width: 768px) and (max-width: 1023px) {
    flex-direction: row; // Wrapper + Description Horizontal
    align-items: center; // Align vertically centered
    justify-content: space-between; // Space them out
    gap: 2rem;
    width: 100%;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};

  @media (min-width: 768px) and (max-width: 1023px) {
    flex-shrink: 0; // Prevent title from shrinking
    align-items: flex-start; // Left align title text
  }
`;

const StepIndicator = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.purple[600]};
  font-weight: 700;
  line-height: 1rem;
  letter-spacing: 0.15rem;
`;

const Title = styled.h2`
  @media (min-width: 768px) and (max-width: 1023px) {
    font-size: 3rem;
    font-weight: 700;
    line-height: 1.2;
  }

  @media (min-width: 1024px) {
    font-size: 3.75rem;
    font-weight: 700;
    line-height: 1.2;
  }

  @media (max-width: 767px) {
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1.2;
  }
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.body.md.regular.fontSize};
  font-weight: 300;
  line-height: 1.421875rem;
  color: ${({ theme }) => theme.colors.gray[300]};

  @media (max-width: 767px) {
    font-size: ${({ theme }) => theme.typography.body.sm.regular.fontSize};
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    text-align: right; // Keep text right aligned
    width: 100%; // Take remaining space
    max-width: 50%; // Limit width so it doesn't stretch too thin if needed
  }
`;

const ProgressSteps = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.body.md.regular.fontSize};

  @media (min-width: 768px) and (max-width: 1023px) {
    flex-direction: row;
    justify-content: center; // Center progress steps
    align-items: center;
    position: static;
    order: 1;
    margin-bottom: 1rem;
    width: 100%;
    margin-top: 5rem;
    max-width: 28rem;
    margin-left: auto;
    margin-right: auto;
  }

  @media (min-width: 1024px) {
    flex-direction: row;
  }

  @media (max-width: 767px) {
    flex-direction: row;
    justify-content: center; // Center progress steps on mobile too
    position: static;
    order: 1;
    width: 100%;
    max-width: 28rem;
    margin-left: auto;
    margin-right: auto;
    margin-top: 0;
    margin-bottom: 0.5rem;
    overflow-x: auto;
    white-space: nowrap;

    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const ProgressStep = styled.span<{ $active?: boolean }>`
  font-weight: ${({ $active }) => ($active ? "700" : "500")};
  color: ${({ theme, $active }) => ($active ? theme.colors.gray[50] : theme.colors.gray[500])};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const StepNumber = styled.span<{ $active?: boolean }>`
  font-weight: ${({ $active }) => ($active ? "700" : "500")};
  color: ${({ theme, $active }) => ($active ? theme.colors.purple[600] : theme.colors.gray[500])};
`;

const StepSeparator = styled.div`
  width: 2rem;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.gray[700]};

  @media (min-width: 768px) and (max-width: 1023px) {
    display: block;
  }

  @media (max-width: 767px) {
    display: block;
    width: 1.5rem;
  }
`;

interface DiagnosisExplainSectionProps {
  currentStep: number;
  stepLabel: string;
  title: React.ReactNode;
  description: React.ReactNode;
  onClose?: () => void;
  variant?: "mobile" | "tablet" | "desktop";
}

const DiagnosisExplainSection = ({
  currentStep,
  stepLabel,
  title,
  description,
  variant = "desktop",
}: DiagnosisExplainSectionProps) => {
  return (
    <ExplainSection $variant={variant}>
      <ExplainContent>
        <ContentText>
          <TitleWrapper>
            <StepIndicator>{stepLabel}</StepIndicator>
            <Title>{title}</Title>
          </TitleWrapper>
          <Description>{description}</Description>
        </ContentText>
      </ExplainContent>

      <ProgressSteps>
        <ProgressStep $active={currentStep === 1}>
          <StepNumber $active={currentStep === 1}>01</StepNumber> Basic Info
        </ProgressStep>
        <StepSeparator />
        <ProgressStep $active={currentStep === 2}>
          <StepNumber $active={currentStep === 2}>02</StepNumber> Photo Scan
        </ProgressStep>
        <StepSeparator />
        <ProgressStep $active={currentStep === 3}>
          <StepNumber $active={currentStep === 3}>03</StepNumber> Analysis
        </ProgressStep>
      </ProgressSteps>
    </ExplainSection>
  );
};

export default DiagnosisExplainSection;
