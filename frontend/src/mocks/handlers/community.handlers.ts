import { http, HttpResponse, delay } from "msw";

import type {
  FeedCommentListResponse,
  FeedDetail,
  FeedItem,
  FeedLikeUser,
  FeedListResponseDto,
  FeedDetailDto,
  FeedAuthorDto,
  FeedListItemDto,
  FeedLikesResponseDto,
  FeedLikeUserDto,
  FeedCommentListResponseDto,
  FeedCommentDto,
  LikeToggleResponseDto,
  FeedListResponse,
} from "@/pages/community/api";

const mockFeedItems: FeedItem[] = [
  {
    id: "1",
    imageUrl: "https://placehold.co/400x533?text=Feed_1",
    username: "fashion_lover",
    bodyType: "Wave",
    height: 162,
    weight: 50,
    styles: ["casual", "minimal"],
    gender: "F",
    isLiked: false,
    likeCount: 6,
    createdAt: "2026-01-20T10:00:00Z",
  },
  {
    id: "2",
    imageUrl: "https://placehold.co/400x533?text=Feed_2",
    username: "user_name",
    bodyType: "Natural",
    height: 171,
    weight: 58,
    styles: ["street"],
    gender: "F",
    isLiked: false,
    likeCount: 4,
    createdAt: "2026-01-19T15:30:00Z",
  },
  {
    id: "3",
    imageUrl: "https://placehold.co/400x533?text=Feed_3",
    username: "style_guru",
    bodyType: "Straight",
    height: 175,
    weight: 65,
    styles: ["minimal"],
    gender: "M",
    isLiked: false,
    likeCount: 7,
    createdAt: "2026-01-21T08:15:00Z",
  },
  {
    id: "4",
    imageUrl: "https://placehold.co/400x533?text=Feed_4",
    username: "trendsetter",
    bodyType: "Wave",
    height: 165,
    weight: 52,
    styles: ["street", "casual"],
    gender: "F",
    isLiked: false,
    likeCount: 9,
    createdAt: "2026-01-22T12:45:00Z",
  },
  {
    id: "5",
    imageUrl: "https://placehold.co/400x533?text=Feed_5",
    username: "cozy_vibes",
    bodyType: "Natural",
    height: 168,
    weight: 55,
    styles: ["casual", "minimal"],
    gender: "F",
    isLiked: false,
    likeCount: 5,
    createdAt: "2026-01-18T14:20:00Z",
  },
  {
    id: "6",
    imageUrl: "https://placehold.co/400x533?text=Feed_6",
    username: "urban_style",
    bodyType: "Straight",
    height: 180,
    weight: 72,
    styles: ["street"],
    gender: "M",
    isLiked: false,
    likeCount: 6,
    createdAt: "2026-01-17T09:30:00Z",
  },
  {
    id: "7",
    imageUrl: "https://placehold.co/400x533?text=Feed_7",
    username: "minimalist_me",
    bodyType: "Wave",
    height: 160,
    weight: 48,
    styles: ["minimal"],
    gender: "F",
    isLiked: false,
    likeCount: 4,
    createdAt: "2026-01-21T16:00:00Z",
  },
  {
    id: "8",
    imageUrl: "https://placehold.co/400x533?text=Feed_8",
    username: "casual_king",
    bodyType: "Natural",
    height: 176,
    weight: 68,
    styles: ["casual"],
    gender: "M",
    isLiked: false,
    likeCount: 6,
    createdAt: "2026-01-20T11:10:00Z",
  },
  {
    id: "9",
    imageUrl: "https://placehold.co/400x533?text=Feed_9",
    username: "street_chic",
    bodyType: "Straight",
    height: 169,
    weight: 54,
    styles: ["street", "minimal"],
    gender: "F",
    isLiked: false,
    likeCount: 7,
    createdAt: "2026-01-22T13:25:00Z",
  },
  {
    id: "10",
    imageUrl: "https://placehold.co/400x533?text=Feed_10",
    username: "fashion_forward",
    bodyType: "Wave",
    height: 173,
    weight: 60,
    styles: ["casual", "street"],
    gender: "F",
    isLiked: false,
    likeCount: 10,
    createdAt: "2026-01-23T10:00:00Z",
  },
  {
    id: "11",
    imageUrl: "https://placehold.co/400x533?text=Feed_11",
    username: "dapper_dan",
    bodyType: "Natural",
    height: 182,
    weight: 75,
    styles: ["minimal"],
    gender: "M",
    isLiked: false,
    likeCount: 5,
    createdAt: "2026-01-16T15:40:00Z",
  },
  {
    id: "12",
    imageUrl: "https://placehold.co/400x533?text=Feed_12",
    username: "vibe_check",
    bodyType: "Straight",
    height: 162,
    weight: 49,
    styles: ["casual"],
    gender: "F",
    isLiked: false,
    likeCount: 4,
    createdAt: "2026-01-19T07:50:00Z",
  },
];

