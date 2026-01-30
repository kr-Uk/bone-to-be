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
  isFollowing?: boolean | null;
}

export interface FollowUserDto {
  id: string | number;
  nickname?: string;
  username?: string;
  bodyType?: string | null;
  styleTag?: string;
  bio?: string | null;
  profileImage?: string | null;
  profileImageUrl?: string | null;
  avatarUrl?: string | null;
  isFollowing?: boolean;
}

const normalizeText = (value: string | null | undefined, fallback: string) => {
  const trimmed = (value ?? "").trim();
  return trimmed.length > 0 ? trimmed : fallback;
};

const mapFollowUser = (user: FollowUserDto): FollowUser => {
  const username = user.nickname ?? user.username ?? "알 수 없음";
  const styleTag = normalizeText(user.bodyType ?? user.styleTag, "비공개");
  const bio = normalizeText(user.bio, "소개글이 없습니다.");
  const avatarUrl = user.profileImageUrl ?? user.profileImage ?? user.avatarUrl ?? null;

  return {
    id: String(user.id),
    username,
    styleTag,
    bio,
    avatarUrl,
    isFollowing: user.isFollowing,
  };
};

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
    isFollowing: profile.isFollowing ?? false,
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
  const { data } = await axiosInstance.get<ApiResponse<UserProfileBaseDto>>(`/users/${userId}`);
  if (!data?.data) {
    throw new Error("프로필 정보를 불러오지 못했습니다.");
  }
  return mapBaseProfile(data.data, false);
};

export const followUser = async (userId: string): Promise<void> => {
  await axiosInstance.post<ApiResponse<null>>(`/users/${userId}/follow`);
};

export const unfollowUser = async (userId: string): Promise<void> => {
  await axiosInstance.delete<ApiResponse<null>>(`/users/${userId}/follow`);
};

const myFollowEndpoint: Record<FollowModalType, string> = {
  following: "/users/me/followings",
  follower: "/users/me/followers",
};

const userFollowEndpoint = (userId: string): Record<FollowModalType, string> => {
  return {
    following: `/users/${userId}/followings`,
    follower: `/users/${userId}/followers`,
  };
};

const mapFollowResponse = (data?: ApiResponse<FollowUserDto[]>): FollowUser[] => {
  if (!data?.data) {
    throw new Error("팔로우 목록을 불러오지 못했습니다.");
  }

  return data.data.map(mapFollowUser);
};

export const fetchFollowList = async (
  type: FollowModalType,
  userId?: string,
): Promise<FollowUser[]> => {
  const endpoint = userId ? userFollowEndpoint(userId)[type] : myFollowEndpoint[type];
  const { data } = await axiosInstance.get<ApiResponse<FollowUserDto[]>>(endpoint);

  return mapFollowResponse(data);
};
