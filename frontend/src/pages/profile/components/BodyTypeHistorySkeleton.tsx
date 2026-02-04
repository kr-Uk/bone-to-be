import styled from "styled-components";

import { Skeleton } from "@/shared/components/Skeleton/Skeleton";

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2.46rem;

  @media (max-width: 768px) {
    gap: clamp(1.5rem, 5vw, 2.46rem);
  }
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.604375rem;
`;

const Carousel = styled.div`
  display: flex;
  align-items: center;
  gap: 1.51875rem;

  @media (max-width: 768px) {
    gap: clamp(0.75rem, 3vw, 0.9375rem);
  }
`;

const ArrowButtonSkeleton = styled(Skeleton)`
  flex-shrink: 0;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const Track = styled.div`
  flex: 1;
  display: flex;
  gap: 1.51875rem;
  overflow: hidden;
`;

const Card = styled.div`
  min-width: 18rem;
  height: 24rem;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    min-width: clamp(14rem, 78vw, 18rem);
    height: clamp(20rem, 85vw, 24rem);
  }
`;

const CardContent = styled.div`
  flex: 1;
  background: var(--neutral-800, #262626);
  border-radius: 0.9375rem;
  outline: 0.0625rem var(--neutral-600, #525252) solid;
  outline-offset: -0.0625rem;
  display: flex;
  flex-direction: column;
`;

const CardBody = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.875rem;
`;

const ChartSkeleton = styled(Skeleton)`
  @media (max-width: 768px) {
    width: clamp(14rem, 62vw, 16rem) !important;
    height: clamp(14rem, 62vw, 16rem) !important;
  }
`;

const CardFooter = styled.div`
  padding: 1.875rem;
  border-top: 0.041875rem var(--neutral-600, #525252) solid;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

const FooterRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.625rem;
`;

/**
 * Skeleton loading state for BodyTypeHistorySection
 * Displays placeholder cards with shimmer animation while data loads
 */
export const BodyTypeHistorySkeleton = () => {
  return (
    <Section aria-label="Loading body type history">
      <SectionHeader>
        {/* Section title skeleton */}
        <Skeleton variant="text" width="15rem" height="2.5rem" />
        {/* Subtitle skeleton */}
        <Skeleton variant="text" width="20rem" height="1.5625rem" />
      </SectionHeader>

      <Carousel>
        {/* Left arrow button skeleton */}
        <ArrowButtonSkeleton variant="circular" width="3.5rem" height="3.5rem" />

        <Track>
          {/* Show 3 card skeletons */}
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardContent>
                <CardBody>
                  {/* Triangle chart area skeleton */}
                  <ChartSkeleton
                    variant="rectangular"
                    width="16rem"
                    height="16rem"
                    borderRadius="0.5rem"
                  />
                </CardBody>
                <CardFooter>
                  <FooterRow>
                    {/* Body type title skeleton */}
                    <Skeleton variant="text" width="10rem" height="2.1875rem" />
                    {/* Code text skeleton */}
                    <Skeleton variant="text" width="3rem" height="1.25rem" />
                  </FooterRow>
                  {/* Date text skeleton */}
                  <Skeleton variant="text" width="8rem" height="0.9375rem" />
                </CardFooter>
              </CardContent>
            </Card>
          ))}
        </Track>

        {/* Right arrow button skeleton */}
        <ArrowButtonSkeleton variant="circular" width="3.5rem" height="3.5rem" />
      </Carousel>
    </Section>
  );
};