const mockLikeUsersPool: FeedLikeUser[] = [
  { id: "1", username: "daily_urban", displayName: "데일리어반", bodyType: "Straight", location: "Seoul, Korea", avatarUrl: "https://cdn.myapp.com/profile/1.jpg", isFollowing: true },
  { id: "2", username: "cozy_fan", displayName: "코지팬", bodyType: "Natural", location: "Daejeon, Korea", avatarUrl: "https://cdn.myapp.com/profile/2.jpg", isFollowing: false },
  { id: "3", username: "tone_fit", displayName: "톤핏", bodyType: "Wave", location: "Gwangju, Korea", avatarUrl: "https://cdn.myapp.com/profile/3.jpg", isFollowing: true },
  { id: "4", username: "street_lover", displayName: "스트릿러버", bodyType: "Straight", location: "Seoul, Korea", avatarUrl: "https://cdn.myapp.com/profile/4.jpg", isFollowing: false },
  { id: "5", username: "cap_fan", displayName: "캡러버", bodyType: "Natural", location: "Daegu, Korea", avatarUrl: "https://cdn.myapp.com/profile/5.jpg", isFollowing: true },
  { id: "6", username: "minimal_daily", displayName: "미니멀데일리", bodyType: "Wave", location: "Gwangju, Korea", avatarUrl: "https://cdn.myapp.com/profile/6.jpg", isFollowing: false },
  { id: "7", username: "office_daily", displayName: "오피스데일리", bodyType: "Straight", location: "Incheon, Korea", avatarUrl: "https://cdn.myapp.com/profile/7.jpg", isFollowing: true },
  { id: "8", username: "layered_look", displayName: "레이어드룩", bodyType: "Wave", location: "Seoul, Korea", avatarUrl: "https://cdn.myapp.com/profile/8.jpg", isFollowing: false },
  { id: "9", username: "winter_style", displayName: "윈터스타일", bodyType: "Natural", location: "Suwon, Korea", avatarUrl: "https://cdn.myapp.com/profile/9.jpg", isFollowing: true },
  { id: "10", username: "chic_vibe", displayName: "시크바이브", bodyType: "Straight", location: "Seoul, Korea", avatarUrl: "https://cdn.myapp.com/profile/10.jpg", isFollowing: false },
  { id: "11", username: "sneaker_daily", displayName: "스니커데일리", bodyType: "Wave", location: "Jeju, Korea", avatarUrl: "https://cdn.myapp.com/profile/11.jpg", isFollowing: true },
  { id: "12", username: "muffler_fan", displayName: "머플러러버", bodyType: "Natural", location: "Busan, Korea", avatarUrl: "https://cdn.myapp.com/profile/12.jpg", isFollowing: false },
  { id: "13", username: "classic_fit", displayName: "클래식핏", bodyType: "Natural", location: "Ulsan, Korea", avatarUrl: "https://cdn.myapp.com/profile/13.jpg", isFollowing: true },
  { id: "14", username: "city_walk", displayName: "시티워크", bodyType: "Straight", location: "Seoul, Korea", avatarUrl: "https://cdn.myapp.com/profile/14.jpg", isFollowing: false },
  { id: "15", username: "street_mode", displayName: "스트릿모드", bodyType: "Straight", location: "Seoul, Korea", avatarUrl: "https://cdn.myapp.com/profile/15.jpg", isFollowing: true },
  { id: "16", username: "daily_fit", displayName: "데일리핏", bodyType: "Wave", location: "Seoul, Korea", avatarUrl: "https://cdn.myapp.com/profile/16.jpg", isFollowing: false },
  { id: "17", username: "comfort_first", displayName: "컴포트퍼스트", bodyType: "Natural", location: "Suwon, Korea", avatarUrl: "https://cdn.myapp.com/profile/17.jpg", isFollowing: true },
  { id: "18", username: "scarf_mood", displayName: "스카프무드", bodyType: "Wave", location: "Seoul, Korea", avatarUrl: "https://cdn.myapp.com/profile/18.jpg", isFollowing: false },
  { id: "19", username: "simple_style", displayName: "심플스타일", bodyType: "Straight", location: "Seoul, Korea", avatarUrl: "https://cdn.myapp.com/profile/19.jpg", isFollowing: true },
  { id: "20", username: "pocket_detail", displayName: "포켓디테일", bodyType: "Natural", location: "Ulsan, Korea", avatarUrl: "https://cdn.myapp.com/profile/20.jpg", isFollowing: false },
  { id: "21", username: "leather_fan", displayName: "레더팬", bodyType: "Straight", location: "Seoul, Korea", avatarUrl: "https://cdn.myapp.com/profile/21.jpg", isFollowing: true },
  { id: "22", username: "tone_down", displayName: "톤다운", bodyType: "Wave", location: "Incheon, Korea", avatarUrl: "https://cdn.myapp.com/profile/22.jpg", isFollowing: false },
  { id: "23", username: "handsome_hojung", displayName: "호정", bodyType: "Natural", location: "Seoul, Korea", avatarUrl: "https://cdn.myapp.com/profile/23.jpg", isFollowing: true },
  { id: "24", username: "junyong_cute", displayName: "준영", bodyType: "Wave", location: "Seoul, Korea", avatarUrl: "https://cdn.myapp.com/profile/24.jpg", isFollowing: false },
];

