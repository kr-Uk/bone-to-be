import { z } from "zod";

import { STYLE_OPTIONS } from '@/shared/constants/styleOptions';

export const basicInfoSchema = z.object({
  gender: z.enum(["women", "men"], {
    required_error: "성별을 선택해주세요",
  }),
  height: z
    .string()
    .min(1, "키를 입력해주세요")
    .refine((val) => /^\d+$/.test(val), {
      message: "숫자만 입력 가능합니다",
    })
    .refine(
      (val) => {
        const num = parseInt(val, 10);
        return num >= 100 && num <= 250;
      },
      {
        message: "키는 100~250cm 사이여야 합니다",
      },
    ),
  weight: z
    .string()
    .min(1, "몸무게를 입력해주세요")
    .refine((val) => /^\d+$/.test(val), {
      message: "숫자만 입력 가능합니다",
    })
    .refine(
      (val) => {
        const num = parseInt(val, 10);
        return num >= 30 && num <= 200;
      },
      {
        message: "몸무게는 30~200kg 사이여야 합니다",
      },
    ),
  styles: z.enum([
    STYLE_OPTIONS.ANY,
    STYLE_OPTIONS.BASIC,
    STYLE_OPTIONS.CASUAL,
    STYLE_OPTIONS.FORMAL,
  ]),
});

export type BasicInfoFormValues = z.infer<typeof basicInfoSchema>;
