import styled from "styled-components";

import { Stack } from "./ProfileCommon";

import { Skeleton, SkeletonText } from "@/shared/components/Skeleton";

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2.46rem;
`;

const SectionHeader = styled.div`
  padding-bottom: 1.25rem;
  border-bottom: 0.041875rem var(--neutral-600, #525252) solid;
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

const ChartSkeleton = styled(Skeleton)`
  @media (max-width: 480px) {
    width: 12rem !important;
    height: 12rem !important;
  }
`;

const Details = styled(Stack)`
  flex: 1;
  gap: 1.5rem;

  @media (max-width: 480px) {
    gap: 1rem;
  }
`;

const BadgeSkeleton = styled(Skeleton)`
  border-radius: 0.15625rem;
`;

const DescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

const PrivateBadgeSkeleton = styled(Skeleton)`
  border-radius: 0.5rem;
`;

/**
 * Skeleton loading component for SkeletalTypeSection
 * Displays a loading placeholder with structure matching the skeletal type analysis card
 */
export const SkeletalTypeSkeleton = () => {
  return (
    <Section aria-label="Loading skeletal type analysis">
      <SectionHeader>
        <Skeleton width="12rem" height="2.5rem" />
        <div style={{ marginTop: "0.375rem" }}>
          <Skeleton width="20rem" height="1.5625rem" />
        </div>
      </SectionHeader>
      <Card>
        <ChartWrap>
          <ChartSkeleton variant="circular" width="14rem" height="14rem" />
        </ChartWrap>
        <Details>
          <BadgeSkeleton width="6.5rem" height="1.5625rem" />
          <DescriptionContainer>
            <Skeleton width="10rem" height="2.1875rem" />
            <SkeletonText lines={2} width={["90%", "70%"]} lineHeight="1.5625rem" gap="0.3rem" />
          </DescriptionContainer>
          <PrivateBadgeSkeleton width="12rem" height="2.5rem" />
        </Details>
      </Card>
    </Section>
  );
};
