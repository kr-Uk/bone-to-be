import styled, { css } from "styled-components";

import type { AppTheme } from "@/shared/styles/theme";

import logo from "@/assets/Logo.svg";

type TypographyToken = {
  fontSize: string;
  fontWeight: number;
  lineHeight: number;
};

const applyTypography = (styles: TypographyToken) => css`
  font-size: ${styles.fontSize};
  font-weight: ${styles.fontWeight};
  line-height: ${styles.lineHeight};
`;

const withTypography = (getToken: (theme: AppTheme) => TypographyToken) => css`
  ${({ theme }) => applyTypography(getToken(theme as AppTheme))};
`;

export const MainHeader = () => {
  return (
    <Header>
      <HeaderInner>
        <Logo>
          <LogoImg src={logo} alt="BORN TO BE" />
        </Logo>
        <Nav>
          <NavLink>ABOUT</NavLink>
          <NavLink>FUNCTION</NavLink>
          <NavLink>COMMUNITY</NavLink>
        </Nav>
        <AuthLinks>
          <LoginLink>LOGIN</LoginLink>
          <SignupButton>SIGN UP</SignupButton>
        </AuthLinks>
        <MobileMenuButton type="button" aria-label="Open menu">
          <span />
          <span />
          <span />
        </MobileMenuButton>
      </HeaderInner>
    </Header>
  );
};

const Header = styled.header`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.gray[900]};
  border-bottom: 0.0625rem solid ${({ theme }) => theme.colors.gray[900]};
  backdrop-filter: blur(2px);

  @media (max-width: 1023px) {
    border-bottom-color: ${({ theme }) => theme.colors.gray[800]};
  }
`;

const HeaderInner = styled.div`
  width: 100%;
  max-width: 80rem;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 1023px) {
    padding: 0 1.5rem;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
`;

const LogoImg = styled.img`
  width: 11rem;
  height: 2.5rem;
  display: block;
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;

  @media (max-width: 1023px) {
    gap: 1.25rem;
  }

  @media (max-width: 767px) {
    display: none;
  }
`;

const NavLink = styled.a`
  ${withTypography((theme) => theme.typography.body.md.medium)};
  color: ${({ theme }) => theme.colors.gray[50]};
  cursor: pointer;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.gray[300]};
  }
`;

const AuthLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 1023px) {
    gap: 1rem;
  }

  @media (max-width: 767px) {
    display: none;
  }
`;

const LoginLink = styled.a`
  ${withTypography((theme) => theme.typography.body.md.medium)};
  color: ${({ theme }) => theme.colors.gray[50]};
  cursor: pointer;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.gray[300]};
  }
`;

const SignupButton = styled.button`
  border: none;
  border-radius: 0.5rem;
  padding: 0.35rem 0.8rem;
  background: ${({ theme }) => theme.colors.brand};
  color: ${({ theme }) => theme.colors.gray[900]};
  ${withTypography((theme) => theme.typography.body.md.semibold)};
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-0.125rem);
    box-shadow: 0 0.5rem 1rem rgba(152, 16, 250, 0.35);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  border: none;
  background: transparent;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  cursor: pointer;

  span {
    display: block;
    width: 1.375rem;
    height: 0.125rem;
    background-color: ${({ theme }) => theme.colors.gray[50]};
    border-radius: 9999px;
  }

  @media (max-width: 767px) {
    display: flex;
  }
`;
