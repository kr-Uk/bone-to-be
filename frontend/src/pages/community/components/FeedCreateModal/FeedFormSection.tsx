import { Controller, type Control, type UseFormRegister } from "react-hook-form";

import * as S from "./FeedFormSection.styles";
import { FeedInputGroup } from "./FeedInputGroup";
import { FeedOptionGroup } from "./FeedOptionGroup";
import { FeedTextarea } from "./FeedTextarea";

import type { FeedFormValues } from "./validation";

const BODY_TYPE_OPTIONS = [
  { label: "Natural", value: "Natural" },
  { label: "Wave", value: "Wave" },
  { label: "Straight", value: "Straight" },
];

const GENDER_OPTIONS = [
  { label: "여", value: "F" },
  { label: "남", value: "M" },
];

const STYLE_OPTIONS = [
  { label: "클래식", value: "classic" },
  { label: "포멀", value: "formal" },
  { label: "스트릿", value: "street" },
  { label: "캐주얼", value: "casual" },
  { label: "미니멀", value: "minimal" },
  { label: "빈티지", value: "vintage" },
  { label: "스포티", value: "sporty" },
  { label: "페미닌", value: "feminine" },
];

// ProfileHeader 컴포넌트 분리
export function ProfileHeader() {
  return (
    <S.ProfileHeader>
      <S.Avatar>
        <S.AvatarPlaceholder>👤</S.AvatarPlaceholder>
      </S.Avatar>
      <S.Username>사용자</S.Username>
    </S.ProfileHeader>
  );
}

interface FeedFormSectionProps {
  control: Control<FeedFormValues>;
  register: UseFormRegister<FeedFormValues>;
  errors: {
    content?: { message?: string };
    bodyType?: { message?: string };
    gender?: { message?: string };
    height?: { message?: string };
    weight?: { message?: string };
    styles?: { message?: string };
  };
  contentLength: number;
  onSubmit: () => void;
  isSubmitting: boolean;
  isValid: boolean;
}

export function FeedFormSection({
  control,
  register,
  errors,
  contentLength,
  onSubmit,
  isSubmitting,
  isValid,
}: FeedFormSectionProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid && !isSubmitting) {
      onSubmit();
    }
  };

  return (
    <>
      <S.FormContainer>
        {/* Content Textarea */}
        <FeedTextarea
          {...register("content")}
          maxLength={2200}
          currentLength={contentLength}
          error={errors.content?.message}
          placeholder="오늘의 코디를 공유해보세요..."
        />

        {/* Body Type Selection */}
        <Controller
          name="bodyType"
          control={control}
          render={({ field }) => (
            <FeedOptionGroup
              label="골격 유형"
              options={BODY_TYPE_OPTIONS}
              value={field.value ?? null}
              onChange={(value) => field.onChange(value)}
            />
          )}
        />

        {/* Gender Selection */}
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <FeedOptionGroup
              label="성별"
              options={GENDER_OPTIONS}
              value={field.value ?? null}
              onChange={(value) => field.onChange(value)}
            />
          )}
        />

        {/* Height & Weight Input */}
        <FeedInputGroup
          heightProps={{
            ...register("height"),
          }}
          weightProps={{
            ...register("weight"),
          }}
          heightError={errors.height?.message}
          weightError={errors.weight?.message}
        />

        {/* Style Selection */}
        <Controller
          name="styles"
          control={control}
          render={({ field }) => (
            <FeedOptionGroup
              label="스타일"
              options={STYLE_OPTIONS}
              value={field.value}
              onChange={(value) => {
                const newStyles = Array.isArray(value) ? value : value ? [value] : [];
                field.onChange(newStyles);
              }}
              multiSelect
            />
          )}
        />
        <S.SubmitButton
          type="button"
          onClick={handleSubmit}
          $disabled={!isValid || isSubmitting}
          disabled={!isValid || isSubmitting}
        >
          게시하기
        </S.SubmitButton>
      </S.FormContainer>
    </>
  );
}