const pickLikeUsers = (indexes: number[]) =>
  indexes
    .map((index) => mockLikeUsersPool[index])
    .filter((user): user is FeedLikeUser => Boolean(user));

const mapGenderToDto = (gender: "M" | "F") => (gender === "F" ? "female" : "male");
const mapGenderToBackend = (gender: "M" | "F") => (gender === "F" ? "FEMALE" : "MALE");
const mapSkeletonTypeToBackend = (type: "Straight" | "Wave" | "Natural") =>
  type.toUpperCase();
const mapStyleToBackend = (styles: string[]) =>
  styles.map((style) => style.toUpperCase());

const toAuthorDto = (item: FeedItem, detail?: FeedDetail): FeedAuthorDto => ({
  memberId: Number(item.id),
  profileImageUrl: detail?.author.avatarUrl ?? null,
  nickname: detail?.author.username ?? item.username,
  isFollowing: false,
});

const toFeedListItemDto = (item: FeedItem, detail?: FeedDetail): FeedListItemDto => ({
  postId: Number(item.id),
  imageUrl: item.imageUrl,
  style: item.styles,
  gender: mapGenderToDto(item.gender),
  height: item.height,
  weight: item.weight,
  skeletonType: item.bodyType,
  likeCount: item.likeCount,
  commentCount: detail?.commentCount ?? 0,
  isLiked: item.isLiked,
  author: toAuthorDto(item, detail),
  createdAt: item.createdAt,
});

const toFeedDetailDto = (item: FeedItem, detail: FeedDetail): FeedDetailDto => ({
  postId: Number(detail.id),
  imageUrl: detail.imageUrl,
  style: item.styles,
  gender: mapGenderToDto(item.gender),
  height: item.height,
  weight: item.weight,
  skeletonType: detail.author.bodyType,
  content: detail.content.join("\n"),
  likeCount: detail.likeCount,
  commentCount: detail.commentCount,
  isLiked: detail.isLiked,
  author: toAuthorDto(item, detail),
  createdAt: detail.createdAt,
});

const toLikeUserDto = (user: FeedLikeUser): FeedLikeUserDto => ({
  memberId: Number(user.id.replace(/\D/g, "")) || 0,
  nickname: user.username,
  profileImageUrl: user.avatarUrl ?? null,
  isFollowing: Boolean(user.isFollowing),
});

const toCommentDto = (comment: {
  id: string;
  username: string;
  text: string;
  createdAt: string;
  isLiked: boolean;
}): FeedCommentDto => ({
  replyId: Number(comment.id.replace(/\D/g, "")) || Date.now(),
  replyContent: comment.text,
  likeCount: 0,
  isLiked: comment.isLiked,
  createdAt: comment.createdAt,
  author: {
    memberId: Number(comment.id.replace(/\D/g, "")) || 0,
    nickname: comment.username,
    profileImageUrl: null,
  },
});

const viewerLikeUser: FeedLikeUser = {
  id: "999",
  username: "me",
  displayName: "나",
  bodyType: "Wave",
  location: "Seoul, Korea",
  avatarUrl: "https://cdn.myapp.com/profile/999.jpg",
  isFollowing: false,
};

