import styled from "styled-components";

import BodyTypeHistorySection from "./components/BodyTypeHistorySection";
import PostsSection from "./components/PostsSection";
import ProfileHeaderSection from "./components/ProfileHeaderSection";
import ProfileNavbar from "./components/ProfileNavbar";
import SkeletalTypeSection from "./components/SkeletalTypeSection";
import { useProfileQuery } from "./hooks/useProfileQuery";

import type { UserProfile } from "./api/profile.types";

const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Main = styled.main`
  width: 100%;
  max-width: 1280px;
  padding: ${({ theme }) => `${theme.spacing.xxxl} ${theme.spacing.lg} ${theme.spacing.xl}`};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxl};
`;

const StatusMessage = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.typography.body.md.regular.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.md.regular.fontWeight};
  line-height: ${({ theme }) => theme.typography.body.md.regular.lineHeight};
  padding: ${({ theme }) => theme.spacing.xxl} 0;
  text-align: center;
`;

const getViewerUsername = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage.getItem("viewerUsername");
  } catch {
    return null;
  }
};

const ProfilePage = () => {
  const { data, isLoading, isError } = useProfileQuery();
  const viewerUsername = getViewerUsername();
  const profile: UserProfile | undefined = data;

  if (isLoading) {
    return (
      <Page>
        <ProfileNavbar />
        <Main>
          <StatusMessage>Loading profile...</StatusMessage>
        </Main>
      </Page>
    );
  }

  if (isError || !profile) {
    return (
      <Page>
        <ProfileNavbar />
        <Main>
          <StatusMessage>Failed to load profile.</StatusMessage>
        </Main>
      </Page>
    );
  }

  const isOwner = profile.isOwner || (viewerUsername ? viewerUsername === profile.username : false);

  return (
    <Page>
      <ProfileNavbar />
      <Main>
        <ProfileHeaderSection
          username={profile.username}
          postCount={profile.postCount}
          follower={profile.follower}
          following={profile.following}
          bodyType={profile.bodyType}
          profileMeta={profile.profileMeta}
          bio={profile.bio}
          isOwner={isOwner}
        />
        {isOwner ? (
          <BodyTypeHistorySection history={profile.bodyTypeHistory} />
        ) : (
          <SkeletalTypeSection bodyType={profile.bodyType} bodyTypeRatio={profile.bodyTypeRatio} />
        )}
        <PostsSection posts={profile.posts} saved={profile.saved} />
      </Main>
    </Page>
  );
};

export default ProfilePage;
