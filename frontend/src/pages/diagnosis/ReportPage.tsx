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
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { useDiagnosisStore } from "@/shared/stores/diagnosisStore";

const PageContainer = styled.div`
  min-height: 100vh;
  background:
    linear-gradient(90deg, rgb(0, 0, 0) 0%, rgb(0, 0, 0) 100%),
    linear-gradient(90deg, rgb(250, 250, 250) 0%, rgb(250, 250, 250) 100%);
  padding-bottom: 80px;
  padding: 1.25rem 1.5rem;
`;

const HeroWrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;

  @media (min-width: 768px) {
    padding: 128px 1.5rem 48px;
  }
`;

const MainContent = styled.main<{ $isDesktop: boolean }>`
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: ${({ $isDesktop }) => ($isDesktop ? "row" : "column")};
  gap: ${({ $isDesktop }) => ($isDesktop ? "32px" : "48px")};

  @media (min-width: 768px) {
    padding: 0 1.5rem;
  }
`;

const LeftSection = styled.aside`
  width: 389.33px;
  flex-shrink: 0;
`;

const ContentWrapper = styled.div<{ $isDesktop: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: ${({ $isDesktop }) => ($isDesktop ? "810.67px" : "100%")};
`;

const ReportPage = () => {
  const navigate = useNavigate();
  const diagnosisData = useDiagnosisStore((state) => state.diagnosisData);
  const analysisResult = diagnosisData.analysisResult;
  const [virtualFittingIndex, setVirtualFittingIndex] = useState(0);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // Development mock data
  const mockAnalysisResult = import.meta.env.DEV
    ? {
        analysisId: "mock-id",
        bodyType: "natural",
        bodyTypeRatio: {
          straight: 25,
          wave: 30,
          natural: 45,
        },
        measurements: {
          shoulderWidth: 42,
          waistWidth: 30,
          hipWidth: 38,
        },
        recommendations: [],
        processedAt: new Date().toISOString(),
      }
    : null;

  // Use mock data in development if no real data
  const currentAnalysisResult = analysisResult || mockAnalysisResult;

  // Redirect if no analysis result (only in production)
  useEffect(() => {
    if (!currentAnalysisResult) {
      navigate("/diagnosis/basic-info");
    }
  }, [currentAnalysisResult, navigate]);

  if (!currentAnalysisResult) {
    return null;
  }

  // Get body type metadata
  const bodyTypeKey = currentAnalysisResult.bodyType.toLowerCase() as BodyTypeKey;
  const metadata = BODY_TYPE_METADATA[bodyTypeKey] || BODY_TYPE_METADATA.natural;

  // Get ratios
  const { straight, wave, natural } = currentAnalysisResult.bodyTypeRatio;

  // Get current virtual fitting data
  const currentVirtualFitting = VIRTUAL_FITTING_OPTIONS[virtualFittingIndex];

  const handleTryAnotherStyle = () => {
    // Cycle through virtual fitting options
    setVirtualFittingIndex((prev) => (prev + 1) % VIRTUAL_FITTING_OPTIONS.length);
  };

  return (
    <PageContainer>
      {/* Hero Section at the top, independent of layout */}
      <HeroWrapper>
        <ReportHeroSection
          bodyTypeKey={bodyTypeKey}
          korean={metadata.korean}
          tagline={metadata.tagline}
          description={metadata.description}
        />
      </HeroWrapper>

      {/* Main content area with responsive layout */}
      <MainContent $isDesktop={isDesktop}>
        {/* Desktop: Chart in left sidebar */}
        {isDesktop && (
          <LeftSection>
            <AnalysisResultCard
              straight={straight}
              wave={wave}
              natural={natural}
              dominantType={bodyTypeKey}
              strengthDescription={metadata.strengthDescription}
            />
          </LeftSection>
        )}

        {/* Content wrapper for both desktop and mobile */}
        <ContentWrapper $isDesktop={isDesktop}>
          {/* Mobile: Chart appears before content sections */}
          {!isDesktop && (
            <AnalysisResultCard
              straight={straight}
              wave={wave}
              natural={natural}
              dominantType={bodyTypeKey}
              strengthDescription={metadata.strengthDescription}
            />
          )}

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
        </ContentWrapper>
      </MainContent>
    </PageContainer>
  );
};

export default ReportPage;
