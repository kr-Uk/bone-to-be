import { useState } from "react";
import { FaRegBell } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";

import type { AppTheme } from "@/shared/styles/theme";

import logo from "@/assets/image/MainLogo.svg";
import { useAuth } from "@/shared/hooks";

const baseNavItems = [
  { label: "ABOUT" },
  { label: "FUNCTION" },
  { label: "COMMUNITY" },
];

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
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthLoading, isLoggedIn } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navItems = isLoggedIn
    ? [...baseNavItems, { label: "MYPAGE", path: "/profile" }]
    : baseNavItems;

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <Header>
      <HeaderInner>
        <Logo type="button" onClick={() => navigate("/")}>
          <LogoImg src={logo} alt="BORN TO BE" />
        </Logo>
        <Nav>
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              type="button"
              $isActive={item.path ? location.pathname.startsWith(item.path) : false}
              onClick={item.path ? () => handleNavigate(item.path) : undefined}
            >
              {item.label}
            </NavLink>
          ))}
        </Nav>
        {isAuthLoading ? (
          <AuthPlaceholder />
        ) : isLoggedIn ? (
          <AuthIcons>
            <AuthIconButton type="button" aria-label="Notifications">
              <FaRegBell size={18} />
            </AuthIconButton>
            <AuthIconButton
              type="button"
              aria-label="Profile"
              onClick={() => handleNavigate("/profile")}
            >
              <CgProfile size={20} />
            </AuthIconButton>
          </AuthIcons>
        ) : (
          <AuthLinks>
            <LoginLink type="button" onClick={() => handleNavigate("/login")}>
              LOGIN
            </LoginLink>
            <SignupButton type="button" onClick={() => handleNavigate("/login?mode=signup")}>
              SIGN UP
            </SignupButton>
          </AuthLinks>
        )}
        <MobileMenuButton
          type="button"
          aria-label="Open menu"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          <IoMenu size={22} />
        </MobileMenuButton>
      </HeaderInner>
      <MobileMenu $isOpen={isMobileMenuOpen}>
        <MobileMenuNav>
          {navItems.map((item) => (
            <MobileMenuLink
              key={item.label}
              type="button"
              $isActive={item.path ? location.pathname.startsWith(item.path) : false}
              onClick={() => {
                if (item.path) {
                  handleNavigate(item.path);
                  return;
                }
                setIsMobileMenuOpen(false);
              }}
            >
              {item.label}
            </MobileMenuLink>
          ))}
        </MobileMenuNav>
        <MobileMenuDivider />
        {isAuthLoading ? (
          <MobileMenuPlaceholder />
        ) : isLoggedIn ? (
          <MobileMenuAction type="button" onClick={() => handleNavigate("/profile")}>
            마이 프로필
          </MobileMenuAction>
        ) : (
          <MobileMenuAction type="button" onClick={() => handleNavigate("/login")}>
            LOGIN
          </MobileMenuAction>
        )}
      </MobileMenu>
    </Header>
  );
};

const Header = styled.header`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
  border-bottom: 0.0625rem solid ${({ theme }) => theme.colors.primary};
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
    padding: 0.75rem 1.5rem;
  }
`;

const Logo = styled.button`
  display: flex;
  align-items: center;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
`;

const LogoImg = styled.img`
  width: 11rem;
  height: 2.5rem;
  display: block;

  @media (max-width: 1023px) {
    width: 9.5rem;
    height: 2.2rem;
  }

  @media (max-width: 768px) {
    width: 8.5rem;
    height: 2rem;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;

  @media (max-width: 1023px) {
    gap: 1.25rem;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.button<{ $isActive?: boolean }>`
  ${withTypography((theme) => theme.typography.body.md.medium)};
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.brand : theme.colors.gray[50]};
  cursor: pointer;
  text-decoration: none;
  background: transparent;
  border: none;
  padding: 0 0 0.2rem;
  border-bottom: 1px solid
    ${({ theme, $isActive }) => ($isActive ? theme.colors.brand : "transparent")};
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

  @media (max-width: 768px) {
    display: none;
  }
`;

const AuthIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const AuthIconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: ${({ theme }) => theme.colors.gray[50]};
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.gray[300]};
  }
`;

const AuthPlaceholder = styled.div`
  width: 5.5rem;
  height: 2.25rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);

  @media (max-width: 768px) {
    display: none;
  }
`;

const LoginLink = styled.button`
  ${withTypography((theme) => theme.typography.body.md.medium)};
  color: ${({ theme }) => theme.colors.gray[50]};
  cursor: pointer;
  text-decoration: none;
  background: none;
  border: none;
  padding: 0;
  transition: color 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.gray[300]};
  }
`;

const SignupButton = styled.button`
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 0.8rem;
  background: ${({ theme }) => theme.colors.brand};
  color: ${({ theme }) => theme.colors.gray[900]};
  ${withTypography((theme) => theme.typography.body.md.semibold)};
  cursor: pointer;
  transition: background-color 0.2s ease;
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
  color: ${({ theme }) => theme.colors.gray[50]};
  cursor: pointer;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileMenu = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  padding: 0.75rem 1.5rem 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.gray[800]};
  background-color: ${({ theme }) => theme.colors.gray[900]};

  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileMenuNav = styled.div`
  display: grid;
  gap: 0.5rem;
`;

const MobileMenuLink = styled.button<{ $isActive?: boolean }>`
  ${withTypography((theme) => theme.typography.body.md.medium)};
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.brand : theme.colors.gray[50]};
  background: transparent;
  border: none;
  padding: 0.4rem 0;
  border-bottom: 1px solid
    ${({ theme, $isActive }) => ($isActive ? theme.colors.brand : "transparent")};
  text-align: left;
  cursor: pointer;
`;

const MobileMenuDivider = styled.div`
  height: 1px;
  margin: 0.75rem 0;
  background: ${({ theme }) => theme.colors.gray[800]};
`;

const MobileMenuAction = styled.button`
  ${withTypography((theme) => theme.typography.body.md.semibold)};
  color: ${({ theme }) => theme.colors.gray[50]};
  background: transparent;
  border: none;
  padding: 0.35rem 0;
  text-align: left;
  cursor: pointer;
`;

const MobileMenuPlaceholder = styled.div`
  height: 1.5rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
`;
