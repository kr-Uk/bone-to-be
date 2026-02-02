import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import styled from "styled-components";

import MetricRangeIndicator from "./MetricRangeIndicator";

import type { ReportDetailMetric } from "../api/diagnosis.types";

import { useMediaQuery } from "@/shared/hooks/useMediaQuery";

// ===== 상수 =====

const DISPLAY_STEPS = {
  mobile: [3, 7], // 3 → 7 → 전체
  desktop: [6], // 6 → 전체
} as const;

// ===== 스타일 컴포넌트 =====

const SectionContainer = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  scroll-margin-top: ${({ theme }) => theme.spacing.xxl};
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.heading.lg.fontSize};
  font-weight: ${({ theme }) => theme.typography.heading.lg.fontWeight};
  color: ${({ theme }) => theme.colors.gray[100]};
  margin: 0;

  @media (min-width: 768px) {
    font-size: ${({ theme }) => theme.typography.heading["2xl"].fontSize};
  }
`;

const SectionDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.body.lg.regular.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.lg.regular.fontWeight};
  color: ${({ theme }) => theme.colors.gray[400]};
  line-height: 1.6;
  margin: 0;

  @media (min-width: 768px) {
    font-size: ${({ theme }) => theme.typography.body.lg.medium.fontSize};
  }
`;

const MetricsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing.xl};
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing.xxl};
  }
`;

const ToggleButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

interface ArrowIconProps {
  $isOpen: boolean;
}

const ToggleButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  background-color: ${({ theme }) => theme.colors.brand};
  color: ${({ theme }) => theme.colors.gray[50]};
  font-size: ${({ theme }) => theme.typography.body.md.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.md.semibold.fontWeight};
  border: none;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.purple[700]};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.purple[800]};
  }

  @media (min-width: 768px) {
    font-size: ${({ theme }) => theme.typography.body.lg.semibold.fontSize};
    padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.xxl}`};
  }
`;

const ArrowIcon = styled.span<ArrowIconProps>`
  font-size: 0.875rem;
  transition: transform 0.3s ease;
  transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0deg)")};
`;

const ProgressBadge = styled.span`
  font-size: ${({ theme }) => theme.typography.body.sm.regular.fontSize};
  color: ${({ theme }) => theme.colors.gray[300]};
  margin-left: ${({ theme }) => theme.spacing.xs};
  opacity: 0.8;
