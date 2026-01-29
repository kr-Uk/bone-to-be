import { useEffect, useRef, useState, type ReactNode } from "react";
import { CgProfile } from "react-icons/cg";
import { FaRegBell } from "react-icons/fa";
import { FiUser, FiUsers } from "react-icons/fi";
import { IoMenu } from "react-icons/io5";
import { LuUserCog } from "react-icons/lu";
import { MdFavoriteBorder, MdLogout, MdOutlineClose } from "react-icons/md";
import { RiShareBoxLine } from "react-icons/ri";
import { TbLineScan } from "react-icons/tb";
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
  { label: "COMMUNITY", path: "/community" },
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
  const profilePath = me?.nickname ? `/profile/${encodeURIComponent(me.nickname)}` : "/profile";
  const navItems: NavItem[] = isLoggedIn
    ? [...baseNavItems, { label: "MYPAGE", path: profilePath }]
    : baseNavItems;
  const navIcons: Record<string, ReactNode> = {
    ABOUT: <RiShareBoxLine size={19} strokeWidth={2.1} />,
    FUNCTION: <TbLineScan size={19} strokeWidth={2.1} />,
    COMMUNITY: <FiUsers size={19} strokeWidth={2.1} />,
    MYPAGE: <FiUser size={19} strokeWidth={2.1} />,
    "MY PAGE": <FiUser size={19} strokeWidth={2.1} />,
  };

  const displayName = me?.nickname ?? "User";
  const avatarInitial = displayName.slice(0, 1).toUpperCase();
  const handleNavigate = (path: string) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setIsProfileMenuOpen(false);
      setIsMobileMenuOpen(false);
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
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    if (!isLoggedIn || !me?.nickname) {
      return;
    }
    if (location.pathname === "/profile") {
      navigate(`/profile/${encodeURIComponent(me.nickname)}`, { replace: true });
    }
  }, [isLoggedIn, me?.nickname, location.pathname, navigate]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const handleChange = () => {
      if (mediaQuery.matches) {
        setIsMobileMenuOpen(false);
      }
    };

    handleChange();
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

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
              <FaRegBell size={26} />
            </AuthIconButton>
            <ProfileMenuWrap ref={profileMenuRef}>
              <AuthIconButton
                type="button"
                aria-label="Profile"
                aria-expanded={isProfileMenuOpen}
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              >
                <CgProfile size={26} />
              </AuthIconButton>
              <ProfileMenu $isOpen={isProfileMenuOpen}>
                <ProfileMenuHeader>
                  <ProfileMenuAvatar aria-hidden="true">
                    {me?.avatarUrl ? (
                      <ProfileMenuAvatarImage src={me.avatarUrl} alt={displayName} />
                    ) : (
                      <ProfileMenuAvatarFallback>{avatarInitial}</ProfileMenuAvatarFallback>
                    )}
                  </ProfileMenuAvatar>
                  <ProfileName>{displayName}</ProfileName>
                </ProfileMenuHeader>
                <ProfileMenuHeaderDivider />
                <ProfileMenuList>
                  <ProfileMenuItem type="button">
                    <IconNudge>
                      <LuUserCog size={20} />
                    </IconNudge>
                    회원정보 수정
                  </ProfileMenuItem>
                  <ProfileMenuItem type="button">
                    <MdFavoriteBorder size={20} />
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
      <SideMenuOverlay $isOpen={isMobileMenuOpen} aria-hidden={!isMobileMenuOpen}>
        <SideMenuBackdrop
          type="button"
          aria-label="Close menu"
          $isOpen={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <SideMenuPanel $isOpen={isMobileMenuOpen} role="dialog" aria-modal="true">
          <SideMenuTop>
            <SideMenuList>
              {navItems.map((item) => {
                const isActive = Boolean(item.path && location.pathname.startsWith(item.path));
                return (
                  <SideMenuRowButton
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
                    <SideMenuIconSlot aria-hidden="true" $isActive={isActive}>
                      {navIcons[item.label] ?? null}
                    </SideMenuIconSlot>
                    <SideMenuRowText $isActive={isActive}>{item.label}</SideMenuRowText>
                  </SideMenuRowButton>
                );
              })}
            </SideMenuList>

            {isLoggedIn && (
              <SideMenuAccountSection>
                <SideMenuRowButton type="button">
                  <SideMenuIconSlot aria-hidden="true">
                    <FaRegBell size={18} />
                  </SideMenuIconSlot>
                  <SideMenuRowText>알림함</SideMenuRowText>
                </SideMenuRowButton>
                <SideMenuRowButton type="button">
                  <SideMenuIconSlot aria-hidden="true">
                    <LuUserCog size={16} />
                  </SideMenuIconSlot>
                  <SideMenuRowText>회원정보 수정</SideMenuRowText>
                </SideMenuRowButton>
                <SideMenuRowButton type="button">
                  <SideMenuIconSlot aria-hidden="true">
                    <MdFavoriteBorder size={18} />
                  </SideMenuIconSlot>
                  <SideMenuRowText>Like한 게시물</SideMenuRowText>
                </SideMenuRowButton>
              </SideMenuAccountSection>
            )}
          </SideMenuTop>

          {isAuthLoading ? (
            <SideMenuPlaceholder />
          ) : isLoggedIn ? (
            <SideMenuLogoutButton type="button" onClick={handleLogout}>
              <SideMenuIconSlot aria-hidden="true" $danger>
                <MdLogout size={18} />
              </SideMenuIconSlot>
              <SideMenuLogoutText>로그아웃</SideMenuLogoutText>
            </SideMenuLogoutButton>
          ) : (
            <SideMenuLoginBar>
              <SideMenuLoginRow>
                <SideMenuLoginHint>로그인이 필요합니다.</SideMenuLoginHint>
                <SideMenuLoginLink type="button" onClick={() => handleNavigate("/login")}>
                  로그인
                </SideMenuLoginLink>
              </SideMenuLoginRow>
            </SideMenuLoginBar>
          )}

          <SideMenuCloseButton
            type="button"
            aria-label="Close menu"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <MdOutlineClose size={24} />
          </SideMenuCloseButton>
        </SideMenuPanel>
      </SideMenuOverlay>
    </Header>
  );
};

