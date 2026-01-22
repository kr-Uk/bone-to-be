import styled from "styled-components";

const Wrapper = styled.header`
  width: 100%;
  background: ${({ theme }) => theme.colors.secondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  backdrop-filter: blur(2px);
`;

const Inner = styled.div`
  max-width: 1280px;
  height: 80px;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.heading.sm.fontSize};
  font-weight: ${({ theme }) => theme.typography.heading.sm.fontWeight};
  line-height: ${({ theme }) => theme.typography.heading.sm.lineHeight};
`;

const Nav = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const NavItem = styled.button`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.body.md.medium.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.md.medium.fontWeight};
  line-height: ${({ theme }) => theme.typography.body.md.medium.lineHeight};
`;

const BellButton = styled.button`
  width: 24px;
  height: 24px;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const BellIcon = styled.span`
  width: 17px;
  height: 19px;
  position: absolute;
  left: 4px;
  top: 2px;
  border: 2px solid ${({ theme }) => theme.colors.text};
  border-radius: 4px;
`;

const ProfileNavbar = () => {
  return (
    <Wrapper>
      <Inner>
        <Logo>LOGO</Logo>
        <Nav>
          <NavItem>HOME</NavItem>
          <NavItem>ABOUT</NavItem>
          <NavItem>FUNCTION</NavItem>
          <NavItem>COMMUNITY</NavItem>
          <NavItem>MYPAGE</NavItem>
        </Nav>
        <BellButton aria-label="Notifications">
          <BellIcon />
        </BellButton>
      </Inner>
    </Wrapper>
  );
};

export default ProfileNavbar;
