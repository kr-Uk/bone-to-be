import { http, HttpResponse, delay } from "msw";

import type { FeedItem, FeedListResponse } from "@/pages/community/api";

const mockFeedItems: FeedItem[] = [
  {
    id: "1",
    imageUrl: "https://placehold.co/400x533?text=Feed_1",
    username: "fashion_lover",
    bodyType: "Wave",
    height: 162,
    weight: 50,
    styles: ["Casual", "Minimal"],
    gender: "women",
    isLiked: false,
    likeCount: 42,
    createdAt: "2026-01-20T10:00:00Z",
  },
  {
    id: "2",
    imageUrl: "https://placehold.co/400x533?text=Feed_2",
    username: "user_name",
    bodyType: "Natural",
    height: 171,
    weight: 58,
    styles: ["Street"],
    gender: "women",
    isLiked: false,
    likeCount: 28,
    createdAt: "2026-01-19T15:30:00Z",
  },
  {
    id: "3",
    imageUrl: "https://placehold.co/400x533?text=Feed_3",
    username: "style_guru",
    bodyType: "Straight",
    height: 175,
    weight: 65,
    styles: ["Minimal"],
    gender: "men",
    isLiked: false,
    likeCount: 89,
    createdAt: "2026-01-21T08:15:00Z",
  },
  {
    id: "4",
    imageUrl: "https://placehold.co/400x533?text=Feed_4",
    username: "trendsetter",
    bodyType: "Wave",
    height: 165,
    weight: 52,
    styles: ["Street", "Casual"],
    gender: "women",
    isLiked: false,
    likeCount: 156,
    createdAt: "2026-01-22T12:45:00Z",
  },
  {
    id: "5",
    imageUrl: "https://placehold.co/400x533?text=Feed_5",
    username: "cozy_vibes",
    bodyType: "Natural",
    height: 168,
    weight: 55,
    styles: ["Casual", "Minimal"],
    gender: "women",
    isLiked: false,
    likeCount: 63,
    createdAt: "2026-01-18T14:20:00Z",
  },
  {
    id: "6",
    imageUrl: "https://placehold.co/400x533?text=Feed_6",
    username: "urban_style",
    bodyType: "Straight",
    height: 180,
    weight: 72,
    styles: ["Street"],
    gender: "men",
    isLiked: false,
    likeCount: 112,
    createdAt: "2026-01-17T09:30:00Z",
  },
  {
    id: "7",
    imageUrl: "https://placehold.co/400x533?text=Feed_7",
    username: "minimalist_me",
    bodyType: "Wave",
    height: 160,
    weight: 48,
    styles: ["Minimal"],
    gender: "women",
    isLiked: false,
    likeCount: 78,
    createdAt: "2026-01-21T16:00:00Z",
  },
  {
    id: "8",
    imageUrl: "https://placehold.co/400x533?text=Feed_8",
    username: "casual_king",
    bodyType: "Natural",
    height: 176,
    weight: 68,
    styles: ["Casual"],
    gender: "men",
    isLiked: false,
    likeCount: 45,
    createdAt: "2026-01-20T11:10:00Z",
  },
  {
    id: "9",
    imageUrl: "https://placehold.co/400x533?text=Feed_9",
    username: "street_chic",
    bodyType: "Straight",
    height: 169,
    weight: 54,
    styles: ["Street", "Minimal"],
    gender: "women",
    isLiked: false,
    likeCount: 134,
    createdAt: "2026-01-22T13:25:00Z",
  },
  {
    id: "10",
    imageUrl: "https://placehold.co/400x533?text=Feed_10",
    username: "fashion_forward",
    bodyType: "Wave",
    height: 173,
    weight: 60,
    styles: ["Casual", "Street"],
    gender: "women",
    isLiked: false,
    likeCount: 201,
    createdAt: "2026-01-23T10:00:00Z",
  },
  {
    id: "11",
    imageUrl: "https://placehold.co/400x533?text=Feed_11",
    username: "dapper_dan",
    bodyType: "Natural",
    height: 182,
    weight: 75,
    styles: ["Minimal"],
    gender: "men",
    isLiked: false,
    likeCount: 87,
    createdAt: "2026-01-16T15:40:00Z",
  },
  {
    id: "12",
    imageUrl: "https://placehold.co/400x533?text=Feed_12",
    username: "vibe_check",
    bodyType: "Straight",
    height: 162,
    weight: 49,
    styles: ["Casual"],
    gender: "women",
    isLiked: false,
    likeCount: 99,
    createdAt: "2026-01-19T07:50:00Z",
  },
];

export const communityHandlers = [
  // GET /api/v1/community/feed
  http.get("/api/v1/community/feed", async ({ request }) => {
    await delay(300);

    const url = new URL(request.url);
    const sortBy = url.searchParams.get("sortBy") || "popular";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "12");

    // Query 파라미터 기반 필터링 (mock 데이터용)
    const filteredItems = [...mockFeedItems];

    // 정렬 로직
    if (sortBy === "popular") {
      filteredItems.sort((a, b) => b.likeCount - a.likeCount);
    } else if (sortBy === "latest") {
      filteredItems.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }
    // "recommended" is default, no sorting needed

    // 페이지네이션
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedItems = filteredItems.slice(start, end);

    const response: FeedListResponse = {
      items: paginatedItems,
      total: filteredItems.length,
      page,
      hasMore: end < filteredItems.length,
    };

    return HttpResponse.json(response);
  }),

  // POST /api/v1/community/feed/:feedId/like
  http.post("/api/v1/community/feed/:feedId/like", async ({ params }) => {
    await delay(200);

    const { feedId } = params;
    const mockItem = mockFeedItems.find((item) => item.id === feedId);

    if (!mockItem) {
      return HttpResponse.json(
        { error: "피드를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // 좋아요 토글
    mockItem.isLiked = !mockItem.isLiked;
    mockItem.likeCount += mockItem.isLiked ? 1 : -1;

    return HttpResponse.json({
      feedId,
      isLiked: mockItem.isLiked,
      likeCount: mockItem.likeCount,
    });
  }),
];
