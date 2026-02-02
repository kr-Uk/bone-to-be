import axios from "axios";

import axiosInstance from "../../../shared/api/axios";

import type {
  BodyTypeRatio,
  CreateProfileImagePresignedUrlRequest,
  CreateProfileImagePresignedUrlResponse,
  FollowModalType,
  FollowUser,
  UpdateMyProfileRequest,
  UpdateMyProfileResponse,
  UpdateMyPasswordRequest,
  UpdateMyPasswordResponse,
  UserPost,
  UserProfile,
} from "./profile.types";

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

export interface FeedPostDto {
  postId: number;
  imageUrl: string | null;
  likeCount: number;
  commentCount: number;
}

export interface ScrappedPostDto {
  postId: number;
  imageUrl: string | null;
  gender: "MALE" | "FEMALE";
  skeletonType: "NATURAL" | "WAVE" | "STRAIGHT";
  style: string[];
  height: number;
  weight: number;
  isLiked: boolean;
  commentCount: number;
  createdAt: string;
}

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
    avatarUrl: avatarUrl ?? undefined,
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


const mapFeedPost = (post: FeedPostDto | ScrappedPostDto): UserPost => ({
  postId: post.postId,
  imageUrl: post.imageUrl ?? null,
  likeCount: "likeCount" in post ? post.likeCount : undefined,
  commentCount: post.commentCount,
  gender: "gender" in post ? post.gender : undefined,
  skeletonType: "skeletonType" in post ? post.skeletonType : undefined,
  style: "style" in post ? post.style : undefined,
  height: "height" in post ? post.height : undefined,
  weight: "weight" in post ? post.weight : undefined,
  isLiked: "isLiked" in post ? post.isLiked : undefined,
  createdAt: "createdAt" in post ? post.createdAt : undefined,
});

export const fetchMyFeeds = async (): Promise<UserPost[]> => {
  const { data } = await axiosInstance.get<ApiResponse<FeedPostDto[]>>("/feeds/me");
  if (!data?.data) {
    throw new Error("게시글 목록을 불러오지 못했습니다.");
  }
  return data.data.map(mapFeedPost);
};

export const fetchMyScrappedFeeds = async (): Promise<UserPost[]> => {
  const { data } = await axiosInstance.get<ApiResponse<ScrappedPostDto[]>>("/feeds/scrapped");
  if (!data?.data) {
    throw new Error("스크랩 목록을 불러오지 못했습니다.");
  }
  return data.data.map(mapFeedPost);
};

export const fetchUserFeeds = async (userId: string): Promise<UserPost[]> => {
  const { data } = await axiosInstance.get<ApiResponse<FeedPostDto[]>>(`/feeds/users/${userId}`);
  if (!data?.data) {
    throw new Error("게시글 목록을 불러오지 못했습니다.");
  }
  return data.data.map(mapFeedPost);
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

export const createProfileImagePresignedUrl = async (
  request: CreateProfileImagePresignedUrlRequest,
): Promise<CreateProfileImagePresignedUrlResponse> => {
  const { data } = await axiosInstance.post<CreateProfileImagePresignedUrlResponse>(
    "/users/me/profile-image/presigned-url",
    request,
  );
  return data;
};

export const uploadProfileImageToS3 = async (
  uploadUrl: string,
  file: File,
  contentType: string,
): Promise<void> => {
  await axios.put(uploadUrl, file, {
    headers: {
      "Content-Type": contentType,
    },
  });
};

export const updateMyProfile = async (
  request: UpdateMyProfileRequest,
): Promise<UpdateMyProfileResponse> => {
  const { data } = await axiosInstance.put<UpdateMyProfileResponse>("/users/me", request);
  return data;
};

export const updateMyPassword = async (
  request: UpdateMyPasswordRequest,
): Promise<UpdateMyPasswordResponse> => {
  const { data } = await axiosInstance.put<UpdateMyPasswordResponse>(
    "/users/me/password",
    request,
  );
  return data;
};
