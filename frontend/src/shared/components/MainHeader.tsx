import { useEffect, useRef, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { FaRegBell } from "react-icons/fa";
import { GrUserSettings } from "react-icons/gr";
import { IoMenu } from "react-icons/io5";
import { MdFavoriteBorder, MdLogout } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";

import type { AppTheme } from "@/shared/styles/theme";

import logo from "@/assets/image/MainLogo.svg";
import { useAuth } from "@/shared/hooks/useAuth";
import { useLogout } from "@/shared/hooks/useLogout";

type NavItem = {
  label: string;
  path?: string;
};

const baseNavItems: NavItem[] = [
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
  const { isAuthLoading, isLoggedIn, me } = useAuth();
  const logoutMutation = useLogout();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const navItems: NavItem[] = isLoggedIn
    ? [...baseNavItems, { label: "MYPAGE", path: "/profile" }]
    : baseNavItems;

  const displayName = me?.nickname ?? "User";
  const avatarInitial = displayName.slice(0, 1).toUpperCase();

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setIsProfileMenuOpen(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  useEffect(() => {
    if (!isProfileMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!profileMenuRef.current) {
        return;
      }
      if (!profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileMenuOpen]);

  useEffect(() => {
    setIsProfileMenuOpen(false);
  }, [location.pathname]);

  return (
    <Header>
      <HeaderInner>
        <Logo type="button" onClick={() => navigate("/")}>
          <LogoImg src={logo} alt="BORN TO BE" />
        </Logo>
        <Nav>
          {navItems.map((item) => {
            const isActive = Boolean(item.path && location.pathname.startsWith(item.path));
            return (
              <NavLink
                key={item.label}
                type="button"
                $isActive={isActive}
                onClick={() => {
                  if (!item.path) {
                    return;
                  }
                  handleNavigate(item.path);
                }}
              >
                {item.label}
              </NavLink>
            );
          })}
        </Nav>
        {isAuthLoading ? (
          <AuthPlaceholder />
        ) : isLoggedIn ? (
          <AuthIcons>
            <AuthIconButton type="button" aria-label="Notifications">
              <FaRegBell size={18} />
            </AuthIconButton>
            <ProfileMenuWrap ref={profileMenuRef}>
              <AuthIconButton
                type="button"
                aria-label="Profile"
                aria-expanded={isProfileMenuOpen}
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              >
                <CgProfile size={20} />
              </AuthIconButton>
              <ProfileMenu $isOpen={isProfileMenuOpen}>
                <ProfileMenuHeader>
                  <Avatar>
                    {me?.avatarUrl ? (
                      <AvatarImage src={me.avatarUrl} alt={displayName} />
                    ) : (
                      <AvatarFallback>{avatarInitial}</AvatarFallback>
                    )}
                  </Avatar>
                  <ProfileMeta>
                    <ProfileName>{displayName}</ProfileName>
                    {me?.email && <ProfileEmail>{me.email}</ProfileEmail>}
                  </ProfileMeta>
                </ProfileMenuHeader>
                <ProfileMenuList>
                  <ProfileMenuItem type="button">
                    <IconNudge>
                      <GrUserSettings size={16} />
                    </IconNudge>
                    회원정보 수정
                  </ProfileMenuItem>
                  <ProfileMenuItem type="button">
                    <MdFavoriteBorder size={18} />
                    Like한 게시물
                  </ProfileMenuItem>
                </ProfileMenuList>
                <ProfileMenuDivider />
                <ProfileMenuLogout type="button" onClick={handleLogout}>
                  <MdLogout size={18} />
                  로그아웃
                </ProfileMenuLogout>
              </ProfileMenu>
            </ProfileMenuWrap>
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
          {navItems.map((item) => {
            const isActive = Boolean(item.path && location.pathname.startsWith(item.path));
            return (
              <MobileMenuLink
                key={item.label}
                type="button"
                $isActive={isActive}
                onClick={() => {
                  if (!item.path) {
                    setIsMobileMenuOpen(false);
                    return;
                  }
                  handleNavigate(item.path);
                }}
              >
                {item.label}
              </MobileMenuLink>
            );
          })}
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

const ProfileMenuWrap = styled.div`
  position: relative;
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

const ProfileMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 0.75rem);
  right: 0;
  min-width: 15.5rem;
  padding: 0.75rem;
  border-radius: 0.75rem;
  background: ${({ theme }) => theme.colors.gray[900]};
  border: 1px solid ${({ theme }) => theme.colors.gray[800]};
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
  display: ${({ $isOpen }) => ($isOpen ? "grid" : "none")};
  gap: 0.75rem;
  z-index: 10;
`;

const ProfileMenuHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Avatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.gray[800]};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarFallback = styled.span`
  color: ${({ theme }) => theme.colors.gray[50]};
  font-weight: 700;
  font-size: 0.95rem;
`;

const ProfileMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const ProfileName = styled.span`
  color: ${({ theme }) => theme.colors.gray[50]};
  font-weight: 600;
  font-size: 0.95rem;
`;

const ProfileEmail = styled.span`
  color: ${({ theme }) => theme.colors.gray[400]};
  font-size: 0.8rem;
`;

const ProfileMenuList = styled.div`
  display: grid;
  gap: 0.35rem;
`;

const ProfileMenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.5rem 0.65rem;
  border-radius: 0.5rem;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.gray[300]};
  text-align: left;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  svg {
    color: inherit;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.gray[700]};
    color: ${({ theme }) => theme.colors.purple[200]};
  }
`;

const IconNudge = styled.span`
  display: inline-flex;
  margin-left: 1px;
`;

const ProfileMenuDivider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.gray[800]};
`;

const ProfileMenuLogout = styled.button`
  width: 100%;
  padding: 0.5rem 0.65rem;
  border-radius: 0.5rem;
  border: none;
  background: transparent;
  color: var(--red-400, #ff6467);
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  transition: background-color 0.2s ease;

  svg {
    color: inherit;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.gray[700]};
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
  background-color: ${({ theme }) => theme.colors.primary};

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
  text-align: left;
  cursor: pointer;
  border-bottom: 1px solid
    ${({ theme, $isActive }) => ($isActive ? theme.colors.brand : "transparent")};
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


