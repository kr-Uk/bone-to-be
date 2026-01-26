/**
 * 커뮤니티 피드 아이템
 */
export interface FeedItem {
  id: string;
  imageUrl: string;
  username: string;
  bodyType: "Straight" | "Wave" | "Natural";
  height: number; // cm
  weight?: number; // kg (optional)
  styles: string[]; // 예: ["Casual", "Street"]
  gender: "men" | "women";
  isLiked: boolean;
  likeCount: number;
  createdAt: string; // ISO date
}

/**
 * 커뮤니티 피드 필터
 */
export interface FeedFilters {
  gender: "men" | "women" | null;
  bodyType: "Straight" | "Wave" | "Natural" | null;
  styles: string[]; // multi-select
  heightRange: { min: number; max: number } | null;
  weightRange: { min: number; max: number } | null;
}

export type SortBy = "popular" | "recommended" | "latest";

/**
 * 피드 리스트 요청
 */
export interface FeedListRequest {
  sortBy: SortBy;
  filters: FeedFilters;
  page: number;
  limit: number;
}

/**
 * 피드 리스트 응답
 */
export interface FeedListResponse {
  items: FeedItem[];
  total: number;
  page: number;
  hasMore: boolean;
}

/**
 * 좋아요 토글 요청
 */
export interface LikeToggleRequest {
  feedId: string;
}

/**
 * 좋아요 토글 응답
 */
export interface LikeToggleResponse {
  feedId: string;
  isLiked: boolean;
  likeCount: number;
}
