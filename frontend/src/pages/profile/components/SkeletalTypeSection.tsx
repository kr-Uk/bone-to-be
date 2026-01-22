import { CiLock } from "react-icons/ci";
import styled from "styled-components";

import { applySmoothing, getBodyTypeBadge, toPoint, toVertex } from "../hooks/useBodyTypeChart";

import type { BodyTypeRatio } from "../api/profile.types";

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const SectionHeader = styled.div`
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.heading.sm.fontSize};
  font-weight: ${({ theme }) => theme.typography.heading.sm.fontWeight};
  line-height: ${({ theme }) => theme.typography.heading.sm.lineHeight};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.typography.body.sm.regular.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.sm.regular.fontWeight};
  line-height: ${({ theme }) => theme.typography.body.sm.regular.lineHeight};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const Card = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xxl};
`;

const ChartWrap = styled.div`
  width: 192px;
  height: 192px;
  border-radius: 9999px;
  background: ${({ theme }) => theme.colors.secondary};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  box-shadow: 0 1px 2px ${({ theme }) => theme.colors.gray[200]};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChartInner = styled.div`
  width: 140px;
  height: 140px;
  position: relative;
`;

const ChartSvg = styled.svg`
  width: 100%;
  height: 100%;
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
  fill: ${({ theme }) => theme.colors.gray[900]};
  opacity: 0.15;
`;

const TriangleStroke = styled.polygon`
  fill: ${({ theme }) => theme.colors.gray[800]};
  stroke: ${({ theme }) => theme.colors.primary};
  stroke-width: 1.6;
`;

const Details = styled.div`
  flex: 1;
  min-height: 192px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const LatestBadge = styled.span`
  align-self: flex-start;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.typography.body.sm.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.sm.semibold.fontWeight};
  line-height: ${({ theme }) => theme.typography.body.sm.semibold.lineHeight};
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

const TypeTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.heading.lg.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.md.medium.fontWeight};
  line-height: ${({ theme }) => theme.typography.heading.lg.lineHeight};
`;

const TypeDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.typography.body.md.regular.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.md.regular.fontWeight};
  line-height: 1.6;
`;

const PrivateBadge = styled.div`
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.secondary};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;
const TypeTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;



const PrivateText = styled.span`
  color: ${({ theme }) => theme.colors.gray[400]};
  font-size: ${({ theme }) => theme.typography.body.sm.regular.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.sm.regular.fontWeight};
  line-height: ${({ theme }) => theme.typography.body.sm.regular.lineHeight};
`;

interface SkeletalTypeSectionProps {
  bodyType: string;
  bodyTypeRatio: BodyTypeRatio;
}

const formatBodyType = (value?: string) => {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    return "Natural Type";
  }

  const isKorean = /[가-힣]/.test(normalizedValue);
  const hasTypeSuffix = /type/i.test(normalizedValue);

  if (isKorean || hasTypeSuffix) {
    return normalizedValue;
  }

  return `${normalizedValue} Type`;
};

const SkeletalTypeSection = ({ bodyType, bodyTypeRatio }: SkeletalTypeSectionProps) => {
  const center = { x: 50, y: 50 };
  const radius = 46;
  const vertexTop = toVertex(center, radius, -90);
  const vertexLeft = toVertex(center, radius, 150);
  const vertexRight = toVertex(center, radius, 30);

  const smoothRatio = applySmoothing(bodyTypeRatio);
  const topPoint = toPoint(vertexTop, center, smoothRatio.natural);
  const leftPoint = toPoint(vertexLeft, center, smoothRatio.wave);
  const rightPoint = toPoint(vertexRight, center, smoothRatio.straight);
  const outlinePoints = `${vertexTop.x},${vertexTop.y} ${vertexLeft.x},${vertexLeft.y} ${vertexRight.x},${vertexRight.y}`;
  const innerPoints = `${topPoint.x},${topPoint.y} ${leftPoint.x},${leftPoint.y} ${rightPoint.x},${rightPoint.y}`;
  const typeTitle = formatBodyType(bodyType);
  const typeLabel = getBodyTypeBadge(bodyType);
  const labelY = Math.max(vertexLeft.y, vertexRight.y) + 8;

  return (
    <Section>
      <SectionHeader>
        <Title>Skeletal Type</Title>
        <Subtitle>이 유저의 최근 골격 진단 결과입니다.</Subtitle>
      </SectionHeader>
      <Card>
        <ChartWrap>
          <ChartInner>
            <ChartSvg viewBox="0 0 100 100" role="img" aria-label="Body type chart">
              <TriangleOutline points={outlinePoints} />
              <TriangleFill points={innerPoints} />
              <TriangleStroke points={innerPoints} />
              <ChartTypeLabel x="50" y={labelY} textAnchor="middle" dominantBaseline="hanging">
                {typeLabel}
              </ChartTypeLabel>
            </ChartSvg>
          </ChartInner>
        </ChartWrap>
        <Details>
          <LatestBadge>Latest Analysis</LatestBadge>

          <TypeTextGroup>
            <TypeTitle>{typeTitle}</TypeTitle>
            <TypeDescription>
              뼈대가 뚜렷하고 프레임이 단단한 체형.
              <br />
              루즈하고 자연스러운 실루엣이 가장 잘 어울립니다.
            </TypeDescription>
          </TypeTextGroup>

          <PrivateBadge>
            <CiLock />
            <PrivateText>Detailed report is private</PrivateText>
          </PrivateBadge>
        </Details>
      </Card>
    </Section>
  );
};

export default SkeletalTypeSection;
