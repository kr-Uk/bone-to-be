import styled, { css } from "styled-components";

export const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  justify-content: center;
  align-items: center;
  padding: 20px;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: opacity 0.3s ease;
  pointer-events: ${({ $isOpen }) => ($isOpen ? "auto" : "none")};
`;

export const ModalContainer = styled.div<{ $isOpen: boolean }>`
  background-color: ${({ theme }) => theme.colors.gray[800]};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  position: relative;
  transform: ${({ $isOpen }) => ($isOpen ? "scale(1)" : "scale(0.95)")};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition:
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.3s ease;

  /* Mobile */
  width: 80%;
  height: 80%;
  max-height: 100vh;
  border-radius: 0;

  @media (min-width: 768px) {
    /* Tablet */
    width: min(90vw, 570px);
    height: auto;
    max-height: 90vh;
    border-radius: 8px;
  }

  @media (min-width: 1024px) {
    /* Desktop */
    width: clamp(1024px, 90vw, 1440px);
    height: clamp(600px, 85vh, 1020px);
    flex-direction: row;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  padding: 0 24px;
  background-color: ${({ theme }) => theme.colors.gray[900]};
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px 8px 0 0;

  @media (min-width: 1024px) {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    border-radius: 8px 8px 0 0;
  }
`;

export const ModalTitle = styled.h2`
  font-size: clamp(18px, 4vw, 22.5px);
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[50]};
  margin: 0;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.gray[300]};
  font-size: 30px;
  cursor: pointer;
  padding: 0;
  min-width: 44px;
  min-height: 44px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: rgba(152, 16, 250, 0.2);
  touch-action: manipulation;

  &:hover {
    color: ${({ theme }) => theme.colors.gray[50]};
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const ModalContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;

  /* Mobile & Tablet: vertical layout */
  flex-direction: column;

  @media (min-width: 1024px) {
    /* Desktop: horizontal layout */
    flex-direction: row;
  }
`;

// 공통 ImageSection 스타일
const ImageSectionBase = css`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.gray[800]};
  aspect-ratio: 1 / 1;
  width: 100%;
`;

export const DesktopImageSection = styled.div`
  ${ImageSectionBase}

  /* Mobile/Tablet: 숨김 */
  display: none;

  @media (min-width: 1024px) {
    /* Desktop: Left 영역, 절대 크기 제한 */
    display: flex;
    flex: 0 0 auto;
    width: min(50vh, 600px);
    height: min(50vh, 600px);
    padding: 2rem;
    margin: auto 0; /* 세로 중앙 정렬 */
    order: 1; /* Left */
  }
`;

export const MobileTabletImageSection = styled.div`
  ${ImageSectionBase}

  /* Mobile/Tablet: ScrollableContent 내부에서 scroll 가능 */
  padding: 1.5rem;
  flex-shrink: 0; /* 1:1 비율 유지 */

  @media (min-width: 768px) and (max-width: 1023px) {
    /* Tablet */
    padding: 2rem;
  }

  @media (min-width: 1024px) {
    /* Desktop: 숨김 */
    display: none;
  }
`;

export const FormSection = styled.div`
  flex: 1;
  min-height: 0; /* flex 아이템이 자식의 min-content를 무시하도록 */
  background-color: ${({ theme }) => theme.colors.gray[800]};
  display: flex;
  flex-direction: column;

  /* Mobile/Tablet: 전체 영역, ProfileHeader + ScrollableContent 포함 */
  @media (max-width: 1023px) {
    padding: 0; /* padding은 내부 요소에서 제어 */
  }

  @media (min-width: 1024px) {
    /* Desktop: Right 영역 */
    flex: 1;
    padding: 0;
    order: 2; /* Right */
  }
`;

export const ScrollableContent = styled.div`
  flex: 1;
  min-height: 0; /* flex 아이템이 overflow를 제대로 처리하도록 */
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  display: flex;
  flex-direction: column;
`;
