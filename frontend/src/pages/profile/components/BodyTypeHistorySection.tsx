import { useEffect, useMemo, useRef, useState } from "react";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { MdOutlineClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { applySmoothing, getBodyTypeLabels } from "../hooks/useBodyTypeChart";

import { Stack, Text } from "./ProfileCommon";

import type { BodyTypeHistoryItem } from "../api/profile.types";
import type { CSSProperties } from "react";

import { useSetRepresentativeReport } from "@/pages/diagnosis/api";
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
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const HeaderText = styled(Stack)`
  gap: 0.604375rem;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const RepresentativeButton = styled.button`
  border: 0.0625rem solid var(--neutral-600, #525252);
  background: transparent;
  color: var(--neutral-50, #fafafa);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25rem;
  padding: 0.5rem 0.875rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: var(--neutral-800, #262626);
    border-color: var(--neutral-500, #737373);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
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
  cursor: pointer;
  scroll-snap-align: center;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  --accent-color: ${({ theme }) => theme.colors.purple[600]};
  --accent-fill: ${({ theme }) => theme.colors.purple[900]};
  --accent-text: ${({ theme }) => theme.colors.purple[600]};

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.purple[600]};
    outline-offset: 2px;
  }

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

const RepresentativeBadge = styled.span`
  position: absolute;
  top: 1.3125rem;
  right: 1.3125rem;
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
  pointer-events: none;
`;

const CardBody = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  pointer-events: none;
`;

const Preview = styled.div`
  width: 16rem;
  height: 16rem;
  position: relative;
  pointer-events: none;

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
  pointer-events: none;
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
  min-height: 9rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  z-index: 1300;
`;

const ModalCard = styled.div`
  width: min(36rem, 100%);
  background: var(--neutral-900, #171717);
  border: 0.0625rem solid var(--neutral-700, #404040);
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.45);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: var(--neutral-50, #fafafa);
  font-size: 1.125rem;
  font-weight: 700;
`;

const ModalCloseButton = styled.button`
  border: none;
  background: transparent;
  color: var(--neutral-400, #a3a3a3);
  width: 2rem;
  height: 2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: var(--neutral-50, #fafafa);
  }
`;

const ReportList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 0.25rem;

  &::-webkit-scrollbar {
    width: 0.375rem;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--neutral-700, #404040);
    border-radius: 9999px;
  }
`;

const ReportRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 0.625rem;
  background: var(--neutral-800, #262626);
  border: 0.0625rem solid var(--neutral-700, #404040);
`;

const ReportMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ReportType = styled(Text)`
  color: var(--neutral-50, #fafafa);
  font-size: 0.95rem;
  font-weight: 600;
`;

const ReportDate = styled(Text)`
  color: var(--neutral-500, #737373);
  font-size: 0.75rem;
  font-weight: 400;
`;

const ReportActionButton = styled.button<{ $active?: boolean }>`
  min-width: 7.5rem;
  border-radius: 0.5rem;
  border: 0.0625rem solid
    ${({ $active }) => ($active ? "var(--color-bg-brand, #9810fa)" : "var(--neutral-600, #525252)")};
  background: ${({ $active }) =>
    $active ? "var(--color-bg-brand, #9810fa)" : "transparent"};
  color: ${({ $active }) => ($active ? "var(--neutral-50, #fafafa)" : "var(--neutral-100, #f5f5f5)")};
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1rem;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;

  &:hover:not(:disabled) {
    border-color: var(--color-bg-brand, #9810fa);
    color: var(--neutral-50, #fafafa);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

interface BodyTypeHistorySectionProps {
  history: BodyTypeHistoryItem[];
}

const parseReportId = (value: string): number | null => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return null;
  }

  return numeric;
};

const BodyTypeHistorySection = ({ history }: BodyTypeHistorySectionProps) => {
  const navigate = useNavigate();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [visibilityMap, setVisibilityMap] = useState<Record<string, number>>({});
  const isDraggingRef = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);
  const dragMovedRef = useRef(false);
  const clickStartPositionRef = useRef<{ x: number; time: number } | null>(null);
  const inertiaRef = useRef<number | null>(null);
  const velocityRef = useRef(0);
  const lastMoveRef = useRef<{ x: number; time: number } | null>(null);
  const dragResistance = 0.6;
  const [isRepresentativeModalOpen, setIsRepresentativeModalOpen] = useState(false);
  const [settingReportId, setSettingReportId] = useState<number | null>(null);
  const { mutateAsync: setRepresentativeReport, isPending: isRepresentativePending } =
    useSetRepresentativeReport();
  const reportOrderMap = useMemo(() => {
    const entries = history.map((item, index) => ({
      id: item.id,
      numericId: parseReportId(item.id),
      order: index,
    }));

    const sorted = [...entries].sort((left, right) => {
      const leftHasId = left.numericId != null;
      const rightHasId = right.numericId != null;

      if (leftHasId && rightHasId) {
        const leftId = left.numericId;
        const rightId = right.numericId;
        if (leftId !== null && rightId !== null && leftId !== rightId) {
          return leftId - rightId;
        }
      }

      if (leftHasId !== rightHasId) {
        return leftHasId ? -1 : 1;
      }

      return left.order - right.order;
    });

    return sorted.reduce<Record<string, number>>((acc, entry, index) => {
      acc[entry.id] = index + 1;
      return acc;
    }, {});
  }, [history]);

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

  useEffect(() => {
    if (!isRepresentativeModalOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isRepresentativeModalOpen]);

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

  const handleOpenRepresentativeModal = () => {
    setIsRepresentativeModalOpen(true);
  };

  const handleCloseRepresentativeModal = () => {
    setIsRepresentativeModalOpen(false);
  };

  const handleSetRepresentative = async (reportId: number) => {
    if (!Number.isFinite(reportId)) {
      return;
    }

    setSettingReportId(reportId);
    try {
      await setRepresentativeReport({ reportId });
    } finally {
      setSettingReportId(null);
    }
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
    clickStartPositionRef.current = {
      x: event.clientX,
      time: performance.now(),
    };
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

    const wasDragging = dragMovedRef.current;

    // 클릭 처리: 드래그가 아니고 clickStartPositionRef가 있으면
    if (!wasDragging && clickStartPositionRef.current) {
      // pointer capture 때문에 event.target을 사용할 수 없음
      // 대신 마우스 위치에서 실제 요소를 찾음
      const elementAtPoint = document.elementFromPoint(event.clientX, event.clientY);
      const card = elementAtPoint?.closest("[data-card-id]");

      if (card) {
        const reportId = card.getAttribute("data-card-id");
        if (reportId) {
          // 상태 초기화
          dragMovedRef.current = false;
          clickStartPositionRef.current = null;

          // 네비게이션
          navigate(`/diagnosis/report/${reportId}`);
          return;
        }
      }

      // 상태 초기화
      dragMovedRef.current = false;
      clickStartPositionRef.current = null;
      return;
    }

    // 드래그인 경우: 상태 초기화 후 관성 스크롤
    dragMovedRef.current = false;
    clickStartPositionRef.current = null;

    if (!wasDragging) {
      return;
    }

    const track = trackRef.current;
    const startVelocity = velocityRef.current;
    let lastTime = performance.now();

    const step = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      velocityRef.current *= 0.97;
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

  const handleCardKeyDown = (event: React.KeyboardEvent, reportId: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigate(`/diagnosis/report/${reportId}`);
    }
  };

  return (
    <Section>
      <SectionHeader $direction="row" $align="center" $justify="space-between">
        <HeaderText>
          <Title as="h2">나의 분석 리포트</Title>
          <Subtitle as="p">지난 체형 분석 데이터를 확인하세요.</Subtitle>
        </HeaderText>
        <HeaderActions>
          <RepresentativeButton
            type="button"
            onClick={handleOpenRepresentativeModal}
            disabled={!history.length}
          >
            대표 리포트 설정
          </RepresentativeButton>
        </HeaderActions>
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
              const reportIndex = reportOrderMap[item.id] ?? index + 1;
              const codeText = `Report-${reportIndex}`;
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
                  tabIndex={0}
                  role="button"
                  aria-label={`${labels.title} 체형 리포트, ${item.date}, ${codeText}`}
                  onKeyDown={(e) => handleCardKeyDown(e, item.id)}
                >
                  {item.isLatest && <RepresentativeBadge>대표 리포트</RepresentativeBadge>}
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
      {isRepresentativeModalOpen && (
        <ModalOverlay onClick={handleCloseRepresentativeModal}>
          <ModalCard role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>대표 리포트 설정</ModalTitle>
              <ModalCloseButton
                type="button"
                aria-label="닫기"
                onClick={handleCloseRepresentativeModal}
              >
                <MdOutlineClose size={18} />
              </ModalCloseButton>
            </ModalHeader>
            <ReportList>
              {history.map((item, index) => {
                const reportId = parseReportId(item.id);
                const isRepresentative = item.isLatest;
                const isDisabled =
                  reportId === null ||
                  isRepresentative ||
                  (isRepresentativePending && settingReportId === reportId);
                const actionLabel = isRepresentative ? "대표 리포트" : "대표 리포트 설정";

                return (
                  <ReportRow key={`report-${item.id}-${index}`}>
                    <ReportMeta>
                      <ReportType as="span">{item.type}</ReportType>
                      <ReportDate as="span">{item.date}</ReportDate>
                    </ReportMeta>
                    <ReportActionButton
                      type="button"
                      $active={isRepresentative}
                      disabled={isDisabled}
                      onClick={() => {
                        if (reportId !== null) {
                          handleSetRepresentative(reportId);
                        }
                      }}
                    >
                      {actionLabel}
                    </ReportActionButton>
                  </ReportRow>
                );
              })}
            </ReportList>
          </ModalCard>
        </ModalOverlay>
      )}
    </Section>
  );
};

export default BodyTypeHistorySection;
