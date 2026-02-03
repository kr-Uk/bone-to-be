import { useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import AnalysisDetailsSection from "./components/AnalysisDetailsSection";
import AnalysisResultCard from "./components/AnalysisResultCard";
import FitReferenceSection from "./components/FitReferenceSection";
import RecommendationSection from "./components/RecommendationSection";
import ReportHeroSection from "./components/ReportHeroSection";
import VirtualFittingSection from "./components/VirtualFittingSection";

import { useReportDetail } from "@/pages/diagnosis/api";
import { convertSkeletonTypeToBodyType } from "@/pages/diagnosis/api/diagnosis.types";
import { BODY_TYPE_METADATA } from "@/shared/constants/reportMockData";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { isForbiddenError } from "@/shared/utils/errorUtils";

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

const SectionStack = styled.section`
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 48px;
  padding: 64px 1.5rem 0;

  @media (min-width: 1024px) {
    padding-top: 80px;
  }
`;

const LeftSection = styled.aside`
  width: 480px;
  flex-shrink: 0;
`;

const ContentWrapper = styled.div<{ $isDesktop: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: ${({ $isDesktop }) => ($isDesktop ? "740px" : "100%")};
`;

// 로딩 뷰
const LoadingView = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 1rem;
  background-color: ${({ theme }) => theme.colors.gray[900]};
  color: ${({ theme }) => theme.colors.secondary};
`;

const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid ${({ theme }) => theme.colors.gray[700]};
  border-top-color: ${({ theme }) => theme.colors.purple[600]};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  font-size: ${({ theme }) => theme.typography.body.lg.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.lg.semibold.fontWeight};
  color: ${({ theme }) => theme.colors.secondary};
`;

const LoadingSubtext = styled.div`
  font-size: ${({ theme }) => theme.typography.body.md.regular.fontSize};
  color: ${({ theme }) => theme.colors.gray[400]};
`;

// 에러 뷰
const ErrorView = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 1.5rem;
  background-color: ${({ theme }) => theme.colors.gray[900]};
  color: ${({ theme }) => theme.colors.secondary};
  padding: 2rem;
`;

const ErrorIcon = styled.div`
  font-size: 64px;
`;

const ErrorTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.heading.lg.fontSize};
  font-weight: ${({ theme }) => theme.typography.heading.lg.fontWeight};
  color: ${({ theme }) => theme.colors.secondary};
`;

const ErrorMessage = styled.div`
  font-size: ${({ theme }) => theme.typography.body.md.regular.fontSize};
  color: ${({ theme }) => theme.colors.gray[400]};
  text-align: center;
`;

const ErrorButton = styled.button`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.purple[600]};
  color: ${({ theme }) => theme.colors.secondary};
  border: none;
  border-radius: 9999px;
  font-size: ${({ theme }) => theme.typography.body.md.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.md.semibold.fontWeight};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.purple[700]};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.purple[600]};
    outline-offset: 2px;
  }
`;

const ReportPage = () => {
  const navigate = useNavigate();
  const { reportId: reportIdParam } = useParams();
  const reportId = reportIdParam ? parseInt(reportIdParam, 10) : null;
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // 실시간 리포트 조회 (폴링)
  const { data: reportData, isLoading, isError, error } = useReportDetail(reportId);

  // reportId가 유효하지 않으면 홈으로 리다이렉트
  useEffect(() => {
    if (!reportId || isNaN(reportId) || reportId <= 0) {
      navigate("/", { replace: true });
    }
  }, [reportId, navigate]);

  // 에러 발생 - 로딩 체크보다 먼저 처리
  if (isError) {
    // 403 Forbidden 에러 처리
    if (isForbiddenError(error)) {
      return <Navigate to="/forbidden" replace state={{ fromForbidden: true }} />;
    }

    // 기타 에러 처리
    return (
      <ErrorView>
        <ErrorIcon>⚠️</ErrorIcon>
        <ErrorTitle>분석 결과를 불러올 수 없습니다</ErrorTitle>
        <ErrorMessage>{error?.message || "알 수 없는 오류가 발생했습니다"}</ErrorMessage>
        <ErrorButton onClick={() => navigate("/diagnosis/basic-info")}>
          처음부터 다시 시작
        </ErrorButton>
      </ErrorView>
    );
  }

  // 로딩 중
  if (isLoading || !reportData) {
    return (
      <LoadingView>
        <LoadingSpinner />
        <LoadingText>분석 결과를 불러오는 중...</LoadingText>
      </LoadingView>
    );
  }

  // 분석 대기 중 (폴링 중)
  if (reportData.status === "PENDING") {
    return (
      <LoadingView>
        <LoadingSpinner />
        <LoadingText>AI가 체형을 분석하고 있습니다...</LoadingText>
        <LoadingSubtext>잠시만 기다려주세요 (약 1-2분 소요)</LoadingSubtext>
      </LoadingView>
    );
  }

  // 분석 실패
  if (reportData.status === "FAILED") {
    return (
      <ErrorView>
        <ErrorIcon>❌</ErrorIcon>
        <ErrorTitle>분석에 실패했습니다</ErrorTitle>
        <ErrorMessage>사진을 다시 업로드하거나 고객센터에 문의해주세요</ErrorMessage>
        <ErrorButton onClick={() => navigate("/diagnosis/photo-capture")}>
          사진 다시 촬영하기
        </ErrorButton>
      </ErrorView>
    );
  }

  // 분석 완료 - Null Safety 체크
  const bodyTypeKey = convertSkeletonTypeToBodyType(reportData.skeletonType);
  const metadata = BODY_TYPE_METADATA[bodyTypeKey];

  const ratios = {
    straight: reportData.straightRate || 0,
    wave: reportData.waveRate || 0,
    natural: reportData.naturalRate || 0,
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
              straight={ratios.straight}
              wave={ratios.wave}
              natural={ratios.natural}
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
              straight={ratios.straight}
              wave={ratios.wave}
              natural={ratios.natural}
              dominantType={bodyTypeKey}
              strengthDescription={metadata.strengthDescription}
            />
          )}

          <FitReferenceSection fitReferences={metadata.fitReferences} />

        </ContentWrapper>
      </MainContent>

      <SectionStack>
        {/* 상세 골격 분석 섹션 (11개 지표) */}
        {reportData.details &&
          Array.isArray(reportData.details) &&
          reportData.details.length > 0 && <AnalysisDetailsSection metrics={reportData.details} />}

        <RecommendationSection
          doRecommendations={metadata.doRecommendations}
          dontRecommendations={metadata.dontRecommendations}
        />

        {/* VirtualFittingSection은 details 데이터가 있을 때만 표시 */}
        {reportData.details &&
          Array.isArray(reportData.details) &&
          reportData.details.length > 0 && (
            <VirtualFittingSection
              imageUrl={"/images/virtual-fitting-placeholder.png"}
              title="가상 피팅 준비 중"
              description="곧 이용하실 수 있습니다"
              tags={[]}
              onTryAnother={() => {}}
            />
          )}
      </SectionStack>
    </PageContainer>
  );
};

export default ReportPage;
