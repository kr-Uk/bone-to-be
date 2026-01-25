import { CiLock } from "react-icons/ci";
import styled from "styled-components";

import { applySmoothing, getBodyTypeBadge, toPoint, toVertex } from "../hooks/useBodyTypeChart";

import { Stack, Text } from "./ProfileCommon";

import type { BodyTypeRatio } from "../api/profile.types";

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2.46rem;
`;

const SectionHeader = styled.div`
  padding-bottom: 1.25rem;
  border-bottom: 0.041875rem var(--neutral-600, #525252) solid;
`;

const Title = styled(Text)`
  color: var(--neutral-50, #fafafa);
  font-size: 1.875rem;
  font-weight: 700;
  line-height: 2.5rem;
`;

const Subtitle = styled(Text)`
  color: var(--neutral-500, #737373);
  font-size: 1.09375rem;
  font-weight: 400;
  line-height: 1.5625rem;
  margin-top: 0.375rem;
`;

const Card = styled.div`
  padding: 1.875rem;
  background: var(--neutral-900, #171717);
  border-radius: 1.875rem;
  outline: 0.0625rem var(--neutral-600, #525252) solid;
  outline-offset: -0.0625rem;
  display: flex;
  align-items: center;
  gap: 3.125rem;

  @media (max-width: 1024px) {
    align-items: flex-start;
    gap: 1.5rem;
  }
`;

const ChartWrap = styled.div`
  width: 12.5rem;
  height: 12.5rem;
  border-radius: 624.9375rem;
  background: var(--base-black, black);
  border: 0.0625rem var(--neutral-600, #525252) solid;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChartInner = styled.div`
  width: 8.75rem;
  height: 8.75rem;
  position: relative;
`;

const ChartSvg = styled.svg`
  width: 100%;
  height: 100%;
`;

const ChartTypeLabel = styled.text`
  fill: var(--neutral-500, #737373);
  font-size: 0.9375rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const TriangleOutline = styled.polygon`
  fill: none;
  stroke: var(--neutral-600, #525252);
  stroke-width: 2.8;
  stroke-dasharray: 4 4;
`;

const TriangleFill = styled.polygon`
  fill: var(--color-brand-primary-900, #59168b);
  opacity: 0.15;
`;

const TriangleStroke = styled.polygon`
  fill: none;
  stroke: var(--color-bg-brand, #9810fa);
  stroke-width: 2;
`;

const Details = styled(Stack)`
  flex: 1;
  gap: 1.5rem;
`;

const LatestBadge = styled.span`
  align-self: flex-start;
  padding: 0.3125rem 0.625rem;
  background: var(--color-bg-brand, #9810fa);
  color: var(--neutral-50, #fafafa);
  font-size: 0.625rem;
  font-weight: 700;
  line-height: 0.9375rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border-radius: 0.15625rem;
`;

const TypeTitle = styled(Text)`
  color: var(--neutral-50, #fafafa);
  font-size: 1.5625rem;
  font-weight: 700;
  line-height: 2.1875rem;
`;

const TypeDescription = styled(Text)`
  color: var(--neutral-300, #d4d4d4);
  font-size: 1.09375rem;
  font-weight: 400;
  line-height: 1.5625rem;
`;

const PrivateBadge = styled.div`
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 0.9375rem;
  background: var(--neutral-900, #171717);
  border-radius: 0.5rem;
  outline: 0.0625rem var(--neutral-600, #525252) solid;
  outline-offset: -0.0625rem;
  color: var(--neutral-500, #737373);
`;

const PrivateText = styled(Text)`
  color: inherit;
  font-size: 0.9375rem;
  font-weight: 400;
  line-height: 1.25rem;
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
        <Title as="h2">Skeletal Type</Title>
        <Subtitle as="p">이 유저의 최근 골격 진단 결과입니다.</Subtitle>
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
          <Stack $gap="0.625rem">
            <TypeTitle as="h3">{typeTitle}</TypeTitle>
            <TypeDescription as="p">
              뼈대가 뚜렷하고 프레임이 단단한 체형.
              <br />
              루즈하고 자연스러운 실루엣이 가장 잘 어울립니다.
            </TypeDescription>
          </Stack>
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
