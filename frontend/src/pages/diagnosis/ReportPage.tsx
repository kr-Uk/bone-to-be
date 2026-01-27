import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import AnalysisResultCard from "./components/AnalysisResultCard";
import FitReferenceSection from "./components/FitReferenceSection";
import RecommendationSection from "./components/RecommendationSection";
import ReportHeroSection from "./components/ReportHeroSection";
import VirtualFittingSection from "./components/VirtualFittingSection";

import {
  BODY_TYPE_METADATA,
  VIRTUAL_FITTING_OPTIONS,
  type BodyTypeKey,
} from "@/shared/constants/reportMockData";
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

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ReportPage = () => {
  const navigate = useNavigate();
  const diagnosisData = useDiagnosisStore((state) => state.diagnosisData);
  const analysisResult = diagnosisData.analysisResult;
  const [virtualFittingIndex, setVirtualFittingIndex] = useState(0);

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

  // Get current virtual fitting data
  const currentVirtualFitting = VIRTUAL_FITTING_OPTIONS[virtualFittingIndex];

  const handleTryAnotherStyle = () => {
    // Cycle through virtual fitting options
    setVirtualFittingIndex((prev) => (prev + 1) % VIRTUAL_FITTING_OPTIONS.length);
  };

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

          <ContentSection>
            <FitReferenceSection fitReferences={metadata.fitReferences} />

            <RecommendationSection
              doRecommendations={metadata.doRecommendations}
              dontRecommendations={metadata.dontRecommendations}
            />

            <VirtualFittingSection
              key={virtualFittingIndex}
              imageUrl={currentVirtualFitting.imageUrl}
              title={currentVirtualFitting.title}
              description={currentVirtualFitting.description}
              tags={currentVirtualFitting.tags}
              onTryAnother={handleTryAnotherStyle}
            />
          </ContentSection>
        </RightSection>
      </MainContent>
    </PageContainer>
  );
};

export default ReportPage;
