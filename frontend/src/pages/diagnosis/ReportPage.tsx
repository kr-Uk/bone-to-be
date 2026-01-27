import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import AnalysisResultCard from "./components/AnalysisResultCard";
import ReportHeroSection from "./components/ReportHeroSection";

import { BODY_TYPE_METADATA, type BodyTypeKey } from "@/shared/constants/reportMockData";
import { useDiagnosisStore } from "@/shared/stores/diagnosisStore";

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(90deg, rgb(0, 0, 0) 0%, rgb(0, 0, 0) 100%),
    linear-gradient(90deg, rgb(250, 250, 250) 0%, rgb(250, 250, 250) 100%);
  padding-bottom: 80px;
`;

const MainContent = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: 128px 24px 0;
  display: flex;
  flex-direction: column;
  gap: 48px;

  @media (min-width: 768px) {
    padding: 100px 32px 0;
  }

  @media (min-width: 1024px) {
    padding: 128px 320px 0;
    flex-direction: row;
    gap: 32px;
  }
`;

const LeftSection = styled.aside`
  width: 100%;

  @media (min-width: 1024px) {
    width: 389.33px;
    flex-shrink: 0;
  }
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;

  @media (min-width: 1024px) {
    width: 810.67px;
  }
`;

const PlaceholderSection = styled.div`
  backdrop-filter: blur(10px);
  background: ${({ theme }) => theme.colors.gray[900]};
  border: 1px solid ${({ theme }) => theme.colors.gray[600]};
  border-radius: 16px;
  box-shadow: 0px 25px 50px -12px rgba(0, 0, 0, 0.5);
  padding: ${({ theme }) => theme.spacing.xxl};
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
`;

const PlaceholderText = styled.p`
  font-size: ${({ theme }) => theme.typography.body.lg.medium.fontSize};
  color: ${({ theme }) => theme.colors.gray[400]};
  text-align: center;
`;

const ReportPage = () => {
  const navigate = useNavigate();
  const diagnosisData = useDiagnosisStore((state) => state.diagnosisData);
  const analysisResult = diagnosisData.analysisResult;

  // Redirect if no analysis result
  useEffect(() => {
    if (!analysisResult) {
      navigate("/diagnosis/basic-info");
    }
  }, [analysisResult, navigate]);

  if (!analysisResult) {
    return null;
  }

  // Get body type metadata
  const bodyTypeKey = analysisResult.bodyType.toLowerCase() as BodyTypeKey;
  const metadata = BODY_TYPE_METADATA[bodyTypeKey] || BODY_TYPE_METADATA.natural;

  // Get ratios
  const { straight, wave, natural } = analysisResult.bodyTypeRatio;

  return (
    <PageContainer>
      <MainContent>
        <LeftSection>
          <AnalysisResultCard
            straight={straight}
            wave={wave}
            natural={natural}
            dominantType={bodyTypeKey}
            strengthDescription={metadata.strengthDescription}
          />
        </LeftSection>

        <RightSection>
          <ReportHeroSection
            bodyTypeKey={bodyTypeKey}
            korean={metadata.korean}
            tagline={metadata.tagline}
            description={metadata.description}
          />

          <PlaceholderSection>
            <PlaceholderText>
              Standard Fit Reference, Recommendations, Virtual Fitting 섹션은 Phase 2에서
              구현됩니다.
            </PlaceholderText>
          </PlaceholderSection>
        </RightSection>
      </MainContent>
    </PageContainer>
  );
};

export default ReportPage;
