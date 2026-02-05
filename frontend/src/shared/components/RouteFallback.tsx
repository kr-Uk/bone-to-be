import styled from "styled-components";

import { Skeleton, SkeletonText } from "@/shared/components/Skeleton";

export const RouteFallback = () => {
  return (
    <Wrap aria-busy="true" aria-live="polite">
      <HeaderBlock>
        <Skeleton width="12rem" height="1.5rem" />
        <Skeleton width="18rem" height="2rem" />
      </HeaderBlock>
      <SkeletonText lines={3} width={["90%", "85%", "60%"]} />
      <Section>
        <Skeleton width="100%" height="12rem" borderRadius="0.75rem" />
      </Section>
    </Wrap>
  );
};

const Wrap = styled.div`
  width: 100%;
  max-width: 80rem;
  margin: 0 auto;
  padding: 3rem ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 768px) {
    padding: 2.5rem 1.5rem;
    gap: 1rem;
  }
`;

const HeaderBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Section = styled.div`
  display: grid;
  gap: 1rem;
`;
