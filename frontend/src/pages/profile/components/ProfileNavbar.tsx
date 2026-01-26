import styled from "styled-components";

const Wrapper = styled.header`
  width: 100%;
  background: var(--base-black, #0b0b0b);
  border-bottom: 0.041875rem var(--neutral-600, #525252) solid;
  backdrop-filter: blur(0.125rem);
`;

const Inner = styled.div`
  max-width: 120rem;
  height: 5rem;
  padding: 0 6.25rem;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 1024px) {
    padding: 0 2rem;
  }
`;

const Logo = styled.div`
  color: var(--neutral-50, #fafafa);
  font-size: 1.09375rem;
  font-weight: 700;
  line-height: 1.5625rem;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;
`;

const NavItem = styled.button`
  color: var(--neutral-300, #d4d4d4);
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.25rem;
`;

const BellButton = styled.button`
  width: 1.5rem;
  height: 1.5rem;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const BellIcon = styled.span`
  width: 1.0625rem;
  height: 1.1875rem;
  position: absolute;
  left: 0.25rem;
  top: 0.125rem;
  border: 0.125rem solid var(--neutral-50, #fafafa);
  border-radius: 0.25rem;
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
