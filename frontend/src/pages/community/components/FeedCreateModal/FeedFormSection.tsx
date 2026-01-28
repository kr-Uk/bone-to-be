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
        {/* Content Textarea */}
        <FeedTextarea value={content} onChange={onContentChange} maxLength={2200} />

        {/* Body Type Selection */}
        <FeedOptionGroup
          label="골격 유형"
          options={BODY_TYPE_OPTIONS}
          value={bodyType}
          onChange={onBodyTypeChange}
        />

        {/* Gender Selection */}
        <FeedOptionGroup
          label="성별"
          options={GENDER_OPTIONS}
          value={gender}
          onChange={onGenderChange}
        />

        {/* Height & Weight Input */}
        <FeedInputGroup
          heightValue={height}
          weightValue={weight}
          onHeightChange={onHeightChange}
          onWeightChange={onWeightChange}
        />

        {/* Style Selection */}
        <FeedOptionGroup
          label="스타일"
          options={STYLE_OPTIONS}
          value={styles}
          onChange={onStylesChange}
          multiSelect
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
