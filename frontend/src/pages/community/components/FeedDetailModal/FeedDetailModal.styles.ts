import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 9999; /* 페이지보다 위 */
`;

export const ModalWrapper = styled.div`
  width: min(95vw, 1200px);
  height: 85vh;
  background: black;
  border-radius: 16px;
  display: flex;
  min-width: 0;
  overflow: auto;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 767px) {
    flex-direction: column;
    width: 95%;
    height: 90vh;
  }
`;

export const NavButton = styled.button<{ $position: "left" | "right" }>`
  position: fixed;
  top: 50%;
  ${({ $position, theme }) =>
    $position === "left" ? `left: ${theme.spacing.lg};` : `right: ${theme.spacing.lg};`}
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: ${({ theme }) => theme.colors.gray[50]};
  color: ${({ theme }) => theme.colors.gray[900]};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  ${({ theme }) => theme.typography.body.lg.semibold};
  transition: transform 160ms ease;

  @media (hover: hover) {
    &:hover:not(:disabled) {
      transform: translateY(-50%) scale(1.15);
    }
  }

  @media (hover: none) {
    &:active:not(:disabled) {
      transform: translateY(-50%) scale(1.15);
    }
  }

  &:disabled {
    opacity: 0.35;
    cursor: default;
  }

  @media (max-width: 767px) {
    width: 32px;
    height: 32px;
  }

  @media (max-width: 767px) {
    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

export const CloseButton = styled.button`
  position: fixed;
  top: ${({ theme }) => theme.spacing.lg};
  right: ${({ theme }) => theme.spacing.lg};
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.gray[50]};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  ${({ theme }) => theme.typography.body.lg.semibold};
  transition: transform 160ms ease;

  @media (hover: hover) {
    &:hover {
      transform: scale(1.15);
    }
  }

  @media (hover: none) {
    &:active {
      transform: scale(1.15);
    }
  }

  @media (max-width: 767px) {
    top: 8px;
    right: 8px;
    width: 32px;
    height: 32px;
  }
`;

export const MobileHeader = styled.div`
  display: none;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #262626;
  border-bottom: 1px solid #3f3f3f;

  @media (max-width: 767px) {
    display: flex;
  }
`;

export const MobileAvatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  background: #525252;
  flex-shrink: 0;
  cursor: pointer;
`;

export const MobileAvatarFallback = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #525252;
  flex-shrink: 0;
  cursor: pointer;
`;

export const MobileName = styled.div`
  color: #fafafa;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
`;

export const MobileNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const BodyTypeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 7px;
  border-radius: 5px;
  border: 1px solid #9810fa;
  color: #9810fa;
  font-size: 10px;
  font-weight: 700;
  line-height: 15px;
  background: rgba(152, 16, 250, 0.12);
`;

export const MobileMeta = styled.div`
  color: #a1a1a1;
  font-size: 12px;
`;
