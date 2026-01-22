import axiosInstance from "../../../shared/api/axios";

import type { BodyTypeHistoryItem, BodyTypeRatio, UserPost, UserProfile } from "./profile.types";

export interface UserPostDto {
  postID: number;
  image: string;
}

export interface BodyTypeRatioDto {
  natural: number;
  wave: number;
  straight: number;
}

export interface BodyTypeHistoryItemDto {
  id?: number | string;
  type: string;
  date?: string;
  isLatest?: boolean;
  ratio?: BodyTypeRatioDto;
  bodyTypeRatio?: BodyTypeRatioDto;
}

export interface UserProfileDto {
  username: string;
  postcount: number;
  follower: number;
  following: number;
  bodyType: string;
  bodyTypeRatio?: BodyTypeRatioDto;
  bodyTypeRatios?: BodyTypeRatioDto;
  height?: number;
  weight?: number;
  profileMeta?: string;
  bio?: string;
  isOwner?: boolean;
  bodyTypeHistory?: BodyTypeHistoryItemDto[];
  bodyTypeHistories?: BodyTypeHistoryItemDto[];
  posts: UserPostDto[];
  saved: UserPostDto[];
}

const mapPost = (post: UserPostDto): UserPost => ({
  postId: post.postID,
  imageUrl: post.image,
});

const getFallbackRatio = (bodyType?: string): BodyTypeRatio => {
  const normalizedType = bodyType?.toLowerCase() ?? "";

  if (normalizedType.includes("???") || normalizedType.includes("natural")) {
    return { natural: 50, wave: 25, straight: 25 };
  }

  if (normalizedType.includes("???") || normalizedType.includes("wave")) {
    return { natural: 25, wave: 50, straight: 25 };
  }

  if (normalizedType.includes("?????") || normalizedType.includes("straight")) {
    return { natural: 25, wave: 25, straight: 50 };
  }

  return { natural: 34, wave: 33, straight: 33 };
};

const normalizeRatio = (
  ratio: Partial<BodyTypeRatioDto> | undefined,
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

const getProfileMeta = (data: UserProfileDto): string | undefined => {
  if (data.profileMeta) {
    return data.profileMeta;
  }

  if (data.height && data.weight) {
    return `${data.height}cm / ${data.weight}kg`;
  }

  return undefined;
};

const mapHistoryItem = (item: BodyTypeHistoryItemDto, index: number): BodyTypeHistoryItem => {
  const ratioSource = item.ratio ?? item.bodyTypeRatio;

  return {
    id: item.id ? String(item.id) : String(index),
    type: item.type,
    date: item.date ?? "",
    ratio: normalizeRatio(ratioSource, item.type),
    isLatest: item.isLatest ?? index === 0,
  };
};

const getFallbackHistory = (bodyType?: string): BodyTypeHistoryItem[] => {
  const fallbackItems = [
    { id: "latest", type: bodyType || "Natural", date: "2026.02.23 (Mon)", isLatest: true },
    { id: "straight-1", type: "Straight", date: "2026.01.20 (Tue)", isLatest: false },
    { id: "wave-1", type: "Wave", date: "2026.01.17 (Sat)", isLatest: false },
    { id: "straight-2", type: "Straight", date: "2026.01.10 (Sat)", isLatest: false },
  ];

  return fallbackItems.map((item, index) => ({
    ...item,
    ratio: normalizeRatio(undefined, item.type),
    isLatest: item.isLatest ?? index === 0,
  }));
};

export const fetchUserProfile = async (): Promise<UserProfile> => {
  const { data } = await axiosInstance.get<UserProfileDto>("/v1/users");
  const ratioSource = data.bodyTypeRatio ?? data.bodyTypeRatios;
  const bodyTypeRatio = normalizeRatio(ratioSource, data.bodyType);
  const historySource = data.bodyTypeHistory ?? data.bodyTypeHistories;
  const bodyTypeHistory = historySource?.length
    ? historySource.map(mapHistoryItem)
    : getFallbackHistory(data.bodyType);

  return {
    username: data.username,
    postCount: data.postcount,
    follower: data.follower,
    following: data.following,
    bodyType: data.bodyType,
    bodyTypeRatio,
    profileMeta: getProfileMeta(data),
    bio: data.bio,
    isOwner: data.isOwner ?? false,
    bodyTypeHistory,
    posts: data.posts.map(mapPost),
    saved: data.saved.map(mapPost),
  };
};
