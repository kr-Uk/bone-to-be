import styled from "styled-components";

import { BodyTypeHistorySkeleton } from "./BodyTypeHistorySkeleton";
import { PostsSectionSkeleton } from "./PostsSectionSkeleton";
import { ProfileHeaderSkeleton } from "./ProfileHeaderSkeleton";
import { SkeletalTypeSkeleton } from "./SkeletalTypeSkeleton";

import type { FC } from "react";

interface ProfileSkeletonProps {
  isOwner: boolean;
}

const Page = styled.div`
  min-height: 100vh;
  background: var(--base-black, #0b0b0b);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Main = styled.main`
  width: 100%;
  max-width: 120rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-top: 1.5rem;

  @media (max-width: 1024px) {
    padding: 1.5rem 2rem;
  }

  @media (max-width: 768px) {
    padding: clamp(1rem, 4vw, 1.5rem) clamp(1.25rem, 5vw, 2rem);
  }
`;

const ContentGrid = styled.div`
  width: 100%;
  max-width: 87.5rem;
  display: grid;
  grid-template-columns: 21.875rem minmax(0, 1fr);
  gap: 2.5rem;
  margin: 0 auto;
  min-width: 0;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    gap: clamp(1rem, 4vw, 1.5rem);
  }
`;

const Sidebar = styled.div`
  width: 100%;
  justify-self: start;
  min-width: 0;

  @media (max-width: 1024px) {
    width: 100%;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4rem;
  width: 100%;
  max-width: 100%;
  min-width: 0;

  @media (max-width: 1024px) {
    gap: 1.5rem;
    max-width: 100%;
  }

  @media (max-width: 768px) {
    gap: clamp(1rem, 4vw, 1.5rem);
  }
`;

const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`;

/**
 * ProfileSkeleton - Main skeleton container for profile page
 *
 * Combines all profile skeleton components with the same layout structure
 * as the ProfilePage component for seamless loading experience.
 */
export const ProfileSkeleton: FC<ProfileSkeletonProps> = ({ isOwner }) => {
  return (
    <Page aria-busy="true" role="status">
      <VisuallyHidden>Loading profile data</VisuallyHidden>
      <Main>
        <ContentGrid>
          <Sidebar>
            <ProfileHeaderSkeleton />
          </Sidebar>
          <Content>
            {isOwner ? <BodyTypeHistorySkeleton /> : <SkeletalTypeSkeleton />}
            <PostsSectionSkeleton />
          </Content>
        </ContentGrid>
      </Main>
    </Page>
  );
};
