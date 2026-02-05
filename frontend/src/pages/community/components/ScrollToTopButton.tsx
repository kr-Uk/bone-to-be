import { useEffect, useState } from "react";
import type { ButtonHTMLAttributes } from "react";
import styled from "styled-components";

import { FabButton } from "./FabButton";

const ScrollButton = styled(FabButton)`
  bottom: 92px;

  @media (min-width: 768px) {
    bottom: 120px;
    right: 24px;
  }
`;

const ChevronIcon = styled.svg`
  width: 22px;
  height: 22px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

/**
 * 맨 위로 이동 버튼 컴포넌트
 * 스크롤 위치가 500px 이상일 때 표시되며, 클릭 시 부드럽게 페이지 상단으로 이동합니다
 */
interface ScrollToTopButtonProps {
  trackingProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "type" | "aria-label">;
}

export function ScrollToTopButton({ trackingProps }: ScrollToTopButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY >= 300);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const isHidden = !visible;

  return (
    <ScrollButton
      {...trackingProps}
      type="button"
      $visible={visible}
      onClick={scrollToTop}
      aria-label="페이지 상단으로 이동"
      aria-hidden={isHidden}
      tabIndex={isHidden ? -1 : 0}
    >
      <ChevronIcon viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 14l6-6 6 6" />
      </ChevronIcon>
    </ScrollButton>
  );
}
