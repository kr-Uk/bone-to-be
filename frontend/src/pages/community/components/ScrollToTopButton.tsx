import { useEffect, useState } from "react";
import styled from "styled-components";

const Button = styled.button<{ $visible: boolean }>`
  position: fixed;
  bottom: 100px;
  right: 20px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.purple[600]};
  color: ${({ theme }) => theme.colors.gray[50]};
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  visibility: ${({ $visible }) => ($visible ? "visible" : "hidden")};
  transition:
    opacity 0.3s ease,
    visibility 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  &:hover {
    background-color: ${({ theme }) => theme.colors.purple[700]};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.purple[800]};
  }

  @media (min-width: 768px) {
    bottom: 120px;
    right: 40px;
    width: 56px;
    height: 56px;
  }
`;

const ArrowIcon = styled.svg`
  width: 24px;
  height: 24px;
  fill: currentColor;
`;

/**
 * 맨 위로 이동 버튼 컴포넌트
 * 스크롤 위치가 500px 이상일 때 표시되며, 클릭 시 부드럽게 페이지 상단으로 이동합니다
 */
export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY >= 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Button $visible={visible} onClick={scrollToTop} aria-label="맨 위로 이동">
      <ArrowIcon viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4l-8 8h5v8h6v-8h5z" />
      </ArrowIcon>
    </Button>
  );
}
