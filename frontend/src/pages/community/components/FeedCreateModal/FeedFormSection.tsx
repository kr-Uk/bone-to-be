import * as S from "./FeedFormSection.styles";
import { FeedInputGroup } from "./FeedInputGroup";
import { FeedOptionGroup } from "./FeedOptionGroup";
import { FeedTextarea } from "./FeedTextarea";

import type { FeedFormSectionProps } from "./types";

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

export function FeedFormSection({
  content,
  bodyType,
  gender,
  height,
  weight,
  styles,
  onContentChange,
  onBodyTypeChange,
  onGenderChange,
  onHeightChange,
  onWeightChange,
  onStylesChange,
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
        {/* Profile Header */}
        <S.ProfileHeader>
          <S.Avatar>
            <S.AvatarPlaceholder>👤</S.AvatarPlaceholder>
          </S.Avatar>
          <S.Username>사용자</S.Username>
        </S.ProfileHeader>

        {/* Content Textarea */}
        <FeedTextarea value={content} onChange={onContentChange} maxLength={2200} />

        {/* Body Type Selection */}
        <FeedOptionGroup
          label="Body Type"
          options={BODY_TYPE_OPTIONS}
          value={bodyType}
          onChange={onBodyTypeChange}
        />

        {/* Gender Selection */}
        <FeedOptionGroup label="Gender" options={GENDER_OPTIONS} value={gender} onChange={onGenderChange} />

        {/* Height & Weight Input */}
        <FeedInputGroup
          heightValue={height}
          weightValue={weight}
          onHeightChange={onHeightChange}
          onWeightChange={onWeightChange}
        />

        {/* Style Selection */}
        <FeedOptionGroup
          label="Style"
          options={STYLE_OPTIONS}
          value={styles}
          onChange={onStylesChange}
          multiSelect
        />
      </S.FormContainer>

      {/* Submit Button */}
      <S.SubmitButtonContainer>
        {!isValid && !isSubmitting && (
          <div
            role="alert"
            aria-live="polite"
            aria-atomic="true"
            style={{
              position: "absolute",
              bottom: "50px",
              right: "0",
              fontSize: "12px",
              color: "#A1A1A1",
              whiteSpace: "nowrap",
            }}
          >
            필수 항목을 입력해주세요
          </div>
        )}
        <S.SubmitButton type="button" onClick={handleSubmit} $disabled={!isValid || isSubmitting} disabled={!isValid || isSubmitting}>
          {isSubmitting ? "등록 중..." : "등록"}
        </S.SubmitButton>
      </S.SubmitButtonContainer>
    </>
  );
}