const Header = styled.header`
  width: 100%;
  position: relative;
  z-index: 900;
  background-color: ${({ theme }) => (theme as AppTheme).colors.gray[900]};
  border-bottom: 0.0625rem solid ${({ theme }) => (theme as AppTheme).colors.gray[700]};
  backdrop-filter: blur(2px);

  @media (max-width: 1023px) {
    border-bottom-color: ${({ theme }) => (theme as AppTheme).colors.gray[800]};
  }
`;

const HeaderInner = styled.div`
  width: 100%;
  max-width: 80rem;
  margin: 0 auto;
  padding: 0.75rem 2rem;
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
    display: none;
  }
`;

const NavLink = styled.button<{ $isActive?: boolean }>`
  ${withTypography((theme) => theme.typography.body.md.medium)};
  color: ${({ theme, $isActive }) =>
    $isActive ? (theme as AppTheme).colors.brand : (theme as AppTheme).colors.gray[50]};
  cursor: pointer;
  text-decoration: none;
  background: transparent;
  border: none;
  padding: 0;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    bottom: -0.2rem;
    background: ${({ theme }) => (theme as AppTheme).colors.brand};
    opacity: ${({ $isActive }) => ($isActive ? 1 : 0)};
    transition: opacity 0.2s ease;
  }

  &:hover {
    color: ${({ theme }) => (theme as AppTheme).colors.gray[300]};
  }
`;

const AuthLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 1023px) {
    display: none;
  }
`;

const AuthIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 1023px) {
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
  color: ${({ theme }) => (theme as AppTheme).colors.gray[50]};
  cursor: pointer;
  transition: color 0.2s ease;

  &[aria-expanded="true"] {
    color: ${({ theme }) => (theme as AppTheme).colors.brand};
  }

  &:hover {
    color: ${({ theme }) => (theme as AppTheme).colors.gray[300]};
  }

  &[aria-expanded="true"]:hover {
    color: ${({ theme }) => (theme as AppTheme).colors.brand};
  }
`;

const ProfileMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 0.75rem);
  right: 0;
  min-width: 15.5rem;
  padding: 0.75rem;
  border-radius: 0.75rem;
  background: ${({ theme }) => (theme as AppTheme).colors.gray[800]};
  border: 1px solid ${({ theme }) => (theme as AppTheme).colors.gray[600]};
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

const ProfileMenuAvatar = styled.span`
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  overflow: hidden;
  background: ${({ theme }) => (theme as AppTheme).colors.gray[700]};
  color: ${({ theme }) => (theme as AppTheme).colors.gray[50]};
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const ProfileMenuAvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfileMenuAvatarFallback = styled.span`
  font-weight: 700;
  font-size: 0.85rem;
`;

const ProfileName = styled.span`
  color: ${({ theme }) => (theme as AppTheme).colors.gray[50]};
  font-weight: 600;
  font-size: 0.95rem;
`;

const ProfileMenuHeaderDivider = styled.div`
  height: 1px;
  background: ${({ theme }) => (theme as AppTheme).colors.gray[600]};
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
  color: ${({ theme }) => (theme as AppTheme).colors.gray[300]};
  text-align: left;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  svg {
    color: inherit;
  }

  &:hover {
    background: ${({ theme }) => (theme as AppTheme).colors.gray[700]};
    color: ${({ theme }) => (theme as AppTheme).colors.purple[200]};
  }
`;

const IconNudge = styled.span`
  display: inline-flex;
  margin-left: 1px;
`;

const ProfileMenuDivider = styled.div`
  height: 1px;
  background: ${({ theme }) => (theme as AppTheme).colors.gray[600]};
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
    background: ${({ theme }) => (theme as AppTheme).colors.gray[700]};
  }
`;

const AuthPlaceholder = styled.div`
  width: 5.5rem;
  height: 2.25rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);

  @media (max-width: 1023px) {
    display: none;
  }
`;

const LoginLink = styled.button`
  ${withTypography((theme) => theme.typography.body.md.medium)};
  color: ${({ theme }) => (theme as AppTheme).colors.gray[50]};
  cursor: pointer;
  text-decoration: none;
  background: none;
  border: none;
  padding: 0;
  transition: color 0.3s ease;

  &:hover {
    color: ${({ theme }) => (theme as AppTheme).colors.gray[300]};
  }
`;

const SignupButton = styled.button`
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 0.8rem;
  background: ${({ theme }) => (theme as AppTheme).colors.brand};
  color: ${({ theme }) => (theme as AppTheme).colors.gray[900]};
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
  color: ${({ theme }) => (theme as AppTheme).colors.gray[50]};
  cursor: pointer;

  @media (max-width: 1023px) {
    display: flex;
  }
`;

const SideMenuOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  display: block;
  height: 100dvh;
  min-height: 100vh;
  z-index: 300;
  overflow: hidden;
  pointer-events: ${({ $isOpen }) => ($isOpen ? "auto" : "none")};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
  transition:
    opacity 0.2s ease,
    visibility 0s linear ${({ $isOpen }) => ($isOpen ? "0s" : "0.25s")};

  @media (min-width: 1024px) {
    display: none;
  }
`;

const SideMenuBackdrop = styled.button<{ $isOpen: boolean }>`
  position: absolute;
  inset: 0;
  border: none;
  background: ${({ $isOpen }) => ($isOpen ? "rgba(3, 3, 3, 0.35)" : "transparent")};
  backdrop-filter: ${({ $isOpen }) => ($isOpen ? "blur(6px)" : "none")};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
  transition:
    opacity 0.2s ease,
    visibility 0s linear ${({ $isOpen }) => ($isOpen ? "0s" : "0.2s")};
`;

