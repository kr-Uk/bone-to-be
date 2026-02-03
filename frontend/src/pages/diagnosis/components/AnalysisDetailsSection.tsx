import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import styled from "styled-components";
import { ChevronDown } from "lucide-react";

import MetricRangeIndicator from "./MetricRangeIndicator";

import type { ReportDetailMetric } from "../api/diagnosis.types";


// ===== 상수 =====

const METRIC_GROUPS = [
  {
    key: "line",
    title: "Line Specs",
    keys: ["shoulder_slope_angle", "waist_curvature_index", "linearity_index"],
  },
  {
    key: "volume",
    title: "Volume Specs",
    keys: [
      "shoulder_width_index",
      "hip_width_index",
      "upper_body_depth_index",
      "ribcage_volume_index",
      "joint_thickness_index",
    ],
  },
  {
    key: "balance",
    title: "Balance Specs",
    keys: ["shoulder_hip_ratio", "arm_torso_ratio", "leg_length_index"],
  },
] as const;

// ===== 스타일 컴포넌트 =====

const SectionContainer = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  scroll-margin-top: ${({ theme }) => theme.spacing.xxl};
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

const AccordionContainer = styled.div`
  width: 100%;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.gray[800]};
  background: ${({ theme }) => theme.colors.gray[900]};
  overflow: hidden;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
`;

interface ArrowIconProps {
  $isOpen: boolean;
}

const AccordionHint = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px ${({ theme }) => theme.spacing.sm};
  border-radius: 999px;
  background-color: rgba(255, 255, 255, 0.08);
  color: ${({ theme }) => theme.colors.gray[400]};
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s ease;
`;

const AccordionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.xl}`};
  background: rgba(255, 255, 255, 0.04);
  color: ${({ theme }) => theme.colors.gray[50]};
  border: none;
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.25);
  transition: background-color 0.2s ease, border-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.16);
  }

  &:hover ${AccordionHint} {
    color: ${({ theme }) => theme.colors.brand};
    background-color: rgba(152, 16, 250, 0.2);
  }

  @media (min-width: 768px) {
    padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.xxl}`};
  }
`;

const AccordionTitle = styled.h2`
  font-size: 20px;
  font-weight: ${({ theme }) => theme.typography.heading.lg.fontWeight};
  color: ${({ theme }) => theme.colors.gray[50]};
  line-height: 32px;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 32px;
  }

  @media (min-width: 1024px) {
    font-size: 36px;
  }
`;

const AccordionTitleRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const AccordionMeta = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
`;

const MetricCount = styled.span`
  font-size: 16px;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.gray[300]};
`;

const ArrowIcon = styled(ChevronDown)<ArrowIconProps>`
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.colors.gray[500]};
  transition: transform 0.3s ease;
  transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0deg)")};
`;

const AccordionContent = styled(motion.div)`
  overflow: hidden;
  padding: 48px ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.xl};
`;

const GroupSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  padding-top: ${({ theme }) => theme.spacing.lg};

  &:first-child {
    padding-top: 0;
  }
`;

const GroupTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.body.lg.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.lg.semibold.fontWeight};
  color: ${({ theme }) => theme.colors.gray[100]};
  margin: 0;
`;

function groupMetrics(metrics: ReportDetailMetric[]) {
  const groups = METRIC_GROUPS.map((group) => ({
    ...group,
    metrics: metrics.filter((metric) =>
      (group.keys as readonly string[]).includes(metric.key),
    ),
  }));

  const groupedKeys = new Set<string>(
    METRIC_GROUPS.flatMap((group) => group.keys as readonly string[]),
  );
  const remaining = metrics.filter((metric) => !groupedKeys.has(metric.key));

  return remaining.length > 0
    ? [
        ...groups,
        {
          key: "others",
          title: "기타",
          keys: [],
          metrics: remaining,
        },
      ]
    : groups;
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
  const [isOpen, setIsOpen] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const groupedMetrics = groupMetrics(metrics);
  const metricCountLabel = `측정된 데이터를 기반으로 분석된 ${metrics.length}가지 상세 지표입니다.`;

  return (
    <SectionContainer ref={sectionRef}>
      <AccordionContainer>
        <AccordionButton
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls="metrics-accordion-content"
        >
          <AccordionTitleRow>
            <AccordionTitle>상세 수치 분석</AccordionTitle>
            <MetricCount>{metricCountLabel}</MetricCount>
          </AccordionTitleRow>
          <AccordionMeta>
            <AccordionHint>{isOpen ? "Click to hide" : "Click to view"}</AccordionHint>
            <ArrowIcon $isOpen={isOpen} aria-hidden="true" />
          </AccordionMeta>
        </AccordionButton>

        <AnimatePresence initial={false}>
          {isOpen && (
            <AccordionContent
              id="metrics-accordion-content"
              role="region"
              aria-label="골격 분석 메트릭 목록"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {groupedMetrics.map((group) => (
                <GroupSection key={group.key}>
                  <GroupTitle>{group.title}</GroupTitle>
                  <MetricsGrid role="list" aria-label={`${group.title} 메트릭 목록`}>
                    {group.metrics.map((metric) => (
                      <motion.div
                        key={metric.key}
                        initial={{ y: 16, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <MetricRangeIndicator metric={metric} isOpen={isOpen} />
                      </motion.div>
                    ))}
                  </MetricsGrid>
                </GroupSection>
              ))}
            </AccordionContent>
          )}
        </AnimatePresence>
      </AccordionContainer>
    </SectionContainer>
  );
};

export default AnalysisDetailsSection;
