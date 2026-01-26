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
    styles: ["casual", "minimal"],
    gender: "F",
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
    styles: ["street"],
    gender: "F",
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
    styles: ["minimal"],
    gender: "M",
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
    styles: ["street", "casual"],
    gender: "F",
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
    styles: ["casual", "minimal"],
    gender: "F",
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
    styles: ["street"],
    gender: "M",
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
    styles: ["minimal"],
    gender: "F",
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
    styles: ["casual"],
    gender: "M",
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
    styles: ["street", "minimal"],
    gender: "F",
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
    styles: ["casual", "street"],
    gender: "F",
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
    styles: ["minimal"],
    gender: "M",
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
    styles: ["casual"],
    gender: "F",
    isLiked: false,
    likeCount: 99,
    createdAt: "2026-01-19T07:50:00Z",
  },
];

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
      filteredItems = filteredItems.filter((item) => item.gender === gender);
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

    const response: FeedListResponse = {
      items: paginatedItems,
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

    if (!mockItem) {
      return HttpResponse.json(
        { error: "피드를 찾을 수 없습니다." },
        { status: 404 }
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
