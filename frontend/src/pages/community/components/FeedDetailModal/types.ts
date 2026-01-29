import type { FeedComment, FeedDetail, FeedLikeUser } from "../../api";

export interface FeedDetailModalProps {
  onClose: () => void;
  feedId: string;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export interface FeedDetailLeftProps {
  imageUrl?: string;
  isLoading?: boolean;
  hasError?: boolean;
}

export interface FeedDetailRightProps {
  detail: FeedDetail | null;
  comments: FeedComment[];
  likeUsers?: FeedLikeUser[]; // 타입 변경 (배열로)
  likeCount?: number;
  isLoading?: boolean;
  hasError?: boolean;
}

export interface CommentSectionProps {
  comments: FeedComment[];
  isLoading?: boolean;
  hasError?: boolean;
}

export interface LikesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  likeUsers: FeedLikeUser[];
  likeCount: number;
}
