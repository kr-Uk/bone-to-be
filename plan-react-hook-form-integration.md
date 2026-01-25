# React Hook Form 통합 계획 - BasicInfoPage

> 작성일: 2026-01-25
> 작업: BasicInfoPage에 react-hook-form 통합 및 Zustand로 페이지 간 데이터 전달

## 개요

BasicInfoPage.tsx에 react-hook-form을 통합하여 폼 상태 관리를 개선하고, Zustand를 활용해 진단 데이터를 다음 페이지로 전달합니다.

## 핵심 전략

- **기존 컴포넌트 유지**: 자식 컴포넌트(GenderSelection, BodySpecsInput, FavoriteStyleSelector)는 변경하지 않음
- **Adapter 패턴**: react-hook-form의 watch/setValue로 기존 컴포넌트와 연결
- **Zustand 활용**: 이미 설치된 Zustand로 페이지 간 데이터 전달
- **타입 안전성**: Zod + TypeScript로 폼 검증 및 타입 추론

---

## 1단계: 의존성 설치

```bash
pnpm add react-hook-form@7.54.2 zod@3.24.1 @hookform/resolvers@3.9.1
```

**선택 이유:**
- **react-hook-form**: 최소 리렌더링, 우수한 TypeScript 지원
- **zod**: TypeScript 네이티브 검증, Yup보다 작은 번들 크기
- **@hookform/resolvers**: react-hook-form ↔ zod 공식 브릿지

---

## 2단계: 타입 정의 생성

**파일**: `src/shared/types/diagnosis.ts` (신규)

```typescript
// 폼 데이터 (UI용 - string 타입)
export type BasicInfoFormData = {
  gender: "women" | "men";
  height: string;
  weight: string;
  styles: string[];
};

// API 전송용 (숫자 변환)
export type BasicInfoApiData = {
  gender: "women" | "men";
  height: number;
  weight: number;
  styles: string[];
};

// 전체 진단 데이터 (Zustand 스토어용)
export type DiagnosisData = {
  basicInfo: BasicInfoApiData | null;
  photoData: string | null;
  analysisResult: unknown | null;
};
```

---

## 3단계: Zustand 스토어 생성

**파일**: `src/shared/stores/diagnosisStore.ts` (신규)

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { DiagnosisData, BasicInfoApiData } from '@/shared/types/diagnosis';

type DiagnosisStore = {
  diagnosisData: DiagnosisData;
  setBasicInfo: (data: BasicInfoApiData) => void;
  setPhotoData: (data: string) => void;
  clearDiagnosisData: () => void;
};

export const useDiagnosisStore = create<DiagnosisStore>()(
  persist(
    (set) => ({
      diagnosisData: {
        basicInfo: null,
        photoData: null,
        analysisResult: null,
      },
      setBasicInfo: (data) =>
        set((state) => ({
          diagnosisData: { ...state.diagnosisData, basicInfo: data },
        })),
      setPhotoData: (data) =>
        set((state) => ({
          diagnosisData: { ...state.diagnosisData, photoData: data },
        })),
      clearDiagnosisData: () =>
        set({
          diagnosisData: {
            basicInfo: null,
            photoData: null,
            analysisResult: null,
          },
        }),
    }),
    {
      name: 'diagnosis-storage',
      storage: createJSONStorage(() => sessionStorage), // 탭 닫으면 자동 삭제
    }
  )
);
```

**핵심 포인트:**
- sessionStorage 사용 (진단 세션은 일시적)
- persist 미들웨어로 새로고침 시에도 데이터 유지
- 명확한 액션 함수로 데이터 관리

---

## 4단계: Zod 검증 스키마

**파일**: `src/pages/diagnosis/schemas/basicInfoSchema.ts` (신규)

```typescript
import { z } from 'zod';

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
    .refine((val) => {
      const num = parseInt(val, 10);
      return num >= 100 && num <= 250;
    }, {
      message: "키는 100~250cm 사이여야 합니다",
    }),
  weight: z
    .string()
    .min(1, "몸무게를 입력해주세요")
    .refine((val) => /^\d+$/.test(val), {
      message: "숫자만 입력 가능합니다",
    })
    .refine((val) => {
      const num = parseInt(val, 10);
      return num >= 30 && num <= 200;
    }, {
      message: "몸무게는 30~200kg 사이여야 합니다",
    }),
  styles: z.array(z.string()).default([]),
});

