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
  styles: string[]; // 예: ["casual", "street", "minimal"]
  gender: "M" | "F";
  isLiked: boolean;
  likeCount: number;
  createdAt: string; // ISO date
}

/**
 * 커뮤니티 피드 필터 (UI 상태용)
 */
export interface FeedFilters {
  gender: "M" | "F" | null;
  bodyType: "Straight" | "Wave" | "Natural" | null;
  styles: string[]; // multi-select, lowercase values: ["casual", "street", "minimal"]
  heightRange: { min: number; max: number } | null;
  weightRange: { min: number; max: number } | null;
}

/**
 * UI 정렬 타입 (추천순 포함)
 */
export type SortBy = "popular" | "recommended" | "latest";

/**
 * API 요청용 정렬 타입 (추천순 제외)
 */
export type ApiSortBy = "popular" | "latest";

/**
 * 피드 리스트 요청 (UI 상태용)
 */
export interface FeedListRequest {
  sortBy: SortBy;
  filters: FeedFilters;
  page: number;
  limit: number;
}

/**
 * 피드 리스트 API 파라미터 (평탄화된 구조)
 */
export interface FeedListApiParams {
  sort?: ApiSortBy;
  gender?: "M" | "F";
  min_height?: number;
  max_height?: number;
  min_weight?: number;
  max_weight?: number;
  style?: string; // 쉼표 구분 문자열 (예: "casual,street")
  page?: number;
  size?: number;
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
