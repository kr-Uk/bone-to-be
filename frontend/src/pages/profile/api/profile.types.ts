export type UserPost = {
  postId: number;
  imageUrl: string;
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
  username: string;
  postCount: number;
  follower: number;
  following: number;
  bodyType: string;
  bodyTypeRatio: BodyTypeRatio;
  profileMeta?: string;
  bio?: string;
  isOwner: boolean;
  bodyTypeHistory: BodyTypeHistoryItem[];
  posts: UserPost[];
  saved: UserPost[];
};