`;

// ===== 헬퍼 함수 =====

interface ButtonTextConfig {
  displayStep: number;
  stepsLength: number;
  nextStepCount: number;
}

function getButtonText({ displayStep, stepsLength, nextStepCount }: ButtonTextConfig): string {
  // 전체 표시 상태
  if (displayStep === stepsLength) {
    return "접기";
  }

  // 마지막 단계 전 (전체보기로 가는 버튼)
  if (displayStep === stepsLength - 1) {
    return `나머지 ${nextStepCount}개 전체보기`;
  }

  // 중간 단계 (더보기 버튼)
  return `${nextStepCount}개 더보기`;
}

function getProgressText(
  displayStep: number,
  stepsLength: number,
  currentDisplayCount: number,
  metricsLength: number,
): string {
  // 전체 표시 시 진행 상황 숨김
  return displayStep === stepsLength ? "" : `(${currentDisplayCount}/${metricsLength})`;
}

// ===== 메인 컴포넌트 =====

interface AnalysisDetailsSectionProps {
  metrics: ReportDetailMetric[];
}

const AnalysisDetailsSection = ({ metrics }: AnalysisDetailsSectionProps) => {
  // 빈 배열 처리
  if (!metrics || metrics.length === 0) {
    return null;
  }

  // 상태 관리
  const [displayStep, setDisplayStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const prevDisplayCountRef = useRef(0);

  // 반응형 브레이크포인트
  const isTabletOrDesktop = useMediaQuery("(min-width: 768px)");

  // 단계별 표시 개수 설정
  const steps = isTabletOrDesktop ? DISPLAY_STEPS.desktop : DISPLAY_STEPS.mobile;
  const stepsWithFinal = [...steps, metrics.length]; // 마지막 단계는 전체
  const currentDisplayCount = stepsWithFinal[displayStep];
  const displayedMetrics = metrics.slice(0, currentDisplayCount);

  // 다음 단계에서 추가될 개수
  const nextStepCount =
    displayStep < stepsWithFinal.length - 1
      ? stepsWithFinal[displayStep + 1] - currentDisplayCount
      : 0;

  // 더보기 버튼 표시 여부
  const shouldShowButton = metrics.length > steps[0];

  // 버튼 텍스트 생성
  const buttonText = getButtonText({
    displayStep,
    stepsLength: stepsWithFinal.length - 1,
    nextStepCount,
  });

  const progressText = getProgressText(
    displayStep,
    stepsWithFinal.length - 1,
    currentDisplayCount,
    metrics.length,
  );

  // 토글 핸들러
  const handleToggle = () => {
    if (displayStep === stepsWithFinal.length - 1) {
      // 접기: 초기 상태로
      setDisplayStep(0);

      // 섹션 상단으로 스크롤
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }, 100);
    } else {
      // 다음 단계로
      setDisplayStep((prev) => prev + 1);
    }
  };

  // Phase 2: 새 콘텐츠로 스크롤 조정
  useEffect(() => {
    // 더보기 클릭으로 콘텐츠가 추가된 경우
    if (currentDisplayCount > prevDisplayCountRef.current && prevDisplayCountRef.current > 0) {
      // 새로 추가된 첫 번째 항목 찾기
      const newItemIndex = prevDisplayCountRef.current;
      const newItemElement = document.querySelector(`[data-metric-index="${newItemIndex}"]`);

      if (newItemElement) {
        // 새 콘텐츠로 부드럽게 스크롤 (애니메이션 시간 고려)
        setTimeout(() => {
          newItemElement.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "nearest",
          });
        }, 400); // stagger 애니메이션 완료 대기
      }
    }

    // 현재 표시 개수 저장
    prevDisplayCountRef.current = currentDisplayCount;
  }, [currentDisplayCount]);

  return (
    <SectionContainer ref={sectionRef}>
      <SectionHeader>
        <SectionTitle>상세 골격 분석</SectionTitle>
        <SectionDescription>
          11가지 주요 지표를 통해 당신의 골격 특성을 분석했어요.
        </SectionDescription>
      </SectionHeader>

      <MetricsGrid id="metrics-grid" role="region" aria-label="골격 분석 메트릭 목록">
        {displayedMetrics.map((metric, index) => {
          // 이미 표시되었던 항목인지 확인
          const wasVisible = index < prevDisplayCountRef.current;

          // 새로운 항목의 인덱스 계산 (0부터 시작)
          const newItemIndex = index - prevDisplayCountRef.current;

          // Stagger delay 계산: 새 항목만 0.1초 간격으로 지연
          const delay = wasVisible ? 0 : Math.max(0, newItemIndex) * 0.1;

          return (
            <motion.div
              key={metric.key}
              initial={
                wasVisible
                  ? { y: 0, scale: 1 } // 기존 항목: 애니메이션 없음
                  : { y: 20, scale: 0.95 } // 새 항목: 시작 위치
              }
              animate={{ y: 0, scale: 1 }} // 최종 위치
              transition={{
                duration: 0.4, // 400ms 애니메이션
                delay, // 계산된 지연
                ease: "easeOut", // 부드러운 감속 곡선
              }}
              data-metric-index={index}
            >
              <MetricRangeIndicator metric={metric} />
            </motion.div>
          );
        })}
      </MetricsGrid>

      {shouldShowButton && (
        <ToggleButtonContainer>
          <ToggleButton
            onClick={handleToggle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`${metrics.length}개 메트릭 중 ${currentDisplayCount}개 표시 중. ${buttonText}`}
            aria-expanded={displayStep === stepsWithFinal.length - 1}
            aria-controls="metrics-grid"
          >
            {buttonText}
            <ArrowIcon $isOpen={displayStep === stepsWithFinal.length - 1}>▼</ArrowIcon>
            {progressText && <ProgressBadge>{progressText}</ProgressBadge>}
          </ToggleButton>
        </ToggleButtonContainer>
      )}
    </SectionContainer>
  );
};

export default AnalysisDetailsSection;
