import { motion } from "framer-motion";
import styled from "styled-components";
import { Info, SearchCheck } from "lucide-react";

import type { ReportDetailMetric } from "../api/diagnosis.types";

// ===== 스타일 =====

const Card = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    border-color: rgba(152, 16, 250, 0.5);
    box-shadow: 0 0 25px rgba(152, 16, 250, 0.1);
    transform: translateY(-2px);
  }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 12px;
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const MetricKey = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray[500]};
  letter-spacing: 0.3px;
  text-transform: uppercase;
`;

const MetricTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MetricTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[50]};
  line-height: 28px;
  margin: 0;
  white-space: nowrap;
`;

const InfoWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

const InfoIcon = styled(Info)`
  width: 14px;
  height: 14px;
  color: ${({ theme }) => theme.colors.gray[600]};
  transition: color 0.2s ease;
`;

const Tooltip = styled.div`
  position: absolute;
  left: 50%;
  bottom: 100%;
  transform: translate(-50%, -4px);
  width: 208px;
  padding: 12px;
  background: rgba(26, 26, 26, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.gray[300]};
  font-size: 12px;
  line-height: 1.5;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.35);
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  z-index: 10;

  &::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -6px;
    width: 12px;
    height: 12px;
    background: rgba(26, 26, 26, 0.95);
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    transform: translateX(-50%) rotate(45deg);
  }
`;

const InfoHover = styled.div`
  display: inline-flex;
  align-items: center;

  &:hover ${InfoIcon} {
    color: ${({ theme }) => theme.colors.gray[50]};
  }

  &:hover ${Tooltip} {
    opacity: 1;
    visibility: visible;
    transform: translate(-50%, -12px);
  }
`;

const Percent = styled.span<{ $isHigh: boolean }>`
  font-size: 24px;
  font-weight: 700;
  color: ${({ $isHigh, theme }) =>
    $isHigh ? theme.colors.brand : theme.colors.gray[400]};
`;

const BarWrapper = styled.div`
  width: 100%;
  height: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 9999px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const BarFill = styled(motion.div)<{ $isHigh: boolean }>`
  height: 100%;
  border-radius: 9999px;
  background-color: ${({ $isHigh, theme }) =>
    $isHigh ? theme.colors.brand : theme.colors.gray[600]};
  box-shadow: ${({ $isHigh }) =>
    $isHigh ? "0 0 12px rgba(152, 16, 250, 0.5)" : "none"};
`;

const RangeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray[500]};
`;

const ResultBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const ResultText = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray[300]};
  line-height: 1.4;
`;

// ===== 컴포넌트 =====

interface MetricRangeIndicatorProps {
  metric: ReportDetailMetric;
  isOpen: boolean;
}

const MetricRangeIndicator = ({ metric, isOpen }: MetricRangeIndicatorProps) => {
  const isHigh = metric.percent > 50;
  const metricKeyLabel = metric.key.replace(/_/g, " ");

  return (
    <Card>
      <HeaderRow>
        <TitleGroup>
          <MetricKey>{metricKeyLabel}</MetricKey>
          <MetricTitleRow>
            <MetricTitle>{metric.label}</MetricTitle>
            <InfoHover>
              <InfoWrapper>
                <InfoIcon aria-hidden="true" />
                <Tooltip>{metric.description}</Tooltip>
              </InfoWrapper>
            </InfoHover>
          </MetricTitleRow>
        </TitleGroup>
        <Percent $isHigh={isHigh}>{metric.percent}</Percent>
      </HeaderRow>

      <BarWrapper>
        <BarFill
          $isHigh={isHigh}
          initial={{ width: 0 }}
          animate={{ width: isOpen ? `${metric.percent}%` : 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </BarWrapper>

      <RangeLabels>
        <span>{metric.rangeMeta.leftLabel}</span>
        <span>{metric.rangeMeta.rightLabel}</span>
      </RangeLabels>

      <ResultBox>
        <SearchCheck size={20} color="#9810FA" />
        <ResultText>{metric.analysis.resultText}</ResultText>
      </ResultBox>
    </Card>
  );
};

export default MetricRangeIndicator;
