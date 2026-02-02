import { motion } from "framer-motion";
import styled from "styled-components";

import MetricRangeIndicator from "./MetricRangeIndicator";

import type { ReportDetailMetric } from "../api/diagnosis.types";

// ===== 스타일 컴포넌트 =====

const SectionContainer = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
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

// ===== 애니메이션 Variants =====

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

// ===== 메인 컴포넌트 =====

interface AnalysisDetailsSectionProps {
  metrics: ReportDetailMetric[];
}

const AnalysisDetailsSection = ({ metrics }: AnalysisDetailsSectionProps) => {
  // 빈 배열 처리
  if (!metrics || metrics.length === 0) {
    return null;
  }

  return (
    <SectionContainer>
      <SectionHeader>
        <SectionTitle>상세 골격 분석</SectionTitle>
        <SectionDescription>
          11가지 주요 지표를 통해 당신의 골격 특성을 분석했어요.
        </SectionDescription>
      </SectionHeader>

      <MetricsGrid
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {metrics.map((metric) => (
          <motion.div key={metric.key} variants={itemVariants}>
            <MetricRangeIndicator metric={metric} />
          </motion.div>
        ))}
      </MetricsGrid>
    </SectionContainer>
  );
};

export default AnalysisDetailsSection;
