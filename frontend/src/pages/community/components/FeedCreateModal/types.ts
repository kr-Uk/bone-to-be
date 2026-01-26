/**
 * 피드 작성 모달 타입 정의
 */

export type BodyType = "Natural" | "Wave" | "Straight";
export type Gender = "F" | "M";

/**
 * 피드 작성 모달 Props
 */
export interface FeedCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 피드 작성 폼 데이터
 */
export interface FeedFormData {
  image: File | null;
  imagePreview: string | null;
  content: string;
  bodyType: BodyType | null;
  gender: Gender | null;
  height: string;
  weight: string;
  styles: string[];
}

/**
 * 이미지 업로드 Props
 */
export interface FeedImageUploadProps {
  imagePreview: string | null;
  onImageChange: (file: File | null) => void;
}

/**
 * 폼 섹션 Props
 */
export interface FeedFormSectionProps {
  content: string;
  bodyType: BodyType | null;
  gender: Gender | null;
  height: string;
  weight: string;
  styles: string[];
  onContentChange: (value: string) => void;
  onBodyTypeChange: (value: BodyType | null) => void;
  onGenderChange: (value: Gender | null) => void;
  onHeightChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onStylesChange: (value: string[]) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isValid: boolean;
}

/**
 * 텍스트 영역 Props
 */
export interface FeedTextareaProps {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
}

/**
 * 옵션 그룹 Props
 */
export interface FeedOptionGroupProps {
  label: string;
  icon?: React.ReactNode;
  options: { label: string; value: string }[];
  value: string | string[] | null;
  onChange: (value: string | string[] | null) => void;
  multiSelect?: boolean;
}

/**
 * 입력 그룹 Props
 */
export interface FeedInputGroupProps {
  heightValue: string;
  weightValue: string;
  onHeightChange: (value: string) => void;
  onWeightChange: (value: string) => void;
}
