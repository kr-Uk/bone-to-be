export type UserPost = {
  postId: number;
  imageUrl: string | null;
  likeCount?: number;
  commentCount?: number;
  gender?: "MALE" | "FEMALE";
  skeletonType?: "NATURAL" | "WAVE" | "STRAIGHT";
  style?: string[];
  height?: number;
  weight?: number;
  isLiked?: boolean;
  createdAt?: string;
};

export type FollowModalType = "following" | "follower";

export type FollowUser = {
  id: string;
  username: string;
  styleTag?: string;
  bio?: string;
  avatarUrl?: string;
  isFollowing?: boolean;
};

export type BodyTypeRatio = {
  natural: number;
  wave: number;
  straight: number;
};

export type BodyTypeHistoryItem = {
  id: string;
  type: string;
  date: string;
  ratio: BodyTypeRatio;
  isLatest: boolean;
};

export type UserProfile = {
  profileImageUrl?: string | null;
  username: string;
  postCount: number;
  follower: number;
  following: number;
  bodyType: string;
  bodyTypeRatio: BodyTypeRatio;
  bio?: string;
  isOwner: boolean;
  isFollowing?: boolean;
  bodyTypeHistory: BodyTypeHistoryItem[];
  posts: UserPost[];
  saved: UserPost[];
};
