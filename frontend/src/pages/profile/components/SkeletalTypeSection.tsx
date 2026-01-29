import { CiLock } from "react-icons/ci";
import styled from "styled-components";

import TriangleChart from "@/shared/components/charts/TriangleChart/TriangleChart";

import { applySmoothing } from "../hooks/useBodyTypeChart";

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

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1.25rem;
    padding: 1.5rem;
  }
`;

const ChartWrap = styled.div`
  width: 16rem;
  height: 16rem;
  border-radius: 624.9375rem;
  background: var(--base-black, black);
  border: 0.0625rem var(--neutral-600, #525252) solid;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 480px) {
    width: 14rem;
    height: 14rem;
    margin: 0 auto;
  }
`;

const ChartInner = styled.div`
  width: 16rem;
  height: 16rem;
  position: relative;

  @media (max-width: 480px) {
    width: 14rem;
    height: 14rem;
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

const Details = styled(Stack)`
  flex: 1;
  gap: 1.5rem;

  @media (max-width: 480px) {
    gap: 1rem;
  }
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

  @media (max-width: 480px) {
    font-size: 1.375rem;
    line-height: 1.9rem;
  }
`;

const TypeDescription = styled(Text)`
  color: var(--neutral-300, #d4d4d4);
  font-size: 1.09375rem;
  font-weight: 400;
  line-height: 1.5625rem;

  @media (max-width: 480px) {
    font-size: 0.95rem;
    line-height: 1.45rem;
  }
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

  svg {
    font-size: 1.05rem;
  }

  @media (max-width: 480px) {
    padding: 0.55rem 0.8rem;
    gap: 0.5rem;

    svg {
      font-size: 1.25rem;
    }
  }
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
  const smoothRatio = applySmoothing({
    natural: Number(bodyTypeRatio.natural),
    wave: Number(bodyTypeRatio.wave),
    straight: Number(bodyTypeRatio.straight),
  });
  const typeTitle = formatBodyType(bodyType);

  return (
    <Section>
      <SectionHeader>
        <Title as="h2">Skeletal Type</Title>
        <Subtitle as="p">이 유저의 최근 골격 진단 결과입니다.</Subtitle>
      </SectionHeader>
      <Card>
        <ChartWrap>
          <ChartInner>
            <ProfileTriangleChart
              data={[smoothRatio.straight * 100, smoothRatio.wave * 100, smoothRatio.natural * 100]}
              labels={["STRAIGHT", "WAVE", "NATURAL"]}
              customLabels={{
                enabled: true,
                alignments: ["center", "right", "left"],
                font:{size:12}
              }}
              tooltip={{ enabled: false }}
              animate={false}
              
            />
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
