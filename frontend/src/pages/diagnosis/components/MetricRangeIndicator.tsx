import { motion } from "framer-motion";
import styled from "styled-components";

import type { ReportDetailMetric, SkeletonType } from "../api/diagnosis.types";

// ===== 유틸리티 함수 =====

/**
 * Zone 너비 계산 (백분율)
 */
function calculateZoneWidths(
  zones: ReportDetailMetric["zones"],
  rangeMeta: ReportDetailMetric["rangeMeta"],
): number[] {
  const totalRange = rangeMeta.max - rangeMeta.min;
  return zones.map((zone, index) => {
    const prevMax = index === 0 ? rangeMeta.min : zones[index - 1].max;
    const zoneRange = zone.max - prevMax;
    return (zoneRange / totalRange) * 100;
  });
}

/**
 * 현재 값 위치 계산 (백분율)
 */
function calculateValuePosition(score: number, rangeMeta: ReportDetailMetric["rangeMeta"]): number {
  const { min, max } = rangeMeta;
  const clampedScore = Math.max(min, Math.min(max, score));
  return ((clampedScore - min) / (max - min)) * 100;
}

/**
 * SkeletonType별 색상 반환
 */
function getSkeletonColor(type: SkeletonType): string {
  const colorMap: Record<SkeletonType, string> = {
    STRAIGHT: "#9810FA", // theme.colors.brand (Purple-600)
    NATURAL: "#A1A1A1", // theme.colors.gray[400]
    WAVE: "#EC4899", // Pink-500
  };
  return colorMap[type];
}

// ===== 스타일 컴포넌트 =====

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.gray[900]};
  border-radius: 12px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Label = styled.p`
  font-size: ${({ theme }) => theme.typography.body.md.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.md.semibold.fontWeight};
  color: ${({ theme }) => theme.colors.gray[200]};
  margin: 0;
`;

const CurrentValue = styled.p`
  font-size: ${({ theme }) => theme.typography.body.lg.medium.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.lg.medium.fontWeight};
  color: ${({ theme }) => theme.colors.brand};
  margin: 0;
`;

const RangeBarContainer = styled.div`
  width: 100%;
  position: relative;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const RangeBar = styled.div`
  display: flex;
  width: 100%;
  height: 24px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
`;

interface ZoneSegmentProps {
  $width: number;
  $color: string;
}

const ZoneSegment = styled.div<ZoneSegmentProps>`
  width: ${({ $width }) => $width}%;
  height: 100%;
  background-color: ${({ $color }) => $color}4D;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &:not(:last-child)::after {
    content: "";
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 1px;
    background-color: ${({ theme }) => theme.colors.gray[700]};
  }
`;

const ZoneLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.body.sm.regular.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.sm.regular.fontWeight};
  color: ${({ theme }) => theme.colors.gray[50]};
  z-index: 1;
`;

interface ValueMarkerProps {
  $position: number;
}

const ValueMarker = styled.div<ValueMarkerProps>`
  position: absolute;
  left: ${({ $position }) => $position}%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const MarkerDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.brand};
  box-shadow:
    0 0 0 4px rgba(152, 16, 250, 0.2),
    0 2px 8px rgba(0, 0, 0, 0.3);
`;

const MarkerLabel = styled.span`
  position: absolute;
  top: -24px;
  font-size: ${({ theme }) => theme.typography.body.sm.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.sm.semibold.fontWeight};
  color: ${({ theme }) => theme.colors.brand};
  white-space: nowrap;
`;

const RangeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const RangeLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.body.sm.regular.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.sm.regular.fontWeight};
  color: ${({ theme }) => theme.colors.gray[400]};
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.body.sm.regular.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.sm.regular.fontWeight};
  color: ${({ theme }) => theme.colors.gray[400]};
  line-height: 1.5;
  margin: 0;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const ResultText = styled.p`
  font-size: ${({ theme }) => theme.typography.body.md.medium.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.md.medium.fontWeight};
  color: ${({ theme }) => theme.colors.gray[200]};
  margin: 0;
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

// ===== 메인 컴포넌트 =====

interface MetricRangeIndicatorProps {
  metric: ReportDetailMetric;
}

const MetricRangeIndicator = ({ metric }: MetricRangeIndicatorProps) => {
  // 각 zone의 너비 계산 (percentage)
  const zoneWidths = calculateZoneWidths(metric.zones, metric.rangeMeta);

  // 현재 값의 위치 계산 (percentage)
  const valuePosition = calculateValuePosition(metric.score, metric.rangeMeta);

  // Zone별 색상 매핑
  const zoneColors = metric.zones.map((zone) => getSkeletonColor(zone.skeletonType));

  return (
    <Container>
      <Header>
        <Label>{metric.label}</Label>
        <CurrentValue>{metric.percent}%</CurrentValue>
      </Header>

      <RangeBarContainer>
        <RangeBar role="img" aria-label={`${metric.label} 범위 표시`}>
          {metric.zones.map((zone, index) => (
            <ZoneSegment key={zone.label} $width={zoneWidths[index]} $color={zoneColors[index]}>
              <ZoneLabel>{zone.label}</ZoneLabel>
            </ZoneSegment>
          ))}
        </RangeBar>

        <ValueMarker $position={valuePosition}>
          <MarkerLabel>{metric.percent}%</MarkerLabel>
          <MarkerDot />
        </ValueMarker>
      </RangeBarContainer>

      <RangeLabels>
        <RangeLabel>{metric.rangeMeta.leftLabel}</RangeLabel>
        <RangeLabel>{metric.rangeMeta.rightLabel}</RangeLabel>
      </RangeLabels>

      <Description>{metric.description}</Description>
      <ResultText>{metric.analysis.resultText}</ResultText>
    </Container>
  );
};

export default MetricRangeIndicator;
