import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import BodySpecsInput from "./components/BodySpecsInput";
import DiagnosisExplainSection from "./components/DiagnosisExplainSection";
import FavoriteStyleSelector from "./components/FavoriteStyleSelector";
import GenderSelection from "./components/GenderSelection";
import { basicInfoSchema, type BasicInfoFormValues } from "./schemas/basicInfoSchema";

import type { StyleOption } from '@/shared/constants/styleOptions';

import { BasicInfoExplainData } from "@/shared/constants/diagnosis";
import { useMediaQuery } from "@/shared/hooks";
import { useDiagnosisStore } from "@/shared/stores/diagnosisStore";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column; // Default to vertical (Mobile/Tablet)

  @media (min-width: 1024px) {
    flex-direction: row; // Horizontal for Desktop
  }
`;

const FormContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  gap: ${({ theme }) => theme.spacing.xxl};
  background-color: ${({ theme }) => theme.colors.gray[900]};

  @media (min-width: 1024px) {
    width: 50%; // Take up 50% width on Desktop
    max-width: none; // Reset max-width if needed or handle internal constraints differently
    padding: ${({ theme }) => theme.spacing.xxxl};
  }

  // Ensure content inside is centered nicely on desktop
  & > * {
    max-width: 28rem;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
  }
`;

const FormSection = styled.div`
  margin-bottom: 1rem;
`;

const StartButton = styled.button`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.secondary};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 9999px;
  font-weight: ${({ theme }) => theme.typography.body.lg.semibold.fontWeight};
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[800]};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray[300]};
    color: ${({ theme }) => theme.colors.gray[500]};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #ef4444;
  font-size: ${({ theme }) => theme.typography.body.sm.regular.fontSize};
  margin-top: ${({ theme }) => theme.spacing.xs};
  padding-left: ${({ theme }) => theme.spacing.sm};
`;

const BasicInfoPage = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  const storedBasicInfo = useDiagnosisStore((state) => state.diagnosisData.basicInfo);
  const setBasicInfo = useDiagnosisStore((state) => state.setBasicInfo);
  const checkExpiration = useDiagnosisStore((state) => state.checkExpiration);

  // 만료 시간 체크
  useEffect(() => {
    checkExpiration();
  }, [checkExpiration]);

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<BasicInfoFormValues>({
    resolver: zodResolver(basicInfoSchema),
    mode: "onChange",
    defaultValues: {
      gender: "women" as const,
      height: "",
      weight: "",
      styles: "ANY" as const,
    },
  });

  // 뒤로가기 또는 재방문 시 기존 데이터 복원
  useEffect(() => {
    if (storedBasicInfo) {
      reset({
        gender: storedBasicInfo.gender,
        height: storedBasicInfo.height.toString(),
        weight: storedBasicInfo.weight.toString(),
        styles: storedBasicInfo.styles,
      });
    }
  }, [storedBasicInfo, reset]);

  // 자식 컴포넌트에 전달할 값
  const gender = watch("gender");
  const height = watch("height");
  const weight = watch("weight");
  const style = watch("styles");

  const selectStyle = (selectedStyle: StyleOption) => {
    setValue("styles", selectedStyle, { shouldValidate: true });
  };

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
    navigate("/diagnosis/photo-capture", { state: { fromInternalNav: true } });
  };

  const variant = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";
  const { title, description } = BasicInfoExplainData[variant];

  return (
    <Container>
      <DiagnosisExplainSection
        currentStep={1}
        stepLabel="STEP 01. BASIC INFO"
        title={title}
        description={description}
        variant={variant}
      />
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
              heightError={errors.height?.message}
              weightError={errors.weight?.message}
            />
          </FormSection>

          <FormSection>
            <FavoriteStyleSelector style={style} onSelectStyle={selectStyle} />
          </FormSection>

          <StartButton type="submit" disabled={!isValid}>
            분석 시작하기 →
          </StartButton>
        </form>
      </FormContainer>
    </Container>
  );
};

export default BasicInfoPage;
