/**
 * 표준 API 응답 래퍼
 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

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
  gender?: "male" | "female";
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
 * 백엔드 DTO - 작성자
 */
export interface FeedAuthorDto {
  memberId: number;
  profileImageUrl: string | null;
  nickname: string;
  isFollowing: boolean;
}

/**
 * 백엔드 DTO - 피드 리스트 아이템
 */
export interface FeedListItemDto {
  postId: number;
  imageUrl: string;
  style: string[]; // 대문자: ["MINIMAL", "STREET"]
  gender: "FEMALE" | "MALE"; // 대문자
  height: number;
  weight?: number;
  skeletonType: "STRAIGHT" | "WAVE" | "NATURAL"; // 대문자
  isLiked: boolean;
  createdAt: string;
  // 백엔드 응답에 없는 필드들 제거: likeCount, commentCount, author
}

/**
 * 백엔드 API 표준 응답 래퍼
 */
export interface ApiFeedListResponse {
  code: number;
  message: string;
  data: {
    content: FeedListItemDto[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
  };
}

/**
 * 백엔드 DTO - 피드 리스트 응답 (변환 후 형태)
 */
export interface FeedListResponseDto {
  items: FeedListItemDto[];
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

/**
 * Presigned URL 요청
 */
export interface PresignedUrlRequest {
  originalFileName: string;
  contentType: string;
  fileSize: number;
}

/**
 * Presigned URL 응답
 */
export interface PresignedUrlResponse {
  code: number;
  message: string;
  data: {
    fileId: number;
    uploadUrl: string;
  };
}

/**
 * 피드 생성 요청 (새 형식 - JSON)
 */
export interface FeedCreateRequest {
  fileId: number;
  content: string;
  gender: "female" | "male";
  skeletonType: "NATURAL" | "STRAIGHT" | "WAVE"; // 대문자
  style: string[]; // 대문자: ["MINIMAL", "STREET"]
  height: number; // cm
  weight: number; // kg (필수)
}

/**
 * 피드 생성 응답
 */
export interface FeedCreateResponse {
  code: number;
  message: string;
  data: null;
}

/**
 * 피드 상세 작성자 정보
 */
export interface FeedAuthor {
  username: string;
  bodyType: "Straight" | "Wave" | "Natural";
  location: string;
  avatarUrl?: string | null;
}

/**
 * 좋아요 유저 프로필
 */
export interface FeedLikeUser {
  id: string;
  username: string;
  displayName?: string;
  isFollowing?: boolean;
  bodyType?: "Straight" | "Wave" | "Natural";
  location?: string;
  avatarUrl?: string | null;
}

/**
 * 피드 상세 정보
 */
export interface FeedDetail {
  id: string;
  imageUrl: string;
  author: FeedAuthor;
  height: number;
  weight?: number;
  content: string[];
  tags: string[];
  createdAt: string;
  isLiked: boolean;
  likeCount: number;
  likeUsers: FeedLikeUser[];
  commentCount: number;
  isSaved: boolean;
}

/**
 * 백엔드 DTO - 피드 상세 응답
 */
export interface FeedDetailDto {
  postId: number;
  imageUrl: string;
  style: string[];
  gender: "female" | "male";
  height: number;
  weight?: number;
  skeletonType: "Straight" | "Wave" | "Natural";
  content: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  author: FeedAuthorDto;
  createdAt: string;
}

/**
 * 댓글 아이템
 */
export interface FeedComment {
  id: string;
  username: string;
  text: string;
  createdAt: string;
  likeCount: number;
  isLiked: boolean;
  isMine: boolean; // 새로 추가
  parentCommentId?: string | null;
}

/**
 * 백엔드 DTO - 댓글 작성자
 */
export interface FeedCommentAuthorDto {
  userId: number; // memberId → userId
  nickname: string;
  profileImageUrl: string | null;
}

/**
 * 백엔드 DTO - 댓글
 */
export interface FeedCommentDto {
  replyId: number;
  content: string; // replyContent → content
  likeCount: number;
  isLiked: boolean;
  isMine: boolean; // 새로 추가
  createdAt: string;
  author: FeedCommentAuthorDto;
}

/**
 * 댓글 작성 요청
 */
export interface FeedCommentCreateRequest {
  feedId: string;
  text: string;
  parentCommentId?: string | null;
}

/**
 * 댓글 리스트 요청
 */
export interface FeedCommentListRequest {
  feedId: string;
  page: number;
  limit: number;
}

/**
 * 댓글 리스트 응답
 */
export interface FeedCommentListResponse {
  items: FeedComment[];
  total: number;
  page: number;
  hasMore: boolean;
}

/**
 * 백엔드 DTO - 댓글 리스트 응답
 * @deprecated 실제 API는 배열을 직접 반환 (ApiResponse<FeedCommentDto[]>)
 */
/*
export interface FeedCommentListResponseDto {
  postId: number;
  commentCount: number;
  hasNext: boolean;
  comments: FeedCommentDto[];
}
*/

/**
 * 백엔드 DTO - 좋아요 토글 응답
 */
export interface LikeToggleResponseDto {
  postId: number;
  isLiked: boolean;
  likeCount: number;
}

/**
 * 백엔드 DTO - 좋아요 유저
 */
export interface FeedLikeUserDto {
  userId: number; // memberId → userId
  nickname: string;
  profileImageUrl: string | null;
  isFollowing: boolean;
}

/**
 * 백엔드 DTO - 좋아요 리스트 응답
 * @deprecated 실제 API는 배열을 직접 반환 (ApiResponse<FeedLikeUserDto[]>)
 */
/*
export interface FeedLikesResponseDto {
  postId: number;
  likeCount: number;
  hasNext: boolean;
  likes: FeedLikeUserDto[];
}
*/

/**
 * 좋아요 리스트 요청
 */
export interface FeedLikesRequest {
  feedId: string;
  page: number;
  limit: number;
}

/**
 * 댓글 좋아요 토글 요청
 */
export interface CommentLikeToggleRequest {
  replyId: string;
  isLiked: boolean; // 현재 상태 (true면 DELETE, false면 POST)
}
