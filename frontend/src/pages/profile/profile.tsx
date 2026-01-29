import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import BodyTypeHistorySection from "./components/BodyTypeHistorySection";
import { FollowListModal } from "./components/FollowListModal";
import PostsSection from "./components/PostsSection";
import ProfileHeaderSection from "./components/ProfileHeaderSection";
import SkeletalTypeSection from "./components/SkeletalTypeSection";
import { useFollowListQuery } from "./hooks/useFollowListQuery";
import { useProfileQuery } from "./hooks/useProfileQuery";

import type { FollowModalType, FollowUser, UserProfile } from "./api/profile.types";
import { useAuth } from "@/shared/hooks/useAuth";

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

const StatusMessage = styled.div`
  color: var(--neutral-300, #d4d4d4);
  font-size: 1.09375rem;
  font-weight: 400;
  line-height: 1.5625rem;
  padding: 2.5rem 0;
  text-align: center;
`;

const FollowModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  z-index: 1000;
`;

const FollowModalCard = styled.div`
  width: min(32rem, 100%);
  height: min(40rem, 90vh);
`;


const ProfilePage = () => {
  const navigate = useNavigate();
  const { nickname: rawNickname } = useParams<{ nickname?: string }>();
  const nickname = rawNickname ? decodeURIComponent(rawNickname) : undefined;
  const { me, isAuthLoading, isLoggedIn } = useAuth();
  const isAuthReady = !isAuthLoading;
  const isMe = Boolean(isAuthReady && nickname && me?.nickname && nickname === me.nickname);
  const queryUserId = isMe ? undefined : nickname;
  const shouldFetchProfile = Boolean(nickname) && isAuthReady;
  const { data, isLoading, isError } = useProfileQuery(queryUserId, {
    enabled: shouldFetchProfile,
  });
  const [followModalType, setFollowModalType] = useState<FollowModalType | null>(null);
  const {
    data: followUsers,
    isLoading: isFollowLoading,
    isError: isFollowError,
  } = useFollowListQuery(followModalType, !!followModalType);
  const [localFollowUsers, setLocalFollowUsers] = useState<FollowUser[]>([]);
  const profile: UserProfile | undefined = data;

  useEffect(() => {
    if (!nickname && isAuthReady) {
      if (me?.nickname) {
        navigate(`/profile/${encodeURIComponent(me.nickname)}`, { replace: true });
      }
    }
  }, [nickname, isAuthReady, me?.nickname, navigate]);

  useEffect(() => {
    setLocalFollowUsers(followUsers ?? []);
  }, [followUsers]);

  if (isAuthLoading || (shouldFetchProfile && isLoading)) {
    return (
      <Page>
        <Main>
          <StatusMessage>Loading profile...</StatusMessage>
        </Main>
      </Page>
    );
  }

  if (!nickname && !isLoggedIn) {
    return (
      <Page>
        <Main>
          <StatusMessage>Login required.</StatusMessage>
        </Main>
      </Page>
    );
  }

  if (isError || !profile) {
    return (
      <Page>
        <Main>
          <StatusMessage>Failed to load profile.</StatusMessage>
        </Main>
      </Page>
    );
  }

  const isOwner = profile.isOwner || isMe;

  return (
    <Page>
      <Main>
        <ContentGrid>
          <Sidebar>
            <ProfileHeaderSection
              username={profile.username}
              postCount={profile.postCount}
              follower={profile.follower}
              following={profile.following}
              bodyType={profile.bodyType}
              bio={profile.bio}
              isOwner={isOwner}
              onFollowerClick={() => setFollowModalType("follower")}
              onFollowingClick={() => setFollowModalType("following")}
            />
          </Sidebar>
          <Content>
            {isOwner ? (
              <BodyTypeHistorySection history={profile.bodyTypeHistory} />
            ) : (
              <SkeletalTypeSection
                bodyType={profile.bodyType}
                bodyTypeRatio={profile.bodyTypeRatio}
              />
            )}
            <PostsSection posts={profile.posts} saved={profile.saved} />
          </Content>
        </ContentGrid>
      </Main>
      {followModalType && (
        <FollowModalOverlay onClick={() => setFollowModalType(null)}>
          <FollowModalCard onClick={(event) => event.stopPropagation()}>
            <FollowListModal
              type={followModalType}
              users={localFollowUsers}
              onClose={() => setFollowModalType(null)}
              onUnfollow={(userId) => {
                setLocalFollowUsers((prev) => prev.filter((user) => user.id !== userId));
              }}
              onToggleFollow={(userId) => {
                setLocalFollowUsers((prev) =>
                  prev.map((user) =>
                    user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user,
                  ),
                );
              }}
              isLoading={isFollowLoading}
              errorMessage={isFollowError ? "불러오지 못했습니다." : undefined}
            />
          </FollowModalCard>
        </FollowModalOverlay>
      )}
    </Page>
  );
};

export default ProfilePage;
