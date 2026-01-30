import { useEffect, useRef } from "react";
import styled, { css, keyframes } from "styled-components";
import { CheckCircle, MoveHorizontal } from "lucide-react";

import type { AppTheme } from "@/shared/styles/theme";
import type { SectionId } from "@/pages/AboutPage/hooks/useScrollSpy";
import { createUltimateMannequin } from "@/pages/AboutPage/three/createUltimateMannequin";

interface TypeSectionProps {
  id: SectionId;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  reverse?: boolean;
}

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

const floatIcon = keyframes`
  0%, 100% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
`;

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  margin-bottom: 5rem;

  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

const TwoCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4rem;
  align-items: center;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 6rem;
  }
`;

const Col = styled.div<{ $orderMobile: number; $orderDesktop: number }>`
  width: 100%;
  order: ${({ $orderMobile }) => $orderMobile};

  @media (min-width: 768px) {
    width: 50%;
    order: ${({ $orderDesktop }) => $orderDesktop};
  }
`;

const OutlineNumber = styled.div`
  font-size: 6rem;
  font-weight: 900;
  color: #9810FA;

  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.2);
  line-height: 1;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    font-size: 8rem;
  }
`;

const Heading = styled.h2`
  margin: 0 0 0.5rem;
  font-size: 2.25rem;
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.02em;

  @media (min-width: 768px) {
    font-size: 3rem;
  }
`;

const Sub = styled.p`
  margin: 0 0 2rem;
  color: ${({ theme }) => theme.colors.brand};
  font-weight: 800;
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
`;

const BodyText = styled.p`
  margin: 0 0 1.5rem;
  ${withTypography((theme) => theme.typography.body.lg.regular)};
  font-size: 1.125rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.gray[300]};
`;

const Ul = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.75rem;
`;

const Li = styled.li`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  ${withTypography((theme) => theme.typography.body.sm.medium)};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray[400]};

  svg {
    flex: 0 0 auto;
    color: ${({ theme }) => theme.colors.brand};
  }
`;

const CanvasWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const CanvasContainer = styled.div`
  width: 100%;
  height: 500px;
  position: relative;
  border-radius: 2rem;
  overflow: hidden;
  cursor: grab;
  border: 1px solid rgba(152, 16, 250, 0.12);
  background: ${({ theme }) =>
    `radial-gradient(circle at center, rgba(152, 16, 250, 0.05) 0%, ${theme.colors.primary} 80%)`};

  &:active {
    cursor: grabbing;
  }
`;

const CanvasOverlay = styled.div`
  position: absolute;
  bottom: 1.25rem;
  left: 0;
  width: 100%;
  text-align: center;
  pointer-events: none;
  z-index: 10;
`;

const DragBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(12px);
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.7rem;

  svg {
    width: 1rem;
    height: 1rem;
    animation: ${floatIcon} 2s ease-in-out infinite;
  }
`;

const CanvasStage = ({ type }: { type: SectionId }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const cleanup = createUltimateMannequin(type, containerRef.current);
    return () => cleanup();
  }, [type]);

  return (
    <CanvasContainer ref={containerRef}>
      <CanvasOverlay>
        <DragBadge>
          <MoveHorizontal />
          Drag to rotate
        </DragBadge>
      </CanvasOverlay>
    </CanvasContainer>
  );
};

export const TypeSection = ({
  id,
  index,
  title,
  subtitle,
  description,
  bullets,
  reverse = false,
}: TypeSectionProps) => {
  const textOrderDesktop = reverse ? 2 : 1;
  const canvasOrderDesktop = reverse ? 1 : 2;
  const textOrderMobile = 2;
  const canvasOrderMobile = 1;
  const lines = description.split("\n");

  return (
    <Section id={id}>
      <TwoCol>
        <Col $orderMobile={textOrderMobile} $orderDesktop={textOrderDesktop}>
          <OutlineNumber>{index}</OutlineNumber>
          <Heading>{title}</Heading>
          <Sub>{subtitle}</Sub>
          <BodyText>
            {lines.map((line, idx) => (
              <span key={`${id}-line-${idx}`}>
                {line}
                {idx < lines.length - 1 && <br />}
              </span>
            ))}
          </BodyText>
          <Ul>
            {bullets.map((item) => (
              <Li key={`${id}-bullet-${item}`}>
                <CheckCircle size={20} />
                {item}
              </Li>
            ))}
          </Ul>
        </Col>

        <Col $orderMobile={canvasOrderMobile} $orderDesktop={canvasOrderDesktop}>
          <CanvasWrap>
            <CanvasStage type={id} />
          </CanvasWrap>
        </Col>
      </TwoCol>
    </Section>
  );
};
