import styled from "styled-components";

const Container = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

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

const StepIndicator = styled.p`
  font-size: ${({ theme }) => theme.typography.body.md.regular.fontSize};
  color: ${({ theme }) => theme.colors.gray[500]};
`;

const Title = styled.h2`
  font-size: 1.875rem;
  font-family: serif;
  font-style: italic;
`;

interface MobileHeaderProps {
  stepLabel: string;
  title: string;
}

const MobileHeader = ({ stepLabel, title }: MobileHeaderProps) => {
  return (
    <Container>
      <HeaderTop>
        <Logo>BONE:TOBE</Logo>
        <MenuButton>☰</MenuButton>
      </HeaderTop>
      <StepIndicator>{stepLabel}</StepIndicator>
      <Title>{title}</Title>
    </Container>
  );
};

export default MobileHeader;
