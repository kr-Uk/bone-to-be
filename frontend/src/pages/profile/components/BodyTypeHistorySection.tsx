import { useEffect, useRef, useState } from "react";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import styled from "styled-components";

import { applySmoothing, getBodyTypeBadge, getBodyTypeLabels } from "../hooks/useBodyTypeChart";

import { Stack, Text } from "./ProfileCommon";

import type { BodyTypeHistoryItem } from "../api/profile.types";
import type { CSSProperties } from "react";

import TriangleChart from "@/shared/components/charts/TriangleChart/TriangleChart";

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2.46rem;

  @media (max-width: 768px) {
    gap: clamp(1.5rem, 5vw, 2.46rem);
  }
`;

const SectionHeader = styled(Stack)`
  gap: 0.604375rem;
`;

const Title = styled(Text)`
  color: var(--neutral-50, #fafafa);
  font-size: 1.875rem;
  font-weight: 700;
  line-height: 2.5rem;

  @media (max-width: 768px) {
    font-size: clamp(1.5rem, 5vw, 1.875rem);
    line-height: clamp(2rem, 6vw, 2.5rem);
  }
`;

const Subtitle = styled(Text)`
  color: var(--neutral-500, #737373);
  font-size: 1.09375rem;
  font-weight: 400;
  line-height: 1.5625rem;

  @media (max-width: 768px) {
    font-size: clamp(0.9rem, 3.5vw, 1.09375rem);
    line-height: clamp(1.25rem, 4.5vw, 1.5625rem);
  }
`;

const Carousel = styled.div`
  display: flex;
  align-items: center;
  gap: 1.51875rem;

  @media (max-width: 768px) {
    gap: clamp(0.75rem, 3vw, 0.9375rem);
  }
`;

const ArrowButton = styled.button`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--neutral-900, #171717);
  outline: 0.0625rem var(--neutral-600, #525252) solid;
  outline-offset: -0.0625rem;
  color: var(--neutral-500, #737373);
  transition:
    background 0.2s ease,
    color 0.2s ease,
    outline-color 0.2s ease;

  &:hover {
    background: var(--color-bg-brand, #9810fa);
    color: var(--neutral-50, #fafafa);
    outline: none;
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

const Track = styled.div`
  flex: 1;
  display: flex;
  gap: 1.51875rem;
  overflow-x: auto;
  scroll-snap-type: x proximity;
  scrollbar-width: none;
  -ms-overflow-style: none;
  cursor: grab;
  user-select: none;
  touch-action: pan-x;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 0;
    display: none;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--neutral-600, #525252);
    border-radius: 624.9375rem;
  }
`;

const Card = styled.article<{ $highlight?: boolean; $dimmed?: boolean }>`
  min-width: 18rem;
  height: 24rem;
  background: var(--neutral-800, #262626);
  border-radius: 0.9375rem;
  outline: 0.0625rem var(--neutral-600, #525252) solid;
  outline-offset: -0.0625rem;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: inherit;
  scroll-snap-align: center;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  --accent-color: ${({ theme }) => theme.colors.purple[600]};
  --accent-fill: ${({ theme }) => theme.colors.purple[900]};
  --accent-text: ${({ theme }) => theme.colors.purple[600]};

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    box-shadow: inset 0 0 4.5rem rgba(0, 0, 0, 0.65);
    opacity: var(--dim-alpha, 0);
    pointer-events: none;
    transition: opacity 0.2s ease;
  }

  @media (max-width: 768px) {
    min-width: clamp(14rem, 78vw, 18rem);
    height: clamp(20rem, 85vw, 24rem);
  }
`;

const LatestBadge = styled.span`
  position: absolute;
  top: 1.3125rem;
  left: 1.3125rem;
  padding: 0.3125rem 0.625rem;
  background: var(--color-bg-brand, #9810fa);
  color: var(--neutral-50, #fafafa);
  font-size: 0.625rem;
  font-weight: 700;
  line-height: 0.9375rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border-radius: 0.15625rem;
  box-shadow:
    0 0.25rem 0.375rem -0.25rem rgba(0, 0, 0, 0.1),
    0 0.625rem 0.9375rem -0.1875rem rgba(0, 0, 0, 0.1);
`;

const CardBody = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const Preview = styled.div`
  width: 16rem;
  height: 16rem;
  position: relative;

  @media (max-width: 768px) {
    width: clamp(14rem, 62vw, 16rem);
    height: clamp(14rem, 62vw, 16rem);
  }
`;

const ProfileTriangleChart = styled(TriangleChart)`
  width: 16rem;
  height: 16rem;
  max-width: none;

  canvas {
    width: 100% !important;
    height: 100% !important;
  }
`;

const CardFooter = styled.div`
  padding: 1.875rem;
  border-top: 0.041875rem var(--neutral-600, #525252) solid;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

const FooterRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.625rem;
`;

const TypeTitle = styled(Text)`
  color: var(--neutral-50, #fafafa);
  font-size: 1.5625rem;
  font-weight: 700;
  line-height: 2.1875rem;
`;

const CodeText = styled(Text)`
  color: var(--accent-text);
  font-size: 0.9375rem;
  font-weight: 400;
  line-height: 1.25rem;
  font-family: Consolas;
`;

const DateText = styled(Text)`
  color: var(--neutral-600, #525252);
  font-size: 0.625rem;
  font-weight: 400;
  line-height: 0.9375rem;
  font-family: Consolas;
`;

const EmptyState = styled(Text)`
  color: var(--neutral-500, #737373);
  font-size: 1rem;
  line-height: 1.5rem;
  text-align: center;
  padding: 2.5rem 0;
  border-radius: 0.9375rem;
  background: var(--neutral-900, #171717);
  outline: 0.0625rem var(--neutral-600, #525252) solid;
  outline-offset: -0.0625rem;
`;

interface BodyTypeHistorySectionProps {
  history: BodyTypeHistoryItem[];
}

const BodyTypeHistorySection = ({ history }: BodyTypeHistorySectionProps) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [visibilityMap, setVisibilityMap] = useState<Record<string, number>>({});
  const isDraggingRef = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);
  const dragMovedRef = useRef(false);
  const inertiaRef = useRef<number | null>(null);
  const velocityRef = useRef(0);
  const lastMoveRef = useRef<{ x: number; time: number } | null>(null);
  const dragResistance = 0.6;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    const items = Array.from(track.querySelectorAll<HTMLElement>("[data-card-id]"));
    if (!items.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        setVisibilityMap((prev) => {
          const next = { ...prev };
          entries.forEach((entry) => {
            const id = entry.target.getAttribute("data-card-id");
            if (!id) {
              return;
            }

            next[id] = entry.intersectionRatio;
          });

          return next;
        });
      },
      {
        root: track,
        threshold: [0, 1],
      },
    );

    items.forEach((item) => observer.observe(item));

    return () => {
      observer.disconnect();
    };
  }, [history]);

  const getScrollOffset = () => {
    if (!trackRef.current) {
      return 0;
    }

    const card = trackRef.current.querySelector<HTMLElement>("[data-card-id]");
    const cardWidth = card?.getBoundingClientRect().width ?? 0;
    const styles = getComputedStyle(trackRef.current);
    const gapValue = styles.columnGap || styles.gap || "0";
    const gap = parseFloat(gapValue);

    return cardWidth + (Number.isNaN(gap) ? 0 : gap);
  };

  const scrollTrack = (direction: "left" | "right") => {
    if (!trackRef.current) {
      return;
    }

    const offset = getScrollOffset();
    if (!offset) {
      return;
    }

    trackRef.current.scrollBy({
      left: direction === "left" ? -offset : offset,
      behavior: "smooth",
    });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!trackRef.current) {
      return;
    }

    if (inertiaRef.current) {
      cancelAnimationFrame(inertiaRef.current);
      inertiaRef.current = null;
    }

    isDraggingRef.current = true;
    dragMovedRef.current = false;
    dragStartX.current = event.clientX;
    dragStartScroll.current = trackRef.current.scrollLeft;
    lastMoveRef.current = { x: event.clientX, time: performance.now() };
    velocityRef.current = 0;
    trackRef.current.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !trackRef.current) {
      return;
    }

    const delta = event.clientX - dragStartX.current;
    if (Math.abs(delta) > 3) {
      dragMovedRef.current = true;
    }
    trackRef.current.scrollLeft = dragStartScroll.current - delta * dragResistance;

    const now = performance.now();
    const last = lastMoveRef.current;
    if (last) {
      const moveDelta = event.clientX - last.x;
      const timeDelta = now - last.time || 1;
      velocityRef.current = (moveDelta * dragResistance) / timeDelta;
      lastMoveRef.current = { x: event.clientX, time: now };
    }
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!trackRef.current) {
      return;
    }

    isDraggingRef.current = false;
    trackRef.current.releasePointerCapture(event.pointerId);
    lastMoveRef.current = null;

    if (!dragMovedRef.current) {
      return;
    }

    const track = trackRef.current;
    const startVelocity = velocityRef.current;
    let lastTime = performance.now();

    const step = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      velocityRef.current *= 0.95;
      const delta = velocityRef.current * deltaTime;
      track.scrollLeft -= delta;

      if (Math.abs(velocityRef.current) > 0.02) {
        inertiaRef.current = requestAnimationFrame(step);
      } else {
        inertiaRef.current = null;
      }
    };

    if (Math.abs(startVelocity) > 0.03) {
      inertiaRef.current = requestAnimationFrame(step);
    }
  };

  return (
    <Section>
      <SectionHeader>
        <Title as="h2">나의 분석 리포트</Title>
        <Subtitle as="p">지난 체형 분석 데이터를 확인하세요.</Subtitle>
      </SectionHeader>
      {history.length ? (
        <Carousel>
        <ArrowButton type="button" aria-label="Scroll left" onClick={() => scrollTrack("left")}>
          <IoChevronBackOutline size={20} />
        </ArrowButton>
        <Track
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {history.map((item, index) => {
            const ratio = applySmoothing({
              natural: Number(item.ratio.natural),
              wave: Number(item.ratio.wave),
              straight: Number(item.ratio.straight),
            });
            const labels = getBodyTypeLabels(item.type);
            const badgeText = getBodyTypeBadge(item.type);
            const codeText = item.id.includes("-")
              ? item.id
              : `${badgeText.charAt(0)}-${index + 1}`;
            const hasVisibility = Object.keys(visibilityMap).length > 0;
            const intersectionRatio = visibilityMap[item.id] ?? 0;
            const isDimmed = hasVisibility ? intersectionRatio < 0.999 : false;
            const dimAlpha = isDimmed ? 0.75 : 0;

            return (
              <Card
                key={item.id}
                data-card-id={item.id}
                $highlight={item.isLatest}
                $dimmed={isDimmed}
                style={{ "--dim-alpha": dimAlpha } as CSSProperties}
              >
                {item.isLatest && <LatestBadge>LATEST</LatestBadge>}
                <CardBody>
                  <Preview>
                    <ProfileTriangleChart
                      data={[ratio.straight * 100, ratio.wave * 100, ratio.natural * 100]}
                      labels={[" ", " ", " "]}
                      customLabels={{
                        enabled: true,
                        alignments: ["center", "right", "left"],
                      }}
                      tooltip={{ enabled: false }}
                      animate={false}
                    />
                  </Preview>
                </CardBody>
                <CardFooter>
                  <FooterRow>
                    <TypeTitle as="span">{labels.title}</TypeTitle>
                    <CodeText as="span">{codeText}</CodeText>
                  </FooterRow>
                  {item.date && <DateText as="span">{item.date}</DateText>}
                </CardFooter>
              </Card>
            );
          })}
        </Track>
        <ArrowButton type="button" aria-label="Scroll right" onClick={() => scrollTrack("right")}>
          <IoChevronForwardOutline size={20} />
        </ArrowButton>
        </Carousel>
      ) : (
        <EmptyState as="p">분석 리포트가 없습니다.</EmptyState>
      )}
    </Section>
  );
};

export default BodyTypeHistorySection;
