import { motion } from "framer-motion";
import { useState } from "react";
import styled, { keyframes } from "styled-components";

import type { TryOnComparisonSectionProps } from "../api/diagnosis.types";

const Section = styled(motion.section)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  border-top: 1px solid ${({ theme }) => theme.colors.gray[600]};
  padding-top: 41px;
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Heading = styled.h2`
  font-size: 20px;
  font-weight: ${({ theme }) => theme.typography.heading.lg.fontWeight};
  color: ${({ theme }) => theme.colors.gray[50]};
  line-height: 32px;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 32px;
  }

  @media (min-width: 1024px) {
    font-size: 36px;
  }
`;

const Description = styled.p`
  font-size: 12px;
  font-weight: ${({ theme }) => theme.typography.body.lg.regular.fontWeight};
  color: ${({ theme }) => theme.colors.gray[400]};
  line-height: 20px;
  margin: 0;

  @media (min-width: 768px) {
    font-size: ${({ theme }) => theme.typography.body.lg.regular.fontSize};
  }
`;

const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: ${({ theme }) => theme.spacing.xxl};
  }
`;

const ImageCard = styled.div<{ $variant: "best" | "worst" }>`
  backdrop-filter: blur(6px);
  background: ${({ theme }) => theme.colors.gray[800]};
  border: 2px solid
    ${({ theme, $variant }) =>
      ($variant === "best" ? theme.colors.purple[600] : theme.colors.gray[600]) as string};
  border-radius: 12px;
  box-shadow: 0px 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ImageContainer = styled.div`
  position: relative;
  background: ${({ theme }) => theme.colors.gray[900]};
  aspect-ratio: 3 / 4;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const FittingImage = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImageLabel = styled.div<{ $variant: "best" | "worst" }>`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: ${({ theme, $variant }) =>
    $variant === "best" ? `${theme.colors.purple[600]}dd` : `${theme.colors.gray[700]}dd`};
  backdrop-filter: blur(10px);
  border-radius: 8px;
  font-size: ${({ theme }) => theme.typography.body.sm.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.sm.semibold.fontWeight};
  color: ${({ theme }) => theme.colors.gray[50]};
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const CardContent = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.body.lg.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.lg.semibold.fontWeight};
  color: ${({ theme }) => theme.colors.gray[50]};
  line-height: 22px;
  margin: 0;
`;

const CardDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.body.md.regular.fontSize};
  font-weight: 300;
  color: ${({ theme }) => theme.colors.gray[400]};
  line-height: 20px;
  margin: 0;
`;

// 로딩 스켈레톤 애니메이션
const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const SkeletonImageContainer = styled.div`
  aspect-ratio: 3 / 4;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.gray[800]} 0%,
    ${({ theme }) => theme.colors.gray[700]} 50%,
    ${({ theme }) => theme.colors.gray[800]} 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 2s infinite;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xxl} 0;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${({ theme }) => theme.colors.gray[700]};
  border-top-color: ${({ theme }) => theme.colors.purple[600] as string};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  font-size: ${({ theme }) => theme.typography.body.md.regular.fontSize};
  color: ${({ theme }) => theme.colors.gray[400]};
  line-height: 20px;
  margin: 0;
  text-align: center;
`;

// 에러 상태
const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.xxl};
  background: ${({ theme }) => theme.colors.gray[800]};
  border: 1px solid ${({ theme }) => theme.colors.gray[600]};
  border-radius: 12px;
`;

const ErrorIcon = styled.div`
  font-size: 48px;
`;

const ErrorMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.body.md.regular.fontSize};
  color: ${({ theme }) => theme.colors.gray[400]};
  line-height: 20px;
  margin: 0;
  text-align: center;
`;

const RetryButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.purple[600]};
  color: ${({ theme }) => theme.colors.gray[50]};
  border: none;
  border-radius: 8px;
  font-size: ${({ theme }) => theme.typography.body.md.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.md.semibold.fontWeight};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.purple[700]};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.purple[600] as string};
    outline-offset: 2px;
  }
