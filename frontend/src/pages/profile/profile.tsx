import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import { followUser, unfollowUser } from "./api/profile.api";
import BodyTypeHistorySection from "./components/BodyTypeHistorySection";
import { FollowListModal } from "./components/FollowListModal";
import PostsSection from "./components/PostsSection";
import ProfileHeaderSection from "./components/ProfileHeaderSection";
import SkeletalTypeSection from "./components/SkeletalTypeSection";
import { useFollowListQuery } from "./hooks/useFollowListQuery";
import {
  useMyFeedListQuery,
  useMyScrappedFeedListQuery,
  useUserFeedListQuery,
} from "./hooks/useProfileFeedQueries";
import { useProfileQuery } from "./hooks/useProfileQuery";

import type { FollowModalType, FollowUser, UserProfile } from "./api/profile.types";
import type { ReportSummary } from "@/pages/diagnosis/api";

import { FeedDetailModal } from "@/pages/community/components/FeedDetailModal";
import { useMyReportList, useRepresentativeReport } from "@/pages/diagnosis/api";
import { useAuth } from "@/shared/hooks/useAuth";

const formatSkeletonTypeLabel = (value?: string | null): string | null => {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();

  if (normalized.includes("natural")) return "Natural";
  if (normalized.includes("wave")) return "Wave";
  if (normalized.includes("straight")) return "Straight";

  return value;
};

