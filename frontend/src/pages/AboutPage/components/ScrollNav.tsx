import styled from "styled-components";

import type { SectionId } from "@/pages/AboutPage/hooks/useScrollSpy";

interface ScrollNavProps {
  sectionIds: readonly SectionId[];
  progress: number;
  activeId: SectionId;
}

const ScrollNavWrap = styled.aside`
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 50;
  display: none;
  width: 1rem;
  height: 12.5rem;
  align-items: center;

  @media (min-width: 1024px) {
    display: flex;
    flex-direction: column;
  }
`;

const NavRail = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
`;

const NavProgress = styled.div<{ $progress: number }>`
  position: absolute;
  top: 0;
  width: 2px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.brand};
  transform-origin: top;
  transform: scaleY(${({ $progress }) => $progress});
  height: 100%;
  transition: transform 75ms ease-out;
`;

const DotList = styled.div`
  position: relative;
  z-index: 2;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const NavDot = styled.button<{ $active: boolean }>`
  width: 1rem;
  height: 1rem;
  border-radius: 999px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: ${({ theme }) => theme.colors.primary};
  transition:
    border-color 200ms ease,
    box-shadow 200ms ease,
    background 200ms ease;
  cursor: pointer;
  padding: 0;

  &:hover {
    border-color: ${({ theme }) => theme.colors.brand};
  }

  ${({ $active, theme }) =>
    $active
      ? `
    background: ${theme.colors.brand};
    border-color: ${theme.colors.brand};
    box-shadow: 0 0 18px rgba(152, 16, 250, 0.55);
  `
      : ""}
`;

export const ScrollNav = ({ sectionIds, progress, activeId }: ScrollNavProps) => {
  const handleDotClick = (id: SectionId) => () => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <ScrollNavWrap aria-label="Section navigation">
      <NavRail />
      <NavProgress $progress={progress} />
      <DotList>
        {sectionIds.map((id) => (
          <NavDot
            key={id}
            type="button"
            onClick={handleDotClick(id)}
            $active={activeId === id}
            aria-current={activeId === id ? "true" : "false"}
            aria-label={`${id} section`}
          />
        ))}
      </DotList>
    </ScrollNavWrap>
  );
};
