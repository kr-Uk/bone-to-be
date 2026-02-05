import styled from "styled-components";

import { SkeletonCard } from "@/shared/components/Skeleton/SkeletonCard";

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 768px) {
    gap: clamp(1rem, 4vw, 1.5rem);
  }
`;

const TabBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 5rem;
  padding-top: 0.75rem;
  border-top: 0.041875rem var(--neutral-600, #525252) solid;

  @media (max-width: 768px) {
    gap: clamp(2.5rem, 10vw, 5rem);
    padding-top: clamp(0.5rem, 2vw, 0.75rem);
  }
`;

const TabSkeleton = styled(SkeletonCard)`
  width: 6rem;
  height: 3rem;

  @media (max-width: 768px) {
    width: clamp(4.5rem, 15vw, 6rem);
    height: clamp(2.5rem, 8vw, 3rem);
  }
`;

const PostGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const PostCardWrapper = styled.div`
  position: relative;
  aspect-ratio: 3 / 4;
  width: 100%;
  overflow: hidden;
  outline: 0.0625rem rgba(255, 255, 255, 0.05) solid;
  outline-offset: -0.0625rem;

  @media (max-width: 1024px) {
    outline: 0.0625rem var(--neutral-600, #525252) solid;
  }
`;

const StyledSkeletonCard = styled(SkeletonCard)`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: 0;
`;

/**
 * Skeleton loading component for PostsSection
 *
 * Displays a skeleton version of the posts section with:
 * - Tab navigation skeleton (2 tab buttons)
 * - Grid of 12 post card skeletons
 * - Responsive grid layout (4 columns desktop, 3 columns tablet/mobile)
 * - 3:4 aspect ratio cards matching PostCard component
 */
export const PostsSectionSkeleton = () => {
  return (
    <Section aria-label="Loading posts">
      <TabBar>
        <TabSkeleton borderRadius="0.25rem" />
        <TabSkeleton borderRadius="0.25rem" />
      </TabBar>
      <PostGrid>
        {Array.from({ length: 12 }).map((_, index) => (
          <PostCardWrapper key={index}>
            <StyledSkeletonCard />
          </PostCardWrapper>
        ))}
      </PostGrid>
    </Section>
  );
};
