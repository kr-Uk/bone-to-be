import styled from "styled-components";

const Container = styled.div`
  margin-bottom: 2rem;
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Logo = styled.h1`
  font-size: 1.25rem;
  font-weight: bold;
`;

const MenuButton = styled.button`
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
`;

const StepIndicator = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
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