const SideMenuPanel = styled.aside<{ $isOpen: boolean }>`
  width: clamp(18rem, 40vw, 24rem);
  min-width: 18rem;
  max-width: 90vw;
  height: 100dvh;
  min-height: 100vh;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  padding: 4rem 0.5rem 1.25rem;
  background: ${({ theme }) => (theme as AppTheme).colors.gray[900]};
  border-left: 1px solid ${({ theme }) => (theme as AppTheme).colors.gray[600]};
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: ${({ $isOpen }) => ($isOpen ? "-16px 0 32px rgba(0, 0, 0, 0.45)" : "none")};
  transform: translateX(${({ $isOpen }) => ($isOpen ? "0%" : "100%")});
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
  pointer-events: ${({ $isOpen }) => ($isOpen ? "auto" : "none")};
  transition:
    transform 0.25s ease,
    width 0.25s ease,
    opacity 0.2s ease,
    visibility 0s linear ${({ $isOpen }) => ($isOpen ? "0s" : "0.25s")};

  @media (max-width: 768px) {
    width: 100%;
    min-width: 100%;
    max-width: 100%;
    border-left: none;
  }
`;

const SideMenuTop = styled.div`
  width: 100%;
  padding-bottom: 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SideMenuList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SideMenuAccountSection = styled.div`
  width: 100%;
  padding-top: 4px;
  border-top: 1px solid ${({ theme }) => (theme as AppTheme).colors.gray[600]};
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SideMenuRowButton = styled.button<{ $isActive?: boolean }>`
  width: 100%;
  padding: 12px 20px;
  border: 0;
  background: transparent;
  cursor: pointer;
  text-align: left;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 14px;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
  }

  &:active {
    background: rgba(255, 255, 255, 0.07);
  }
`;

const SideMenuIconSlot = styled.span<{ $danger?: boolean; $isActive?: boolean }>`
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ $danger, $isActive, theme }) => {
    if ($danger) {
      return "#f87171";
    }
    if ($isActive) {
      return (theme as AppTheme).colors.brand;
    }
    return (theme as AppTheme).colors.gray[50];
  }};

  & > svg {
    width: 20px;
    height: 20px;
  }
`;

const SideMenuRowText = styled.span<{ $isActive?: boolean }>`
  color: ${({ theme, $isActive }) =>
    $isActive ? (theme as AppTheme).colors.brand : (theme as AppTheme).colors.gray[50]};
  font-family:
    Pretendard,
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 24px;
`;

const SideMenuLogoutButton = styled.button`
  width: 100%;
  padding: 12px 12px;
  border: 0;
  cursor: pointer;
  background: ${({ theme }) => (theme as AppTheme).colors.gray[900]};
  border-top: 1px solid ${({ theme }) => (theme as AppTheme).colors.gray[600]};
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 14px;

  &:hover {
    background: rgba(248, 113, 113, 0.06);
  }
`;

const SideMenuLogoutText = styled.span`
  color: #f87171;
  font-family:
    Pretendard,
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 24px;
`;

const SideMenuLoginBar = styled.div`
  width: 100%;
  padding: 12px 12px;
  background: ${({ theme }) => (theme as AppTheme).colors.gray[900]};
  border-top: 1px solid ${({ theme }) => (theme as AppTheme).colors.gray[600]};
`;

const SideMenuLoginRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const SideMenuLoginHint = styled.span`
  color: ${({ theme }) => (theme as AppTheme).colors.gray[300]};
  font-family:
    Pretendard,
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 24px;
`;

const SideMenuLoginLink = styled.button`
  border: 0;
  background: transparent;
  cursor: pointer;
  color: ${({ theme }) => (theme as AppTheme).colors.brand};
  font-family:
    Pretendard,
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  border-bottom: 1px solid ${({ theme }) => (theme as AppTheme).colors.brand};
  padding: 0;

  &:hover {
    opacity: 0.9;
  }
`;

const SideMenuCloseButton = styled.button`
  position: absolute;
  right: 12px;
  top: 12px;
  width: 28px;
  height: 28px;
  border: 0;
  background: transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => (theme as AppTheme).colors.gray[400]};
`;

const SideMenuPlaceholder = styled.div`
  height: 1.5rem;
  margin: 0 12px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
`;