const mockFeedDetails: Record<string, FeedDetail> = {
  "1": {
    id: "1",
    imageUrl: "https://placehold.co/800x1067?text=Feed_1",
    height: 162,
    weight: 50,
    author: {
      username: "fashion_lover",
      bodyType: "Wave",
      location: "Seoul, Korea",
      avatarUrl: null,
    },
    content: [
      "내추럴 체형에 딱 맞는 오버핏 자켓 스타일링!",
      "저랑 체형 비슷하신 분 이런 스탈 완전 추천",
    ],
    tags: ["Natural", "OOTD", "좋댓구알"],
    createdAt: "2026-01-20T10:00:00Z",
    isLiked: false,
    likeCount: 6,
    likeUsers: pickLikeUsers([0, 1, 2, 3, 4, 22]),
    commentCount: 9,
    isSaved: false,
  },
  "2": {
    id: "2",
    imageUrl: "https://placehold.co/800x1067?text=Feed_2",
    height: 171,
    weight: 58,
    author: {
      username: "user_name",
      bodyType: "Natural",
      location: "Busan, Korea",
      avatarUrl: null,
    },
    content: ["겨울 데일리룩 완성!", "포근한 니트에 코트 조합 추천해요."],
    tags: ["Winter", "Minimal"],
    createdAt: "2026-01-19T15:30:00Z",
    isLiked: false,
    likeCount: 4,
    likeUsers: pickLikeUsers([5, 6, 7, 11]),
    commentCount: 4,
    isSaved: false,
  },
  "3": {
    id: "3",
    imageUrl: "https://placehold.co/800x1067?text=Feed_3",
    height: 175,
    weight: 65,
    author: {
      username: "style_guru",
      bodyType: "Straight",
      location: "Incheon, Korea",
      avatarUrl: null,
    },
    content: ["미니멀 셋업 코디 공유합니다.", "신발은 단정한 로퍼로 마무리!"],
    tags: ["Minimal", "Office"],
    createdAt: "2026-01-21T08:15:00Z",
    isLiked: false,
    likeCount: 7,
    likeUsers: pickLikeUsers([6, 7, 8, 9, 10, 21, 23]),
    commentCount: 2,
    isSaved: false,
  },
  "4": {
    id: "4",
    imageUrl: "https://placehold.co/800x1067?text=Feed_4",
    height: 165,
    weight: 52,
    author: {
      username: "trendsetter",
      bodyType: "Wave",
      location: "Daegu, Korea",
      avatarUrl: null,
    },
    content: ["스트릿 + 캐주얼 믹스!", "패딩에는 볼캡이죠."],
    tags: ["Street", "Casual"],
    createdAt: "2026-01-22T12:45:00Z",
    isLiked: false,
    likeCount: 9,
    likeUsers: pickLikeUsers([0, 3, 4, 5, 14, 15, 16, 17, 18]),
    commentCount: 3,
    isSaved: false,
  },
  "5": {
    id: "5",
    imageUrl: "https://placehold.co/800x1067?text=Feed_5",
    height: 168,
    weight: 55,
    author: {
      username: "cozy_vibes",
      bodyType: "Natural",
      location: "Daejeon, Korea",
      avatarUrl: null,
    },
    content: ["따뜻한 내추럴 톤 가디건 코디", "톤온톤 추천!"],
    tags: ["Casual", "Natural"],
    createdAt: "2026-01-18T14:20:00Z",
    isLiked: false,
    likeCount: 5,
    likeUsers: pickLikeUsers([1, 2, 6, 12, 19]),
    commentCount: 1,
    isSaved: false,
  },
  "6": {
    id: "6",
    imageUrl: "https://placehold.co/800x1067?text=Feed_6",
    height: 180,
    weight: 72,
    author: {
      username: "urban_style",
      bodyType: "Straight",
      location: "Seoul, Korea",
      avatarUrl: null,
    },
    content: ["도심 데일리룩", "포인트는 블랙 코트!"],
    tags: ["Street", "Urban"],
    createdAt: "2026-01-17T09:30:00Z",
    isLiked: false,
    likeCount: 6,
    likeUsers: pickLikeUsers([13, 14, 18, 19, 20, 21]),
    commentCount: 2,
    isSaved: false,
  },
  "7": {
    id: "7",
    imageUrl: "https://placehold.co/800x1067?text=Feed_7",
    height: 160,
    weight: 48,
    author: {
      username: "minimalist_me",
      bodyType: "Wave",
      location: "Gwangju, Korea",
      avatarUrl: null,
    },
    content: ["톤다운 룩북", "액세서리로 포인트만 살짝."],
    tags: ["Minimal", "Daily"],
    createdAt: "2026-01-21T16:00:00Z",
    isLiked: false,
    likeCount: 4,
    likeUsers: pickLikeUsers([2, 5, 6, 9]),
    commentCount: 2,
    isSaved: false,
  },
  "8": {
    id: "8",
    imageUrl: "https://placehold.co/800x1067?text=Feed_8",
    height: 176,
    weight: 68,
    author: {
      username: "casual_king",
      bodyType: "Natural",
      location: "Suwon, Korea",
      avatarUrl: null,
    },
    content: ["캐주얼 스웻 셋업", "편한게 최고!"],
    tags: ["Casual", "Athleisure"],
    createdAt: "2026-01-20T11:10:00Z",
    isLiked: false,
    likeCount: 6,
    likeUsers: pickLikeUsers([7, 8, 9, 10, 16, 17]),
    commentCount: 1,
    isSaved: false,
  },
  "9": {
    id: "9",
    imageUrl: "https://placehold.co/800x1067?text=Feed_9",
    height: 169,
    weight: 54,
    author: {
      username: "street_chic",
      bodyType: "Straight",
      location: "Seoul, Korea",
      avatarUrl: null,
    },
    content: ["스트릿 무드 가득", "레더 재킷 하나로 끝!"],
    tags: ["Street", "Leather"],
    createdAt: "2026-01-22T13:25:00Z",
    isLiked: false,
    likeCount: 7,
    likeUsers: pickLikeUsers([3, 4, 10, 14, 20, 21, 23]),
    commentCount: 3,
    isSaved: false,
  },
  "10": {
    id: "10",
    imageUrl: "https://placehold.co/800x1067?text=Feed_10",
    height: 173,
    weight: 60,
    author: {
      username: "fashion_forward",
      bodyType: "Wave",
      location: "Seoul, Korea",
      avatarUrl: null,
    },
    content: ["색감 맞춘 겨울 레이어드!", "머플러로 마무리~"],
    tags: ["Casual", "Layered"],
    createdAt: "2026-01-23T10:00:00Z",
    isLiked: false,
    likeCount: 10,
    likeUsers: pickLikeUsers([0, 1, 2, 7, 8, 11, 15, 16, 17, 18]),
    commentCount: 5,
    isSaved: false,
  },
  "11": {
    id: "11",
    imageUrl: "https://placehold.co/800x1067?text=Feed_11",
    height: 182,
    weight: 75,
    author: {
      username: "dapper_dan",
      bodyType: "Natural",
      location: "Ulsan, Korea",
      avatarUrl: null,
    },
    content: ["클래식 무드의 자켓 셋업", "포켓치프로 포인트!"],
    tags: ["Classic", "Minimal"],
    createdAt: "2026-01-16T15:40:00Z",
    isLiked: false,
    likeCount: 5,
    likeUsers: pickLikeUsers([12, 13, 19, 20, 22]),
    commentCount: 2,
    isSaved: false,
  },
  "12": {
    id: "12",
    imageUrl: "https://placehold.co/800x1067?text=Feed_12",
    height: 162,
    weight: 49,
    author: {
      username: "vibe_check",
      bodyType: "Straight",
      location: "Jeju, Korea",
      avatarUrl: null,
    },
    content: ["라이트 캐주얼룩", "심플한 스니커즈 매치!"],
    tags: ["Casual", "Sneakers"],
    createdAt: "2026-01-19T07:50:00Z",
    isLiked: false,
    likeCount: 4,
    likeUsers: pickLikeUsers([10, 11, 14, 15]),
    commentCount: 1,
    isSaved: false,
  },
};

