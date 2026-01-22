import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/health", () => {
    return HttpResponse.json({ ok: true });
  }),
  http.get("/api/v1/users", () => {
    return HttpResponse.json({
      username: "ssong_0530",
      postcount: 128,
      follower: 4200,
      following: 150,
      bodyType: "Natural",
      posts: [
        { postID: 1, image: "https://placehold.co/600x800?text=IMG_01" },
        { postID: 2, image: "https://placehold.co/600x800?text=IMG_02" },
        { postID: 3, image: "https://placehold.co/600x800?text=IMG_03" },
        { postID: 4, image: "https://placehold.co/600x800?text=IMG_04" },
        { postID: 5, image: "https://placehold.co/600x800?text=IMG_05" },
        { postID: 6, image: "https://placehold.co/600x800?text=IMG_06" },
      ],
      saved: [
        { postID: 11, image: "https://placehold.co/600x800?text=SAVE_01" },
        { postID: 12, image: "https://placehold.co/600x800?text=SAVE_02" },
        { postID: 13, image: "https://placehold.co/600x800?text=SAVE_03" },
        { postID: 14, image: "https://placehold.co/600x800?text=SAVE_04" },
        { postID: 15, image: "https://placehold.co/600x800?text=SAVE_05" },
        { postID: 16, image: "https://placehold.co/600x800?text=SAVE_06" },
      ],
    });
  }),
];
