import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { useMediaQuery } from "@/shared/hooks";
import { BasicInfoExplainData } from "@/shared/constants/diagnosis";

import BodySpecsInput from "./components/BodySpecsInput";
import DiagnosisExplainSection from "./components/DiagnosisExplainSection";
import FavoriteStyleSelector from "./components/FavoriteStyleSelector";
import GenderSelection from "./components/GenderSelection";

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
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
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
          분석 시작하기 →
        </StartButton>
      </FormContainer>
    </Container>
  );
};

export default BasicInfoPage;
