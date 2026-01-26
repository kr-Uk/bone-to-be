import { http, HttpResponse } from "msw";

import { diagnosisHandlers } from "./diagnosis.handlers";

export const handlers = [
  ...diagnosisHandlers,
  http.get("/api/health", () => {
    return HttpResponse.json({ ok: true });
  }),
  http.get("/api/auth/check/email", ({ request }) => {
    const url = new URL(request.url);
    const email = url.searchParams.get("email") ?? "";
    const hasEmail =
      email.includes("taken") || email.includes("duplicate") || email.endsWith("@used.com");

    return HttpResponse.json({
      code: 200,
      message: "요청 성공",
      data: { hasEmail },
    });
  }),
  http.get("/api/auth/check/nickname", ({ request }) => {
    const url = new URL(request.url);
    const nickname = url.searchParams.get("nickname") ?? "";
    const hasNickname =
      nickname.includes("taken") ||
      nickname.includes("duplicate");

    return HttpResponse.json({
      code: 200,
      message: "요청 성공",
      data: { hasNickname },
    });
  }),
  http.post("/api/auth/email/validate", async ({ request }) => {
    const body = (await request.json()) as { email?: string };
    if (!body?.email) {
      return HttpResponse.json(
        { code: 400, message: "요청 실패", data: null },
        { status: 400 },
      );
    }

    return HttpResponse.json({
      code: 200,
      message: "요청 성공",
      data: null,
    });
  }),
  http.get("/api/auth/email/validate", ({ request }) => {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    if (code !== "123123") {
      return HttpResponse.json(
        { code: 400, message: "인증 실패", data: null },
        { status: 400 },
      );
    }

    return HttpResponse.json({
      code: 200,
      message: "요청 성공",
      data: null,
    });
  }),
  http.post("/api/auth/login", async ({ request }) => {
    const bodyText = await request.text();
    const params = new URLSearchParams(bodyText);
    const email = params.get("email") ?? "";
    const password = params.get("password") ?? "";

    if (email === "user@example.com" && password === "1234") {
      return HttpResponse.json({ message: "로그인 성공" });
    }

    return HttpResponse.json(
      {
        code: 401,
        message: "이메일 또는 비밀번호가 올바르지 않습니다.",
      },
      { status: 401 },
    );
  }),
  http.post("/api/auth/signup", async ({ request }) => {
    const body = (await request.json()) as {
      nickname?: string;
      email?: string;
      authCode?: string;
      password?: string;
      passwordConfirm?: string;
    };

    const nickname = body?.nickname ?? "";
    const email = body?.email ?? "";
    const authCode = body?.authCode ?? "";
    const password = body?.password ?? "";
    const passwordConfirm = body?.passwordConfirm ?? "";

    if (!nickname || !email || !authCode || !password || !passwordConfirm) {
      return HttpResponse.json(
        { code: 400, message: "\uc694\uccad \uc2e4\ud328", data: null },
        { status: 400 },
      );
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,20}$/;
    if (!passwordRegex.test(password)) {
      return HttpResponse.json(
        {
          code: 400,
          message:
            "비밀번호는 8~20자의 영문과 숫자를 포함해야 합니다.",
          data: null,
        },
        { status: 400 },
      );
    }

    if (password !== passwordConfirm) {
      return HttpResponse.json(
        { code: 400, message: "비밀번호가 일치하지 않습니다.", data: null },
        { status: 400 },
      );
    }

    if (authCode !== "123123") {
      return HttpResponse.json(
        {
          code: 400,
          message: "이메일 인증번호가 일치하지 않거나 만료되었습니다.",
          data: null,
        },
        { status: 400 },
      );
    }

    const hasEmail =
      email.includes("already_exists") || email.includes("duplicate") || email.endsWith("@used.com");
    if (hasEmail) {
      return HttpResponse.json(
        { code: 400, message: "이미 가입된 이메일입니다.", data: null },
        { status: 400 },
      );
    }

    const hasNickname = nickname.includes("taken") || nickname.includes("duplicate");
    if (hasNickname) {
      return HttpResponse.json(
        { code: 400, message: "이미 사용 중인 닉네임입니다.", data: null },
        { status: 400 },
      );
    }

    return HttpResponse.json(
      {
        code: 201,
        message: "회원가입 완료",
        data: {
          id: 1,
          email,
          nickname,
        },
      },
      { status: 201 },
    );
  }),
  http.get("/api/v1/users", () => {
    return HttpResponse.json({
      username: "ssong_0530",
      postcount: 128,
      follower: 4200,
      following: 150,
      bodyType: "Natural",
      height: 171,
      weight: 58,
      bio: "나랑 어울리는 옷들로 꽉 채워야지이ㅣ~~",
      bodyTypeRatio: {
        natural: 55,
        wave: 25,
        straight: 20,
      },
      bodyTypeHistory: [
        {
          id: "N-1",
          type: "Natural",
          date: "2026.02.23 (Mon)",
          isLatest: true,
          ratio: { natural: 55, wave: 25, straight: 20 },
        },
        {
          id: "S-2",
          type: "Straight",
          date: "2026.01.20 (Tue)",
          isLatest: false,
          ratio: { natural: 20, wave: 25, straight: 55 },
        },
        {
          id: "W-1",
          type: "Wave",
          date: "2026.01.17 (Sat)",
          isLatest: false,
          ratio: { natural: 25, wave: 55, straight: 20 },
        },
        {
          id: "S-1",
          type: "Straight",
          date: "2026.01.10 (Sat)",
          isLatest: false,
          ratio: { natural: 20, wave: 30, straight: 50 },
        },
      ],
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
  http.get("/api/v1/users/following", () => {
    return HttpResponse.json([
      {
        id: "1",
        username: "hojung_handsome",
        styleTag: "Straight",
        bio: "미니멀룩",
        avatarUrl: "https://placehold.co/100x100?text=H1",
        isFollowing: true,
      },
      {
        id: "2",
        username: "hot_junyong",
        styleTag: "Natural",
        bio: "내추럴 무드 데일리",
        avatarUrl: "https://placehold.co/100x100?text=H2",
        isFollowing: true,
      },
      {
        id: "3",
        username: "daily_urban",
        styleTag: "Wave",
        bio: "도심 데일리룩",
        avatarUrl: "https://placehold.co/100x100?text=H3",
        isFollowing: true,
      },
    ]);
  }),
  http.get("/api/v1/users/followers", () => {
    return HttpResponse.json([
      {
        id: "4",
        username: "ssong_queen",
        styleTag: "Wave",
        bio: "힙블리 코디",
        avatarUrl: "https://placehold.co/100x100?text=F1",
        isFollowing: true,
      },
      {
        id: "5",
        username: "someone_new",
        styleTag: "Straight",
        bio: "스트릿",
        avatarUrl: "https://placehold.co/100x100?text=F2",
        isFollowing: false,
      },
      {
        id: "6",
        username: "natural_mood",
        styleTag: "Natural",
        bio: "내추럴한 무드",
        avatarUrl: "https://placehold.co/100x100?text=F3",
        isFollowing: false,
      },
    ]);
  }),
];
