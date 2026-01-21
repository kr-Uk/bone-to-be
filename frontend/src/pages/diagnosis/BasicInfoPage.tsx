import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { useMediaQuery } from "@/shared/hooks";

import BodySpecsInput from "./components/BodySpecsInput";
import DiagnosisLeftPanel from "./components/DiagnosisLeftPanel";
import FavoriteStyleSelector from "./components/FavoriteStyleSelector";
import GenderSelection from "./components/GenderSelection";
import { MobileHeaderContent, MobileHeaderTop } from "./components/MobileHeader";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
`;

const RightPanel = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;

  @media (min-width: 1024px) {
    width: 50%;
    padding: ${({ theme }) => theme.spacing.xxxl};
  }
`;

const FormContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 28rem;
  margin: 0 auto;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.xxl};
`;

const FormSection = styled.div`
  /* margin-bottom: ${({ theme }) => theme.spacing.xl}; */
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
`;

const BasicInfoPage = () => {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [gender, setGender] = useState<"women" | "men">("women");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [styles, setStyles] = useState<string[]>([]);

  const toggleStyle = (style: string) => {
    setStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style],
    );
  };

  const handleStartScan = () => {
    navigate("/diagnosis/photo-capture");
  };

  return (
    <Container>
      {isDesktop && (
        <DiagnosisLeftPanel
          currentStep={1}
          stepLabel="STEP 01. BASIC INFO"
          title={
            <>
              Before we
              <br />
              scan your
              <br />
              bone structure.
            </>
          }
          description={<>정확한 AI 골격분석을 위해 기본 정보를 입력해주세요.</>}
        />
      )}

      <RightPanel>
        {!isDesktop && <MobileHeaderTop />}

        <FormContainer>
          {!isDesktop && <MobileHeaderContent stepLabel="STEP 01" title="Basic Info" />}

          <FormSection>
            <GenderSelection gender={gender} onGenderChange={setGender} />
          </FormSection>

          <FormSection>
            <BodySpecsInput
              height={height}
              weight={weight}
              onHeightChange={setHeight}
              onWeightChange={setWeight}
            />
          </FormSection>

          <FormSection>
            <FavoriteStyleSelector styles={styles} onToggleStyle={toggleStyle} />
          </FormSection>

          <StartButton onClick={handleStartScan}>
            Start Scan
            <span>→</span>
          </StartButton>
        </FormContainer>
      </RightPanel>
    </Container>
  );
};

export default BasicInfoPage;