`;

const TryOnComparisonSection = ({
  bestImageUrl,
  worstImageUrl,
  isLoading,
  isError,
  onRetry,
}: TryOnComparisonSectionProps) => {
  const [bestImageError, setBestImageError] = useState(false);
  const [worstImageError, setWorstImageError] = useState(false);

  const isTryOnReady = Boolean(bestImageUrl && worstImageUrl);

  // 로딩 상태
  if (isLoading || !isTryOnReady) {
    return (
      <Section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <SectionHeader>
          <Heading>AI Virtual Fitting</Heading>
          <Description>AI가 고객님의 체형에 맞는 스타일을 가상으로 입혀봅니다.</Description>
        </SectionHeader>

        <ComparisonGrid>
          <ImageCard $variant="best">
            <SkeletonImageContainer />
            <CardContent>
              <CardTitle>이미지 생성 중...</CardTitle>
              <CardDescription>잠시만 기다려주세요</CardDescription>
            </CardContent>
          </ImageCard>

          <ImageCard $variant="worst">
            <SkeletonImageContainer />
            <CardContent>
              <CardTitle>이미지 생성 중...</CardTitle>
              <CardDescription>잠시만 기다려주세요</CardDescription>
            </CardContent>
          </ImageCard>
        </ComparisonGrid>

        <LoadingContainer aria-live="polite">
          <LoadingSpinner />
          <LoadingText>AI가 가상 피팅 이미지를 생성하고 있습니다...</LoadingText>
        </LoadingContainer>
      </Section>
    );
  }

  // 에러 상태
  if (isError) {
    return (
      <Section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <SectionHeader>
          <Heading>AI Virtual Fitting</Heading>
          <Description>AI가 고객님의 체형에 맞는 스타일을 가상으로 입혀봅니다.</Description>
        </SectionHeader>

        <ErrorContainer>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorMessage>가상 피팅 이미지 생성 중 문제가 발생했습니다</ErrorMessage>
          {onRetry && <RetryButton onClick={onRetry}>다시 시도</RetryButton>}
        </ErrorContainer>
      </Section>
    );
  }

  // 완성 상태
  return (
    <Section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <SectionHeader>
        <Heading>AI Virtual Fitting</Heading>
        <Description>AI가 고객님의 체형에 맞는 스타일을 가상으로 입혀봅니다.</Description>
      </SectionHeader>

      <ComparisonGrid>
        {/* Best Fit */}
        <ImageCard $variant="best">
          <ImageContainer>
            {!bestImageError && bestImageUrl ? (
              <>
                <FittingImage
                  src={bestImageUrl}
                  alt="가장 잘 어울리는 가상 피팅 결과"
                  loading="lazy"
                  onError={() => setBestImageError(true)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <ImageLabel $variant="best">Best Fit</ImageLabel>
              </>
            ) : (
              <LoadingText>이미지를 불러올 수 없습니다</LoadingText>
            )}
          </ImageContainer>
          <CardContent>
            <CardTitle>가장 잘 어울려요</CardTitle>
            <CardDescription>이 스타일이 고객님의 체형에 가장 적합합니다</CardDescription>
          </CardContent>
        </ImageCard>

        {/* Worst Fit */}
        <ImageCard $variant="worst">
          <ImageContainer>
            {!worstImageError && worstImageUrl ? (
              <>
                <FittingImage
                  src={worstImageUrl}
                  alt="피해야 할 스타일의 가상 피팅 결과"
                  loading="lazy"
                  onError={() => setWorstImageError(true)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <ImageLabel $variant="worst">Worst Fit</ImageLabel>
              </>
            ) : (
              <LoadingText>이미지를 불러올 수 없습니다</LoadingText>
            )}
          </ImageContainer>
          <CardContent>
            <CardTitle>피해야 할 스타일</CardTitle>
            <CardDescription>이 스타일은 고객님의 체형에 덜 어울립니다</CardDescription>
          </CardContent>
        </ImageCard>
      </ComparisonGrid>
    </Section>
  );
};

export default TryOnComparisonSection;