const mockFeedComments: Record<string, FeedCommentListResponse> = {
  "1": {
    items: [
      {
        id: "c-1",
        username: "handsome_hojung",
        text: "자켓 정보 알 수 있을까요?",
        createdAt: "2026-01-20T12:10:00Z",
        isLiked: false,
        likeCount: 0
      },
      {
        id: "c-2",
        username: "junyong_cute",
        text: "대박 너무 이뻐요 진심;;",
        createdAt: "2026-01-20T12:40:00Z",
        isLiked: false,
        likeCount: 0
      },
      {
        id: "c-3",
        username: "daily_urban",
        text: "핏이 정말 좋네요! :)",
        createdAt: "2026-01-20T13:05:00Z",
        isLiked: false,
        likeCount: 0
      },
    ],
    total: 3,
    page: 1,
    hasMore: false,
  },
  "2": {
    items: [
      {
        id: "c-4",
        username: "street_chic",
        text: "코트 어디 제품인가요?",
        createdAt: "2026-01-19T16:10:00Z",
        isLiked: false,
        likeCount: 0
      },
    ],
    total: 1,
    page: 1,
    hasMore: false,
  },
  "3": {
    items: [
      {
        id: "c-5",
        username: "office_daily",
        text: "셋업 컬러 너무 좋아요!",
        createdAt: "2026-01-21T09:05:00Z",
        isLiked: false,
        likeCount: 0
      },
      {
        id: "c-6",
        username: "tone_down",
        text: "로퍼 정보 궁금합니다.",
        createdAt: "2026-01-21T09:40:00Z",
        isLiked: false,
        likeCount: 0
      },
    ],
    total: 2,
    page: 1,
    hasMore: false,
  },
  "4": {
    items: [
      {
        id: "c-7",
        username: "daily_urban",
        text: "패딩 핏 좋네요!",
        createdAt: "2026-01-22T13:30:00Z",
        isLiked: false,
        likeCount: 0
      },
      {
        id: "c-8",
        username: "cap_fan",
        text: "볼캡 어디 브랜드인가요?",
        createdAt: "2026-01-22T13:55:00Z",
        isLiked: false,
        likeCount: 0
      },
      {
        id: "c-9",
        username: "street_lover",
        text: "스트릿 감성 제대로!",
        createdAt: "2026-01-22T14:10:00Z",
        isLiked: false,
        likeCount: 0
      },
    ],
    total: 3,
    page: 1,
    hasMore: false,
  },
  "5": {
    items: [
      {
        id: "c-10",
        username: "cozy_fan",
        text: "톤온톤 예쁩니다.",
        createdAt: "2026-01-18T15:10:00Z",
        isLiked: false,
        likeCount: 0
      },
    ],
    total: 1,
    page: 1,
    hasMore: false,
  },
  "6": {
    items: [
      {
        id: "c-11",
        username: "city_walk",
        text: "블랙 코트 멋져요!",
        createdAt: "2026-01-17T10:05:00Z",
        isLiked: false,
        likeCount: 0
      },
      {
        id: "c-12",
        username: "simple_style",
        text: "도시 감성 뿜뿜입니다.",
        createdAt: "2026-01-17T10:22:00Z",
        isLiked: false,
        likeCount: 0
      },
    ],
    total: 2,
    page: 1,
    hasMore: false,
  },
  "7": {
    items: [
      {
        id: "c-13",
        username: "minimal_daily",
        text: "액세서리 포인트 굿!",
        createdAt: "2026-01-21T16:30:00Z",
        isLiked: false,
        likeCount: 0
      },
      {
        id: "c-14",
        username: "tone_fit",
        text: "색감 너무 잘 맞네요.",
        createdAt: "2026-01-21T16:50:00Z",
        isLiked: false,
        likeCount: 0
      },
    ],
    total: 2,
    page: 1,
    hasMore: false,
  },
  "8": {
    items: [
      {
        id: "c-15",
        username: "comfort_first",
        text: "편한 룩 최고죠!",
        createdAt: "2026-01-20T11:40:00Z",
        isLiked: false,
        likeCount: 0
      },
    ],
    total: 1,
    page: 1,
    hasMore: false,
  },
  "9": {
    items: [
      {
        id: "c-16",
        username: "leather_fan",
        text: "레더 재킷 멋져요.",
        createdAt: "2026-01-22T13:50:00Z",
        isLiked: false,
        likeCount: 0
      },
      {
        id: "c-17",
        username: "street_mode",
        text: "스트릿 느낌 완전 좋아요!",
        createdAt: "2026-01-22T14:05:00Z",
        isLiked: false,
        likeCount: 0
      },
      {
        id: "c-18",
        username: "chic_vibe",
        text: "색감 조합 최고.",
        createdAt: "2026-01-22T14:30:00Z",
        isLiked: false,
        likeCount: 0
      },
    ],
    total: 3,
    page: 1,
    hasMore: false,
  },
  "10": {
    items: [
      {
        id: "c-19",
        username: "layered_look",
        text: "레이어드 잘하셨네요!",
        createdAt: "2026-01-23T10:30:00Z",
        isLiked: false,
        likeCount: 0
      },
      {
        id: "c-20",
        username: "muffler_fan",
        text: "머플러 색감 궁금해요.",
        createdAt: "2026-01-23T10:55:00Z",
        isLiked: false,
        likeCount: 0
      },
      {
        id: "c-21",
        username: "winter_style",
        text: "겨울 코디 참고할게요!",
        createdAt: "2026-01-23T11:10:00Z",
        isLiked: false,
        likeCount: 0
      },
      {
        id: "c-22",
        username: "daily_fit",
        text: "핏 너무 예뻐요.",
        createdAt: "2026-01-23T11:25:00Z",
        isLiked: false,
        likeCount: 0
      },
      {
        id: "c-23",
        username: "scarf_mood",
        text: "색 조합 최고네요.",
        createdAt: "2026-01-23T11:40:00Z",
        isLiked: false,
        likeCount: 0
      },
    ],
    total: 5,
    page: 1,
    hasMore: false,
  },
  "11": {
    items: [
      {
        id: "c-24",
        username: "classic_fit",
        text: "클래식 무드 최고!",
        createdAt: "2026-01-16T16:10:00Z",
        isLiked: false,
        likeCount: 0
      },
      {
        id: "c-25",
        username: "pocket_detail",
        text: "포켓치프 포인트 좋네요.",
        createdAt: "2026-01-16T16:35:00Z",
        isLiked: false,
        likeCount: 0
      },
    ],
    total: 2,
    page: 1,
    hasMore: false,
  },
  "12": {
    items: [
      {
        id: "c-26",
        username: "sneaker_daily",
        text: "스니커즈 매치 굿!",
        createdAt: "2026-01-19T08:15:00Z",
        isLiked: false,
        likeCount: 0
      },
    ],
    total: 1,
    page: 1,
    hasMore: false,
  },
};

