// 백엔드 허용 값 (정확한 문자열)
export const STYLE_OPTIONS = {
  ANY: 'ANY',
  BASIC: 'BASIC',
  CASUAL: 'CASUAL',
  FORMAL: 'FORMAL',
} as const;

// 타입 추출
export type StyleOption = typeof STYLE_OPTIONS[keyof typeof STYLE_OPTIONS];

// UI 표시용 한글 라벨 매핑
export const STYLE_LABELS: Record<StyleOption, string> = {
  ANY: '상관없음',
  BASIC: '베이직',
  CASUAL: '캐주얼',
  FORMAL: '포멀',
};

// 선택 가능한 옵션 배열 (UI 렌더링용)
export const SELECTABLE_STYLES: StyleOption[] = [
  STYLE_OPTIONS.ANY,
  STYLE_OPTIONS.BASIC,
  STYLE_OPTIONS.CASUAL,
  STYLE_OPTIONS.FORMAL,
];
