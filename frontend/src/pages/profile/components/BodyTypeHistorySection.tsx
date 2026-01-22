import styled from "styled-components";

import { applySmoothing, getBodyTypeLabels, toPoint, toVertex } from "../hooks/useBodyTypeChart";

import type { BodyTypeHistoryItem } from "../api/profile.types";

const Section = styled.section`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const SideDivider = styled.div`
  width: 21px;
  height: 50px;
  border: 2px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: 9999px;
`;

const Track = styled.div`
  flex: 1;
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  overflow-x: auto;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  scroll-snap-type: x proximity;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray[200]};
    border-radius: 9999px;
  }
`;

const Card = styled.article<{ $highlight?: boolean }>`
  min-width: 280px;
  height: 340px;
  border: 1px solid
    ${({ theme, $highlight }) => ($highlight ? theme.colors.text : theme.colors.border)};
  background: ${({ theme }) => theme.colors.secondary};
  display: flex;
  flex-direction: column;
  scroll-snap-align: start;
`;

const LatestBadge = styled.span`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm};
  left: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.typography.body.sm.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.sm.semibold.fontWeight};
  line-height: ${({ theme }) => theme.typography.body.sm.semibold.lineHeight};
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
`;

const CardBody = styled.div`
  flex: 1;
  background: ${({ theme }) => theme.colors.gray[50]};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const Preview = styled.div`
  width: 180px;
  height: 180px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PreviewSvg = styled.svg`
  width: 140px;
  height: 140px;
`;

const ChartTypeLabel = styled.text`
  fill: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.typography.body.sm.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.sm.semibold.fontWeight};
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const TriangleOutline = styled.polygon`
  fill: none;
  stroke: ${({ theme }) => theme.colors.gray[300]};
  stroke-width: 1.2;
  stroke-dasharray: 4 4;
`;

const TriangleFill = styled.polygon`
  fill: ${({ theme }) => theme.colors.primary};
  opacity: 0.12;
`;

const TriangleStroke = styled.polygon`
  fill: none;
  stroke: ${({ theme }) => theme.colors.primary};
  stroke-width: 1.6;
`;

const CardFooter = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TypeTitle = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.body.md.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.md.semibold.fontWeight};
  line-height: ${({ theme }) => theme.typography.body.md.semibold.lineHeight};
`;

const DateText = styled.span`
  color: ${({ theme }) => theme.colors.gray[400]};
  font-size: ${({ theme }) => theme.typography.body.sm.regular.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.sm.regular.fontWeight};
  line-height: ${({ theme }) => theme.typography.body.sm.regular.lineHeight};
`;

interface BodyTypeHistorySectionProps {
  history: BodyTypeHistoryItem[];
}

const BodyTypeHistorySection = ({ history }: BodyTypeHistorySectionProps) => {
  if (!history.length) {
    return null;
  }

  const center = { x: 50, y: 50 };
  const radius = 46;
  const vertexTop = toVertex(center, radius, -90);
  const vertexLeft = toVertex(center, radius, 150);
  const vertexRight = toVertex(center, radius, 30);

  return (
    <Section>
      <SideDivider aria-hidden="true" />
      <Track>
        {history.map((item) => {
          const ratio = applySmoothing(item.ratio);
          const topPoint = toPoint(vertexTop, center, ratio.natural);
          const leftPoint = toPoint(vertexLeft, center, ratio.wave);
          const rightPoint = toPoint(vertexRight, center, ratio.straight);
          const outlinePoints = `${vertexTop.x},${vertexTop.y} ${vertexLeft.x},${vertexLeft.y} ${vertexRight.x},${vertexRight.y}`;
          const innerPoints = `${topPoint.x},${topPoint.y} ${leftPoint.x},${leftPoint.y} ${rightPoint.x},${rightPoint.y}`;
          const labels = getBodyTypeLabels(item.type);
          const badgeText = /[a-zA-Z]/.test(labels.badge)
            ? labels.badge.toUpperCase()
            : labels.badge;
          const labelY = Math.max(vertexLeft.y, vertexRight.y) + 8;

          return (
            <Card key={item.id} $highlight={item.isLatest}>
              <CardBody>
                <Preview>
                  {item.isLatest && <LatestBadge>LATEST</LatestBadge>}
                  <PreviewSvg viewBox="0 0 100 100" role="img" aria-label="Body type chart">
                    <TriangleOutline points={outlinePoints} />
                    <TriangleFill points={innerPoints} />
                    <TriangleStroke points={innerPoints} />
                    <ChartTypeLabel x="50" y={labelY} textAnchor="middle" dominantBaseline="hanging">
                      {badgeText}
                    </ChartTypeLabel>
                  </PreviewSvg>
                </Preview>
              </CardBody>
              <CardFooter>
                <TypeTitle>{labels.title}</TypeTitle>
                {item.date && <DateText>{item.date}</DateText>}
              </CardFooter>
            </Card>
          );
        })}
      </Track>
      <SideDivider aria-hidden="true" />
    </Section>
  );
};

export default BodyTypeHistorySection;
