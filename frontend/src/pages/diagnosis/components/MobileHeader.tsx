import styled from "styled-components";

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Logo = styled.h1`
  font-size: ${({ theme }) => theme.typography.heading.sm.fontSize};
  font-weight: ${({ theme }) => theme.typography.heading.sm.fontWeight};
`;

const MenuButton = styled.button`
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
`;

const ContentWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

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
  className?: string;
}

export const MobileHeaderTop = ({ className }: MobileHeaderTopProps) => {
  return (
    <HeaderTop className={className}>
      <Logo>BONE:TOBE</Logo>
      <MenuButton>☰</MenuButton>
    </HeaderTop>
  );
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
