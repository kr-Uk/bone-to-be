import { useEffect, useMemo, useState } from "react";
import type { ButtonHTMLAttributes } from "react";
import styled from "styled-components";

import { FabButton } from "./FabButton";

interface FeedFABProps {
  onClick: () => void;
  trackingProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "type" | "aria-label">;
}

const FeedFabButton = styled(FabButton)<{ $variant: "create" | "top" }>`
  width: 56px;
  height: 56px;
  font-size: 0;
  background-color: ${({ $variant, theme }) =>
    $variant === "create" ? theme.colors.brand : theme.colors.secondary};
  color: ${({ $variant, theme }) =>
    $variant === "create" ? theme.colors.secondary : theme.colors.primary};

  @media (max-width: 767px) {
    width: 48px;
    height: 48px;
  }
`;

const IconBase = styled.svg<{ $active: boolean }>`
  position: absolute;
  width: 24px;
  height: 24px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  transform: ${({ $active }) => ($active ? "scale(1)" : "scale(0.85)")};
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
`;

const PlusIcon = styled(IconBase)`
  stroke-width: 1.6;
`;

const ChevronIcon = styled(IconBase)`
  width: 22px;
  height: 22px;
  stroke-width: 1.4;
`;

export function FeedFAB({ onClick, trackingProps }: FeedFABProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY >= 300);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const buttonLabel = useMemo(
    () => (showScrollTop ? "페이지 상단으로 이동" : "Create new feed post"),
    [showScrollTop],
  );

  const handleClick = () => {
    if (showScrollTop) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    onClick();
  };

  return (
    <FeedFabButton
      {...trackingProps}
      $variant={showScrollTop ? "top" : "create"}
      type="button"
      onClick={handleClick}
      aria-label={buttonLabel}
    >
      <ChevronIcon
        viewBox="0 0 24 24"
        aria-hidden="true"
        $active={showScrollTop}
      >
        <path d="M6 14l6-6 6 6" />
      </ChevronIcon>
      <PlusIcon viewBox="0 0 24 24" aria-hidden="true" $active={!showScrollTop}>
        <path d="M12 5v14M5 12h14" />
      </PlusIcon>
    </FeedFabButton>
  );
}
