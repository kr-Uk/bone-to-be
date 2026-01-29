import axiosInstance from "../../../shared/api/axios";

import type { Me } from "@/shared/api/auth";

import type { BodyTypeRatio, FollowModalType, FollowUser, UserProfile } from "./profile.types";

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface UserProfileBaseDto {
  profileImageUrl: string | null;
  nickname: string;
  skeletonType: string | null;
  postCount: number;
  followerCount: number;
  followingCount: number;
  bio: string | null;
}

export interface FollowUserDto {
  id: string | number;
  username: string;
  styleTag?: string;
  bio?: string;
  avatarUrl?: string;
  isFollowing?: boolean;
}

const mapFollowUser = (user: FollowUserDto): FollowUser => ({
  id: String(user.id),
  username: user.username,
  styleTag: user.styleTag,
  bio: user.bio,
  avatarUrl: user.avatarUrl,
  isFollowing: user.isFollowing,
});

const getFallbackRatio = (bodyType?: string): BodyTypeRatio => {
  const normalizedType = bodyType?.toLowerCase() ?? "";

  if (normalizedType.includes("내츄럴") || normalizedType.includes("natural")) {
    return { natural: 50, wave: 25, straight: 25 };
  }

  if (normalizedType.includes("웨이브") || normalizedType.includes("wave")) {
    return { natural: 25, wave: 50, straight: 25 };
  }

  if (normalizedType.includes("스트레이트") || normalizedType.includes("straight")) {
    return { natural: 25, wave: 25, straight: 50 };
  }

  return { natural: 34, wave: 33, straight: 33 };
};

const normalizeRatio = (
  ratio: Partial<BodyTypeRatio> | undefined,
  bodyType?: string,
): BodyTypeRatio => {
  const natural = ratio?.natural ?? 0;
  const wave = ratio?.wave ?? 0;
  const straight = ratio?.straight ?? 0;
  const total = natural + wave + straight;

  if (total <= 0) {
    return getFallbackRatio(bodyType);
  }

  const scale = 100 / total;

  return {
    natural: natural * scale,
    wave: wave * scale,
    straight: straight * scale,
  };
};

const mapBaseProfile = (profile: UserProfileBaseDto, isOwner: boolean): UserProfile => {
  const bodyType = profile.skeletonType ?? "Natural";

  return {
    profileImageUrl: profile.profileImageUrl ?? null,
    username: profile.nickname,
    postCount: profile.postCount,
    follower: profile.followerCount,
    following: profile.followingCount,
    bodyType,
    bodyTypeRatio: normalizeRatio(undefined, bodyType),
    bio: profile.bio ?? "소개글이 없습니다.",
    isOwner,
    bodyTypeHistory: [],
    posts: [],
    saved: [],
  };
};

export const fetchMyProfile = async (): Promise<UserProfile> => {
  const { data } = await axiosInstance.get<ApiResponse<UserProfileBaseDto>>("/users/me");
  if (!data?.data) {
    throw new Error("프로필 정보를 불러오지 못했습니다.");
  }
  return mapBaseProfile(data.data, true);
};

export const fetchUserProfile = async (userId: string): Promise<UserProfile> => {
  const encodedUserId = encodeURIComponent(userId);
  const { data } = await axiosInstance.get<ApiResponse<UserProfileBaseDto>>(
    `/users/${encodedUserId}`,
  );
  if (!data?.data) {
    throw new Error("프로필 정보를 불러오지 못했습니다.");
  }
  return mapBaseProfile(data.data, false);
};


const followEndpoint: Record<FollowModalType, string> = {
  following: "/v1/users/following",
  follower: "/v1/users/followers",
};

export const fetchFollowList = async (type: FollowModalType): Promise<FollowUser[]> => {
  const { data } = await axiosInstance.get<FollowUserDto[]>(followEndpoint[type]);

  return data.map(mapFollowUser);
};