const mapReportToHistoryItem = (report: ReportSummary): UserProfile["bodyTypeHistory"][number] => ({
  id: String(report.reportId),
  type: formatSkeletonTypeLabel(report.skeletonType) ?? report.status,
  date: report.createdAt,
  ratio: {
    straight: report.straightRate,
    wave: report.waveRate,
    natural: report.naturalRate,
  },
  isLatest: report.isRepresentative,
});

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
  const { userId: rawUserId } = useParams<{ userId?: string }>();
  const userId = rawUserId ? decodeURIComponent(rawUserId) : undefined;
  const { me, isAuthLoading, isLoggedIn } = useAuth();
  const isAuthReady = !isAuthLoading;
  const meUserId = me?.userId != null ? String(me.userId) : undefined;
  const isMe = Boolean(
    isAuthReady && isLoggedIn && (!userId || (meUserId && userId === meUserId)),
  );
  const queryUserId = isMe ? undefined : userId;
  const shouldFetchProfile = isAuthReady && (Boolean(userId) || isLoggedIn);
  const { data, isLoading, isError } = useProfileQuery(queryUserId, {
    enabled: shouldFetchProfile,
  });
  const { data: myReportList } = useMyReportList({ enabled: isAuthReady && isMe });
  const { data: representativeReport } = useRepresentativeReport(queryUserId ?? null, {
    enabled: isAuthReady && !isMe && !!queryUserId,
  });
  const { data: myFeeds } = useMyFeedListQuery({ enabled: isAuthReady && isMe });
  const { data: myScrappedFeeds } = useMyScrappedFeedListQuery({
    enabled: isAuthReady && isMe,
  });
  const { data: userFeeds } = useUserFeedListQuery(queryUserId ?? null, {
    enabled: isAuthReady && !isMe && !!queryUserId,
  });
  const [followModalType, setFollowModalType] = useState<FollowModalType | null>(null);
  const {
    data: followUsers,
    isLoading: isFollowLoading,
    isError: isFollowError,
  } = useFollowListQuery(followModalType, queryUserId, !!followModalType);
  const [localFollowUsers, setLocalFollowUsers] = useState<FollowUser[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [localProfile, setLocalProfile] = useState<UserProfile | null>(null);
  const [selectedFeedId, setSelectedFeedId] = useState<string | null>(null);
  const profile: UserProfile | undefined = localProfile ?? data;

  useEffect(() => {
    setLocalFollowUsers(followUsers ?? []);
  }, [followUsers]);

  useEffect(() => {
    if (data) {
      setLocalProfile(data);
    }
  }, [data]);

  if (isAuthLoading || (shouldFetchProfile && isLoading)) {
    return (
      <Page>
        <Main>
          <StatusMessage>Loading profile...</StatusMessage>
        </Main>
      </Page>
    );
  }

  if (!userId && !isLoggedIn) {
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

  const reportHistory = (myReportList ?? []).map(mapReportToHistoryItem);
  const resolvedHistory = reportHistory.length ? reportHistory : profile.bodyTypeHistory;
  const representativeBodyType =
    formatSkeletonTypeLabel(representativeReport?.skeletonType) ?? profile.bodyType;
  const representativeRatio = representativeReport
    ? {
        straight: representativeReport.straightRate,
        wave: representativeReport.waveRate,
        natural: representativeReport.naturalRate,
      }
    : profile.bodyTypeRatio;

  const isOwner = profile.isOwner || isMe;
  const posts = isOwner ? (myFeeds ?? []) : (userFeeds ?? []);
  const saved = isOwner ? (myScrappedFeeds ?? []) : [];
  const showSaved = isOwner;
  const updateFollowingCount = (delta: number) => {
    setLocalProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        following: Math.max(0, prev.following + delta),
      };
    });
  };

  const handleHeaderFollowToggle = async () => {
    if (!queryUserId) return;
    const nextIsFollowing = !(profile.isFollowing ?? false);
    const prevProfile = profile;
    setLocalProfile({
      ...profile,
      isFollowing: nextIsFollowing,
      follower: Math.max(0, profile.follower + (nextIsFollowing ? 1 : -1)),
    });

    try {
      if (nextIsFollowing) {
        await followUser(queryUserId);
      } else {
        await unfollowUser(queryUserId);
      }
    } catch {
      setLocalProfile(prevProfile);
    }
  };

  const handleFollowAction = async (
    userId: string,
    nextIsFollowing: boolean,
    removeOnUnfollow: boolean,
  ) => {
    const prevUsers = localFollowUsers;
    if (removeOnUnfollow && !nextIsFollowing) {
      setLocalFollowUsers((prev) => prev.filter((user) => user.id !== userId));
    } else {
      setLocalFollowUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, isFollowing: nextIsFollowing } : user)),
      );
    }

    if (isOwner) {
      updateFollowingCount(nextIsFollowing ? 1 : -1);
    }

    try {
      if (nextIsFollowing) {
        await followUser(userId);
      } else {
        await unfollowUser(userId);
      }
    } catch {
      setLocalFollowUsers(prevUsers);
      if (isOwner) {
        updateFollowingCount(nextIsFollowing ? -1 : 1);
      }
    }
  };

  const handleOpenSettings = () => setIsSettingsOpen(true);
  const handleCloseSettings = () => setIsSettingsOpen(false);
  const handleGoPasswordReset = () => {
    setIsSettingsOpen(false);
    navigate("/profile/password");
  };
  const handleGoWithdraw = () => {
    setIsSettingsOpen(false);
    navigate("/withdraw");
  };
  const handlePostClick = (postId: number) => {
    setSelectedFeedId(String(postId));
  };
  return (
    <Page>
      <Main>
        <ContentGrid>
          <Sidebar>
            <ProfileHeaderSection
              profileImageUrl={profile.profileImageUrl}
              username={profile.username}
              postCount={profile.postCount}
              follower={profile.follower}
              following={profile.following}
              bodyType={profile.bodyType}
              bio={profile.bio}
              isOwner={isOwner}
              isFollowing={profile.isFollowing}
              onEditProfile={() => navigate("/profile/edit")}
              onOpenSettings={handleOpenSettings}
              onFollowerClick={() => setFollowModalType("follower")}
              onFollowingClick={() => setFollowModalType("following")}
              onFollowToggle={handleHeaderFollowToggle}
            />
          </Sidebar>
          <Content>
            {isOwner ? (
              <BodyTypeHistorySection history={resolvedHistory} />
            ) : (
              <SkeletalTypeSection
                bodyType={representativeBodyType}
                bodyTypeRatio={representativeRatio}
              />
            )}
            <PostsSection
              posts={posts}
              saved={saved}
              showSaved={showSaved}
              onPostClick={handlePostClick}
            />
          </Content>
        </ContentGrid>
      </Main>
      {followModalType && (
        <FollowModalOverlay onClick={() => setFollowModalType(null)}>
          <FollowModalCard onClick={(event) => event.stopPropagation()}>
            <FollowListModal
              type={followModalType}
              users={localFollowUsers}
              currentNickname={me?.nickname}
              onClose={() => setFollowModalType(null)}
              onUnfollow={(userId) => {
                handleFollowAction(userId, false, false);
              }}
              onToggleFollow={(userId) => {
                const current = localFollowUsers.find((user) => user.id === userId);
                const nextIsFollowing = !(current?.isFollowing ?? false);
                handleFollowAction(userId, nextIsFollowing, false);
              }}
              isLoading={isFollowLoading}
              errorMessage={isFollowError ? "불러오지 못했습니다." : undefined}
            />
          </FollowModalCard>
        </FollowModalOverlay>
      )}
      {isSettingsOpen && (
        <SettingsModalOverlay onClick={handleCloseSettings}>
          <SettingsModalCard onClick={(event) => event.stopPropagation()}>
            <SettingsModalTitle>설정</SettingsModalTitle>
            <SettingsModalButton type="button" onClick={handleGoPasswordReset}>
              비밀번호 변경
            </SettingsModalButton>
            <SettingsModalButton type="button" onClick={handleGoWithdraw}>
              회원 탈퇴
            </SettingsModalButton>
          </SettingsModalCard>
        </SettingsModalOverlay>
      )}
      {selectedFeedId && (
        <FeedDetailModal feedId={selectedFeedId} onClose={() => setSelectedFeedId(null)} />
      )}
    </Page>
  );
};

export default ProfilePage;

const SettingsModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 1200;
`;

const SettingsModalCard = styled.div`
  width: min(20rem, 90vw);
  background: ${({ theme }) => theme.colors.gray[900]};
  border: 1px solid ${({ theme }) => theme.colors.gray[700]};
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.45);
`;

const SettingsModalTitle = styled.h3`
  margin: 0 0 0.5rem;
  color: ${({ theme }) => theme.colors.gray[50]};
  font-size: 1.1rem;
  font-weight: 700;
`;

const SettingsModalButton = styled.button`
  width: 100%;
  height: 2.8rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[700]};
  background: ${({ theme }) => theme.colors.gray[900]};
  color: ${({ theme }) => theme.colors.gray[100]};
  cursor: pointer;
  font-weight: 600;
`;
