import { z } from "zod";

// 최대 파일 크기 (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// 허용된 이미지 타입
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/svg+xml"];

export const feedFormSchema = z.object({
  // 필수: 이미지 파일 (SVG, PNG, JPG)
  image: z
    .custom<File>((file) => file instanceof File, {
      message: "이미지를 업로드해주세요",
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "파일 크기는 10MB 이하여야 합니다",
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "SVG, PNG, JPG 형식만 지원됩니다",
    }),

  // 선택: 내용 (최대 2200자)
  content: z.string().max(200, "내용은 최대 200자까지 입력 가능합니다").default(""),

  // 필수: 체형 (Natural, Wave, Straight)
  bodyType: z.enum(["Natural", "Wave", "Straight"], {
    required_error: "체형을 선택해주세요",
  }),

  // 필수: 성별 (F, M)
  gender: z.enum(["F", "M"], {
    required_error: "성별을 선택해주세요",
  }),

  // 선택: 키 (양의 정수, 빈 값 허용)
  height: z.string().regex(/^\d*$/, "숫자만 입력 가능합니다").default(""),

  // 필수: 몸무게 (양의 정수, 필수 입력)
  weight: z.string().regex(/^\d+$/, "숫자만 입력 가능합니다").min(1, "몸무게를 입력해주세요"),

  // 필수: 스타일 (최소 1개 이상 선택)
  styles: z.array(z.string()).min(1, "스타일을 최소 1개 이상 선택해주세요").default([]),
});

export type FeedFormValues = z.infer<typeof feedFormSchema>;