export type BasicInfoFormValues = z.infer<typeof basicInfoSchema>;
```

**검증 규칙:**
- 성별: 필수
- 키: 필수, 숫자, 100-250cm
- 몸무게: 필수, 숫자, 30-200kg
- 스타일: 선택사항, 배열

---

## 5단계: BasicInfoPage 리팩토링

**파일**: `src/pages/diagnosis/BasicInfoPage.tsx` (수정)

### 주요 변경사항

1. **Import 추가**
```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { basicInfoSchema, type BasicInfoFormValues } from "./schemas/basicInfoSchema";
import { useDiagnosisStore } from "@/shared/stores/diagnosisStore";
```

2. **useState 제거 → useForm 사용**
```typescript
const BasicInfoPage = () => {
  const navigate = useNavigate();
  const setBasicInfo = useDiagnosisStore((state) => state.setBasicInfo);

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<BasicInfoFormValues>({
    resolver: zodResolver(basicInfoSchema),
    mode: "onChange", // 실시간 검증
    defaultValues: {
      gender: "women",
      height: "",
      weight: "",
      styles: [],
    },
  });

  // 자식 컴포넌트에 전달할 값
  const gender = watch("gender");
  const height = watch("height");
  const weight = watch("weight");
  const styles = watch("styles");
```

3. **스타일 토글 함수 업데이트**
```typescript
  const toggleStyle = (style: string) => {
    const currentStyles = watch("styles");
    const newStyles = currentStyles.includes(style)
      ? currentStyles.filter((s) => s !== style)
      : [...currentStyles, style];
    setValue("styles", newStyles, { shouldValidate: true });
  };
```

4. **제출 핸들러 (Zustand 저장 + 다음 페이지 이동)**
```typescript
  const onSubmit = (data: BasicInfoFormValues) => {
    // API용 데이터로 변환 (string → number)
    const apiData = {
      gender: data.gender,
      height: parseInt(data.height, 10),
      weight: parseInt(data.weight, 10),
      styles: data.styles,
    };

    // Zustand 스토어에 저장
    setBasicInfo(apiData);

    // 다음 단계로 이동
    navigate("/diagnosis/photo-capture");
  };
```

5. **JSX 변경: form 태그 추가 + 에러 메시지**
```typescript
  return (
    <Container>
      <DiagnosisExplainSection {...} />
      <FormContainer>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormSection>
            <GenderSelection
              gender={gender}
              onGenderChange={(g) => setValue("gender", g, { shouldValidate: true })}
            />
            {errors.gender && <ErrorMessage>{errors.gender.message}</ErrorMessage>}
          </FormSection>

          <FormSection>
            <BodySpecsInput
              height={height}
              weight={weight}
              onHeightChange={(h) => setValue("height", h, { shouldValidate: true })}
              onWeightChange={(w) => setValue("weight", w, { shouldValidate: true })}
            />
            {errors.height && <ErrorMessage>{errors.height.message}</ErrorMessage>}
            {errors.weight && <ErrorMessage>{errors.weight.message}</ErrorMessage>}
          </FormSection>

          <FormSection>
            <FavoriteStyleSelector styles={styles} onToggleStyle={toggleStyle} />
          </FormSection>

          <StartButton type="submit" disabled={!isValid}>
            분석 시작하기 →
          </StartButton>
        </form>
      </FormContainer>
    </Container>
  );
```

6. **에러 메시지 스타일드 컴포넌트 추가**
```typescript
const ErrorMessage = styled.p`
  color: #ef4444; // 테마에 error 색상 없음
  font-size: ${({ theme }) => theme.typography.body.sm.regular.fontSize};
  margin-top: ${({ theme }) => theme.spacing.xs};
  padding-left: ${({ theme }) => theme.spacing.sm};
`;
```

**NOTE**: 현재 theme에 error 색상이 정의되지 않아 하드코딩 (#ef4444). 추후 theme에 추가 권장.

---

## 6단계: PhotoCapturePage 통합

**파일**: `src/pages/photo-capture/PhotoCapturePage.tsx` (수정)

### 주요 변경사항

1. **Import 추가**
```typescript
import { useDiagnosisStore } from "@/shared/stores/diagnosisStore";
```

2. **스토어 연결 + 가드 추가**
```typescript
const PhotoCapturePage = () => {
  const { diagnosisData, setPhotoData } = useDiagnosisStore();
  const navigate = useNavigate();

  // BasicInfo 없으면 첫 페이지로 리다이렉트
  useEffect(() => {
    if (!diagnosisData.basicInfo) {
      navigate("/diagnosis/basic-info", { replace: true });
    }
  }, [diagnosisData.basicInfo, navigate]);

  // ... 기존 코드 ...
```

3. **handleConfirm 수정 (Zustand에 저장)**
```typescript
  const handleConfirm = () => {
    if (capturedImage) {
      setPhotoData(capturedImage);

      // 콘솔에서 전체 데이터 확인
      console.log("Complete diagnosis data:", {
        basicInfo: diagnosisData.basicInfo,
        photo: capturedImage,
      });

      // TODO: 서버 전송
      alert("이미지가 저장되었습니다!");
      // navigate("/diagnosis/analysis");
    }
  };
```

---

## 검증 방법

### 수동 테스트 체크리스트

**BasicInfoPage:**
- [ ] 성별 선택 시 폼 상태 업데이트
- [ ] 키 입력 검증 (숫자만, 범위 체크)
- [ ] 몸무게 입력 검증 (숫자만, 범위 체크)
- [ ] 스타일 복수 선택 가능
- [ ] 필수 항목 미입력 시 버튼 비활성화
- [ ] 모든 검증 통과 시 버튼 활성화
- [ ] 에러 메시지 정확히 표시
- [ ] 제출 후 `/diagnosis/photo-capture`로 이동
- [ ] sessionStorage에 데이터 저장 확인 (개발자도구)

**PhotoCapturePage:**
- [ ] BasicInfo 없이 직접 접근 시 리다이렉트
- [ ] 사진 캡처/업로드 후 Zustand 저장 확인
- [ ] 콘솔에 전체 데이터 출력 확인
- [ ] 브라우저 새로고침 시 데이터 유지 (sessionStorage)
- [ ] 탭 닫고 재접속 시 데이터 초기화

### 개발자도구 확인

1. **Application > Session Storage**
   - Key: `diagnosis-storage`
   - Value: `{"state": {"diagnosisData": {...}}, "version": 0}`

2. **Console 출력**
   - PhotoCapturePage의 handleConfirm 실행 시
   - basicInfo와 photo 데이터 모두 출력 확인

---

## 주요 파일 목록

### 수정할 파일 (2개)
1. `src/pages/diagnosis/BasicInfoPage.tsx` - react-hook-form 통합
2. `src/pages/photo-capture/PhotoCapturePage.tsx` - Zustand 연동

### 신규 파일 (3개)
1. `src/shared/types/diagnosis.ts` - 타입 정의
2. `src/shared/stores/diagnosisStore.ts` - Zustand 스토어
3. `src/pages/diagnosis/schemas/basicInfoSchema.ts` - Zod 검증 스키마

### 변경하지 않는 파일 (3개)
- `src/pages/diagnosis/components/GenderSelection.tsx`
- `src/pages/diagnosis/components/BodySpecsInput.tsx`
- `src/pages/diagnosis/components/FavoriteStyleSelector.tsx`

---

## 향후 확장 (서버 연동 시)

### API 함수 예시
**파일**: `src/shared/api/diagnosis.ts` (미래)

```typescript
import type { BasicInfoApiData } from "@/shared/types/diagnosis";
import axiosInstance from "./axios";

export const diagnosisApi = {
  submitDiagnosis: async (data: {
    basicInfo: BasicInfoApiData;
    photo: string;
  }) => {
    const response = await axiosInstance.post("/api/diagnosis/analyze", data);
    return response.data;
  },
};
```

### React Query 훅 예시
**파일**: `src/pages/diagnosis/hooks/useDiagnosisSubmit.ts` (미래)

```typescript
import { useMutation } from "@tanstack/react-query";
import { diagnosisApi } from "@/shared/api/diagnosis";

export const useDiagnosisSubmit = () => {
  return useMutation({
    mutationFn: diagnosisApi.submitDiagnosis,
    onSuccess: (data) => {
      console.log("분석 완료:", data);
      // navigate("/diagnosis/result");
    },
  });
};
```

---

## 구현 순서

1. **의존성 설치** (5분)
2. **타입 정의 작성** (10분)
3. **Zustand 스토어 생성** (15분)
4. **Zod 검증 스키마 작성** (10분)
5. **BasicInfoPage 리팩토링** (30분)
6. **PhotoCapturePage 업데이트** (15분)
7. **전체 플로우 테스트** (20분)

**예상 소요 시간: 약 2시간**

---

## 기술적 결정 사항

### ✅ 선택한 방안

1. **Zustand (vs Context API)**
   - 이유: 이미 설치, 보일러플레이트 없음, 우수한 DX

2. **sessionStorage (vs localStorage)**
   - 이유: 진단은 세션 단위, 탭 간 공유 불필요

3. **Adapter 패턴 (vs Controller 직접 통합)**
   - 이유: 자식 컴포넌트 수정 최소화, 기존 로직 보존

4. **Zod (vs Yup)**
   - 이유: TypeScript 네이티브, 작은 번들, 우수한 타입 추론

5. **string 타입 유지 후 변환 (vs number 직접 사용)**
   - 이유: 기존 BodySpecsInput 동작 유지, UX 보존

### 장점
- 최소 변경으로 최대 효과
- 타입 안전성 확보
- 실시간 검증으로 UX 개선
- 페이지 간 데이터 흐름 명확
- 확장 가능한 구조

### 단점 및 해결책
- watch() 호출로 리렌더링 증가
  → 작은 폼이므로 성능 영향 미미
- theme에 error 색상 없음
  → 현재는 하드코딩, 추후 theme 확장 권장