export const communityHandlers = [
  // GET /api/feed (새로운 엔드포인트)
  http.get("/api/feed", async ({ request }) => {
    await delay(300);

    const url = new URL(request.url);

    // 새로운 쿼리 파라미터 구조
    const sort = url.searchParams.get("sort") || "popular";
    const gender = url.searchParams.get("gender");
    const minHeight = url.searchParams.get("min_height");
    const maxHeight = url.searchParams.get("max_height");
    const minWeight = url.searchParams.get("min_weight");
    const maxWeight = url.searchParams.get("max_weight");
    const styleParam = url.searchParams.get("style");
    const page = parseInt(url.searchParams.get("page") || "1");
    const size = parseInt(url.searchParams.get("size") || "12");

    // 필터링
    let filteredItems = [...mockFeedItems];

    // 성별 필터
    if (gender) {
      const mappedGender = gender === "female" ? "F" : "M";
      filteredItems = filteredItems.filter((item) => item.gender === mappedGender);
    }

    // 키 범위 필터
    if (minHeight && maxHeight) {
      const min = parseInt(minHeight);
      const max = parseInt(maxHeight);
      filteredItems = filteredItems.filter(
        (item) => item.height >= min && item.height <= max
      );
    }

    // 몸무게 범위 필터
    if (minWeight && maxWeight) {
      const min = parseInt(minWeight);
      const max = parseInt(maxWeight);
      filteredItems = filteredItems.filter(
        (item) => item.weight && item.weight >= min && item.weight <= max
      );
    }

    // 스타일 필터 (쉼표로 구분된 문자열)
    if (styleParam) {
      const styles = styleParam.split(",").map((s) => s.trim().toLowerCase());
      filteredItems = filteredItems.filter((item) =>
        item.styles.some((itemStyle) => styles.includes(itemStyle.toLowerCase()))
      );
    }

    // 정렬 로직
    if (sort === "popular") {
      filteredItems.sort((a, b) => b.likeCount - a.likeCount);
    } else if (sort === "latest") {
      filteredItems.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    // 페이지네이션
    const start = (page - 1) * size;
    const end = start + size;
    const paginatedItems = filteredItems.slice(start, end);

    const response: FeedListResponseDto = {
      items: paginatedItems.map((item) =>
        toFeedListItemDto(item, mockFeedDetails[item.id])
      ),
      total: filteredItems.length,
      page,
      hasMore: end < filteredItems.length,
    };

    return HttpResponse.json(response);
  }),

  // POST /api/feed/:feedId/like (새로운 엔드포인트)
  http.post("/api/feed/:feedId/like", async ({ params }) => {
    await delay(200);

    const { feedId } = params;
    const mockItem = mockFeedItems.find((item) => item.id === feedId);
    const mockDetail = mockFeedDetails[String(feedId)];

    if (!mockItem) {
      return HttpResponse.json(
        { error: "피드를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 좋아요 토글
    mockItem.isLiked = !mockItem.isLiked;
    mockItem.likeCount += mockItem.isLiked ? 1 : -1;

    if (mockDetail) {
      mockDetail.isLiked = mockItem.isLiked;
      if (mockItem.isLiked) {
        const exists = mockDetail.likeUsers.some((user) => user.id === viewerLikeUser.id);
        if (!exists) {
          mockDetail.likeUsers.unshift(viewerLikeUser);
        }
      } else {
        mockDetail.likeUsers = mockDetail.likeUsers.filter(
          (user) => user.id !== viewerLikeUser.id
        );
      }
      mockDetail.likeCount = mockDetail.likeUsers.length;
      mockItem.likeCount = mockDetail.likeCount;
    }

    return HttpResponse.json({
      feedId,
      isLiked: mockItem.isLiked,
      likeCount: mockItem.likeCount,
    });

  }),

  // GET /api/feed/:feedId (피드 상세)
  http.get("/api/feed/:feedId", async ({ params }) => {
    await delay(250);

    const { feedId } = params;
    const detail = mockFeedDetails[String(feedId)];

    if (!detail) {
      return HttpResponse.json(
        { error: "피드를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const item = mockFeedItems.find((feed) => feed.id === String(feedId));
    if (!item) {
      return HttpResponse.json(
        { error: "피드를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const response: FeedDetailDto = toFeedDetailDto(item, detail);
    return HttpResponse.json(response);
  }),

  // GET /feeds/:feedId (피드 단일 조회 - 백엔드 스펙)
  http.get("/feeds/:feedId", async ({ params }) => {
    await delay(250);

    const { feedId } = params;
    const detail = mockFeedDetails[String(feedId)];

    if (!detail) {
      return HttpResponse.json(
        { code: 400, message: "게시글을 찾을 수 없습니다.", data: null },
        { status: 400 }
      );
    }

    const item = mockFeedItems.find((feed) => feed.id === String(feedId));
    if (!item) {
      return HttpResponse.json(
        { code: 400, message: "게시글을 찾을 수 없습니다.", data: null },
        { status: 400 }
      );
    }

    return HttpResponse.json({
      code: 200,
      message: "요청 성공",
      data: {
        postId: Number(detail.id),
        imageUrl: detail.imageUrl,
        style: mapStyleToBackend(item.styles),
        gender: mapGenderToBackend(item.gender),
        height: item.height,
        weight: item.weight,
        skeletonType: mapSkeletonTypeToBackend(detail.author.bodyType),
        content: detail.content.join("\n"),
        likeCount: detail.likeCount,
        isLiked: detail.isLiked,
        author: {
          userId: Number(item.id),
          nickname: detail.author.username,
          isFollowing: false,
        },
        createdAt: detail.createdAt,
      },
    });
  }),

  // GET /api/feed/:feedId/likes (좋아요 유저 목록)
  http.get("/api/feed/:feedId/likes", async ({ params, request }) => {
    await delay(250);

    const { feedId } = params;
    const detail = mockFeedDetails[String(feedId)];
    if (!detail) {
      return HttpResponse.json(
        { error: "피드를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const size = parseInt(url.searchParams.get("size") || "50");
    const start = (page - 1) * size;
    const end = start + size;
    const likes = detail.likeUsers.slice(start, end);

    const response: FeedLikesResponseDto = {
      postId: Number(feedId),
      likeCount: detail.likeCount,
      hasNext: end < detail.likeUsers.length,
      likes: likes.map(toLikeUserDto),
    };

    return HttpResponse.json(response);
  }),

  // GET /feeds/:feedId/likes (좋아요 유저 목록 - 백엔드 스펙)
  http.get("/feeds/:feedId/likes", async ({ params }) => {
    await delay(250);

    const { feedId } = params;
    const detail = mockFeedDetails[String(feedId)];
    if (!detail) {
      return HttpResponse.json(
        { code: 400, message: "게시글을 찾을 수 없습니다.", data: null },
        { status: 400 }
      );
    }

    return HttpResponse.json({
      code: 200,
      message: "요청 성공",
      data: detail.likeUsers.map((user) => ({
        userId: Number(user.id),
        nickname: user.username,
        profileImageUrl: user.avatarUrl ?? null,
        isFollowing: Boolean(user.isFollowing),
      })),
    });
  }),

  // GET /api/feed/:feedId/comments (댓글 리스트)
  http.get("/api/feed/:feedId/comments", async ({ params, request }) => {
    await delay(250);

    const { feedId } = params;
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const size = parseInt(url.searchParams.get("size") || "50");

    const source = mockFeedComments[String(feedId)];
    if (!source) {
      return HttpResponse.json(
        { error: "댓글을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const start = (page - 1) * size;
    const end = start + size;
    const items = source.items.slice(start, end);

    const response: FeedCommentListResponseDto = {
      postId: Number(feedId),
      commentCount: source.items.length,
      hasNext: end < source.items.length,
      comments: items.map(toCommentDto),
    };

    return HttpResponse.json(response);
  }),

  // GET /feeds/:feedId/replies (댓글 리스트 - 백엔드 스펙)
  http.get("/feeds/:feedId/replies", async ({ params, request }) => {
    await delay(250);

    const { feedId } = params;
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const size = parseInt(url.searchParams.get("size") || "50");

    const source = mockFeedComments[String(feedId)];
    if (!source) {
      return HttpResponse.json(
        { code: 400, message: "게시글을 찾을 수 없습니다.", data: null },
        { status: 400 }
      );
    }

    const start = (page - 1) * size;
    const end = start + size;
    const items = source.items.slice(start, end);

    return HttpResponse.json({
      postId: Number(feedId),
      commentCount: source.items.length,
      hasNext: end < source.items.length,
      comments: items.map(toCommentDto),
    });
  }),

  // POST /api/feed/:feedId/comments (댓글 작성)
  http.post("/api/feed/:feedId/comments", async ({ params, request }) => {
    await delay(200);

    const { feedId } = params;
    const source = mockFeedComments[String(feedId)];

    if (!source) {
      return HttpResponse.json(
        { error: "댓글을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const body = (await request.json()) as {
      text?: string;
      parentCommentId?: string | null;
    };

    const text = (body.text ?? "").trim();
    if (!text) {
      return HttpResponse.json(
        { error: "댓글 내용을 입력해주세요." },
        { status: 400 }
      );
    }

    const newComment = {
      id: `c-${Date.now()}`,
      username: "me",
      text,
      createdAt: new Date().toISOString(),
      isLiked: false,
      likeCount: 0,
      parentCommentId: body.parentCommentId ?? null,
    };

    source.items.push(newComment);

    const response: FeedCommentDto = toCommentDto(newComment);
    return HttpResponse.json(response);
  }),

  // POST /feeds/:feedId/replies (댓글 작성 - 백엔드 스펙)
  http.post("/feeds/:feedId/replies", async ({ params, request }) => {
    await delay(200);

    const { feedId } = params;
    const source = mockFeedComments[String(feedId)];

    if (!source) {
      return HttpResponse.json(
        { code: 400, message: "게시글을 찾을 수 없습니다.", data: null },
        { status: 400 }
      );
    }

    const body = (await request.json()) as {
      text?: string;
      parentCommentId?: string | null;
    };

    const text = (body.text ?? "").trim();
    if (!text) {
      return HttpResponse.json(
        { code: 400, message: "댓글 내용을 입력해주세요.", data: null },
        { status: 400 }
      );
    }

    const newComment = {
      id: `c-${Date.now()}`,
      username: "me",
      text,
      createdAt: new Date().toISOString(),
      isLiked: false,
      likeCount: 0,
      parentCommentId: body.parentCommentId ?? null,
    };

    source.items.push(newComment);

    return HttpResponse.json(toCommentDto(newComment));
  }),
];
