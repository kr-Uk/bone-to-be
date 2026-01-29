import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.body.md.regular.fontSize};
  justify-content: center;

  @media (max-width: 767px) {
    font-size: ${({ theme }) => theme.typography.body.sm.regular.fontSize};
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const Step = styled.span<{ $active: boolean }>`
  position: relative;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ theme, $active }) => ($active ? theme.colors.gray[50] : theme.colors.gray[500])};
  padding-bottom: ${({ theme }) => theme.spacing.xs};
  transition: color 0.3s ease;

  ${({ $active, theme }) =>
    $active &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background-color: ${theme.colors.purple[600]};
      border-radius: 1px;
    }
  `}
`;

const Separator = styled.span`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-weight: 300;
`;

interface ProgressStepsProps {
  currentStep: 1 | 2 | 3;
}

export const ProgressSteps = ({ currentStep }: ProgressStepsProps) => {
  return (
    <Container>
      <Step $active={currentStep === 1}>01 Basic Info</Step>
      <Separator>|</Separator>
      <Step $active={currentStep === 2}>02 Photo Scan</Step>
      <Separator>|</Separator>
      <Step $active={currentStep === 3}>03 Analysis</Step>
    </Container>
  );
};
