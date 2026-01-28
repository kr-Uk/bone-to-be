import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Label = styled.p`
  font-size: ${({ theme }) => theme.typography.body.lg.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.lg.semibold.fontWeight};
  color: ${({ theme }) => theme.colors.gray[200]};
  line-height: 16px;
  margin: 0;
`;

const Value = styled.p`
  font-size: ${({ theme }) => theme.typography.body.lg.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.lg.semibold.fontWeight};
  color: ${({ theme }) => theme.colors.brand};
  line-height: 16px;
  margin: 0;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 6px;
  background-color: ${({ theme }) => theme.colors.gray[600]};
  border-radius: 99px;
  overflow: hidden;
  position: relative;
`;

interface ProgressFillProps {
  $percentage: number;
}

const ProgressFill = styled.div<ProgressFillProps>`
  height: 100%;
  width: ${({ $percentage }) => $percentage}%;
  background-color: ${({ theme }) => theme.colors.brand};
  border-radius: 99px;
  box-shadow: 0px 0px 10px 0px rgba(124, 58, 237, 0.5);
  transition: width 1s ease-out;
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.body.lg.regular.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.lg.regular.fontWeight};
  color: ${({ theme }) => theme.colors.gray[400]};
  line-height: 15px;
  margin: 0;
`;

interface SkeletonStrengthBarProps {
  percentage: number; // 0-100
  label?: string;
  description?: string;
}

const SkeletonStrengthBar = ({
  percentage,
  label = "골격 강도",
  description,
}: SkeletonStrengthBarProps) => {
  const strengthLabel = percentage >= 80 ? "Strong" : percentage >= 50 ? "Moderate" : "Light";

  return (
    <Container>
      <Header>
        <Label>{label}</Label>
        <Value>
          {strengthLabel} ({percentage}%)
        </Value>
      </Header>
      <ProgressBarContainer>
        <ProgressFill $percentage={percentage} />
      </ProgressBarContainer>
      {description && <Description>{description}</Description>}
    </Container>
  );
};

export default SkeletonStrengthBar;
