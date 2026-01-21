import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
`;

const LeftPanel = styled.div`
  display: none;
  background-color: #000;
  color: #fff;
  padding: 4rem;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;

  @media (min-width: 1024px) {
    display: flex;
    width: 50%;
  }
`;

const LeftPanelContent = styled.div``;

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 8rem;
`;

const LeftPanelText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StepIndicator = styled.p`
  font-size: 0.875rem;
  color: #9ca3af;
  letter-spacing: 0.05em;
`;

const Title = styled.h2`
  font-size: 3rem;
  font-family: serif;
  font-style: italic;
  line-height: 1.2;
`;

const Description = styled.p`
  font-size: 0.875rem;
  color: #9ca3af;
  margin-top: 1.5rem;
`;

const DecorativeBackground = styled.div`
  position: absolute;
  inset: 0;
  z-index: -10;
  opacity: 0.2;
`;

const PurplePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: purple;
  clip-path: ellipse(40% 50% at 50% 100%);
`;

const ProgressSteps = styled.div`
  display: flex;
  gap: 2rem;
  font-size: 0.875rem;
`;

const ProgressStep = styled.span<{ $active?: boolean }>`
  font-weight: ${(props) => (props.$active ? "bold" : "normal")};
  color: ${(props) => (props.$active ? "#fff" : "#4b5563")};
`;

const RightPanel = styled.div`
  width: 100%;
  background-color: #fff;
  padding: 2rem;
  display: flex;
  flex-direction: column;

  @media (min-width: 1024px) {
    width: 50%;
    padding: 4rem;
  }
`;

const MobileHeader = styled.div`
  margin-bottom: 2rem;

  @media (min-width: 1024px) {
    display: none;
  }
`;

const MobileHeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const MobileLogo = styled.h1`
  font-size: 1.25rem;
  font-weight: bold;
`;

const MenuButton = styled.button`
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
`;

const MobileStepIndicator = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
`;

const MobileTitle = styled.h2`
  font-size: 1.875rem;
  font-family: serif;
  font-style: italic;
`;

const FormContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 28rem;
  margin: 0 auto;
  width: 100%;
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 1rem;
`;

const GenderGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const GenderButton = styled.button<{ $selected: boolean }>`
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 2px solid ${(props) => (props.$selected ? "#000" : "#e5e7eb")};
  background-color: ${(props) => (props.$selected ? "#000" : "#fff")};
  color: ${(props) => (props.$selected ? "#fff" : "#9ca3af")};
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    border-color: ${(props) => (props.$selected ? "#000" : "#d1d5db")};
  }
`;

const GenderLetter = styled.div`
  font-size: 1.875rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
`;

const GenderText = styled.div`
  font-size: 0.875rem;
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;

  &:focus {
    outline: none;
    border-color: #000;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const StyleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const StyleHint = styled.span`
  font-size: 0.75rem;
  color: #9ca3af;
`;

const StyleOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const StyleButton = styled.button<{ $selected: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  border: 1px solid ${(props) => (props.$selected ? "#000" : "#d1d5db")};
  background-color: ${(props) => (props.$selected ? "#000" : "#fff")};
  color: ${(props) => (props.$selected ? "#fff" : "#4b5563")};
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    border-color: #000;
  }
`;

const StartButton = styled.button`
  width: 100%;
  background-color: #000;
  color: #fff;
  padding: 1rem;
  border-radius: 9999px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background-color: #1f2937;
  }
`;

const BasicInfoPage = () => {
  const navigate = useNavigate();
  const [gender, setGender] = useState<"women" | "men">("women");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [styles, setStyles] = useState<string[]>([]);

  const styleOptions = ["Minimal", "Casual", "Street", "Feminine", "Vintage", "Sporty", "Formal"];

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
      <LeftPanel>
        <LeftPanelContent>
          <Logo>BONE:TOBE</Logo>
          <LeftPanelText>
            <StepIndicator>STEP 01. BASIC INFO</StepIndicator>
            <Title>
              Before we
              <br />
              scan your
              <br />
              bone structure.
            </Title>
            <Description>
              정확한 AI 골격분석을 위해 기본 정보를 입력해주세요.
              <br />
              입력된 데이터는, 운영중..
            </Description>
          </LeftPanelText>
        </LeftPanelContent>

        <DecorativeBackground>
          <PurplePlaceholder />
        </DecorativeBackground>

        <ProgressSteps>
          <ProgressStep $active>01 Basic Info</ProgressStep>
          <ProgressStep>02 Photo Scan</ProgressStep>
          <ProgressStep>03 Analysis</ProgressStep>
        </ProgressSteps>
      </LeftPanel>

      <RightPanel>
        <MobileHeader>
          <MobileHeaderTop>
            <MobileLogo>BONE:TOBE</MobileLogo>
            <MenuButton>☰</MenuButton>
          </MobileHeaderTop>
          <MobileStepIndicator>STEP 01</MobileStepIndicator>
          <MobileTitle>Basic Info</MobileTitle>
        </MobileHeader>

        <FormContainer>
          <FormSection>
            <Label>GENDER</Label>
            <GenderGrid>
              <GenderButton $selected={gender === "women"} onClick={() => setGender("women")}>
                <GenderLetter>W</GenderLetter>
                <GenderText>Women</GenderText>
              </GenderButton>
              <GenderButton $selected={gender === "men"} onClick={() => setGender("men")}>
                <GenderLetter>M</GenderLetter>
                <GenderText>Men</GenderText>
              </GenderButton>
            </GenderGrid>
          </FormSection>

          <FormSection>
            <Label>BODY SPECS</Label>
            <InputGrid>
              <Input
                type="number"
                placeholder="Height (cm)"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Weight (kg)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </InputGrid>
          </FormSection>

          <FormSection>
            <StyleHeader>
              <Label>FAVORITE STYLE</Label>
              <StyleHint>* 복수 선택 가능</StyleHint>
            </StyleHeader>
            <StyleOptions>
              {styleOptions.map((style) => (
                <StyleButton
                  key={style}
                  $selected={styles.includes(style)}
                  onClick={() => toggleStyle(style)}
                >
                  {style}
                </StyleButton>
              ))}
            </StyleOptions>
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
