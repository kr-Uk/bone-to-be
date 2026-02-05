import type AOS from "aos";
import { lazy, useCallback, useEffect, useRef } from "react";
import styled, { css } from "styled-components";

import { MainSection } from "./components/MainSection";

import { LazySection } from "@/shared/components/LazySection";
import type { AppTheme } from "@/shared/styles/theme";

import { useProtectedNavigate } from "@/shared/hooks/useProtectedNavigate";

const BodyTypeScrollShowcase = lazy(async () => {
  const mod = await import("./components/BodyTypeScrollShowcase");
  return { default: mod.BodyTypeScrollShowcase };
});

const MainProgressSection = lazy(async () => {
  const mod = await import("./components/MainProgressSection");
  return { default: mod.MainProgressSection };
});

const MainAnalysisSection = lazy(async () => {
  const mod = await import("./components/MainAnalysisSection");
  return { default: mod.MainAnalysisSection };
});

type TypographyToken = {
  fontSize: string;
  fontWeight: number;
  lineHeight: number;
};

const applyTypography = (styles: TypographyToken) => css`
  font-size: ${styles.fontSize};
  font-weight: ${styles.fontWeight};
  line-height: ${styles.lineHeight};
`;

const withTypography = (getToken: (theme: AppTheme) => TypographyToken) => css`
  ${({ theme }) => applyTypography(getToken(theme as AppTheme))};
`;

const categoryItems = [
  "AI SKELETAL TYPE",
  "BONE TYPE",
  "MATERIAL TYPE",
  "WRINKLE TERMINOLOGY",
  "FOREHEAD SIZE",
  "PERSONALIZE STYLING",
  "STRAIGHT TYPE",
  "GAME TYPE",
  "NATURAL CARE",
];

const MainPage = () => {
  const protectedNavigate = useProtectedNavigate();
  const aosRef = useRef<AOS | null>(null);
  const refreshAos = useCallback(() => {
    aosRef.current?.refresh();
  }, []);

  useEffect(() => {
    let cancelled = false;

    const initAos = async () => {
      const mod = await import("aos");
      if (cancelled) return;
      const instance = mod.default;
      aosRef.current = instance;
      instance.init({
        once: true,
        duration: 600,
        easing: "ease-out",
      });
    };

    const scheduleInit = () => {
      const win = window as Window & {
        requestIdleCallback?: (cb: IdleRequestCallback, options?: IdleRequestOptions) => number;
        cancelIdleCallback?: (id: number) => void;
      };

      if (win.requestIdleCallback) {
        const idleId = win.requestIdleCallback(() => {
          void initAos();
        }, { timeout: 1500 });
        return () => win.cancelIdleCallback?.(idleId);
      }

      const timeoutId = window.setTimeout(() => {
        void initAos();
      }, 400);
      return () => window.clearTimeout(timeoutId);
    };

    const cancelSchedule = scheduleInit();
    return () => {
      cancelled = true;
      cancelSchedule?.();
    };
  }, []);

  const handleFinalCtaClick = () => {
    protectedNavigate("/diagnosis/basic-info");
  };

  return (
    <Container>
      <MainSection categoryItems={categoryItems} />
      <LazySection minHeight="660vh" onVisible={refreshAos}>
        <BodyTypeScrollShowcase />
      </LazySection>
      <LazySection minHeight="80vh" onVisible={refreshAos}>
        <MainProgressSection />
      </LazySection>
      <LazySection minHeight="80vh" onVisible={refreshAos}>
        <MainAnalysisSection />
      </LazySection>

      <FinalCTASection>
        <FinalTitle>Ready to find yours?</FinalTitle>
        <FinalDescription>
          지금 바로 AI 골격 진단을 시작하고, 나만의 스타일을 찾아보세요.
        </FinalDescription>
        <FinalCTAButton type="button" onClick={handleFinalCtaClick}>
          지금 무료로 진단하기
        </FinalCTAButton>
      </FinalCTASection>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  font-family:
    "Pretendard Variable",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Helvetica,
    Arial,
    sans-serif;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
`;

const FinalCTASection = styled.section`
  background-color: ${({ theme }) => theme.colors.purple[800]};
  color: ${({ theme }) => theme.colors.secondary};
  padding: 4.5rem 3rem;
  text-align: center;

  @media (max-width: 1024px) {
    padding: 6.5rem 2rem;
  }

  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`;

const FinalTitle = styled.div`
  ${withTypography((theme) => theme.typography.heading["3xl"])};
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    ${withTypography((theme) => theme.typography.heading["2xl"])};
  }
`;

const FinalDescription = styled.p`
  ${withTypography((theme) => theme.typography.body.lg.regular)};
  color: ${({ theme }) => theme.colors.gray[400]};
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    ${withTypography((theme) => theme.typography.body.md.regular)};
  }
`;

const FinalCTAButton = styled.button`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.primary};
  border: none;
  padding: 1rem 2rem;
  border-radius: 0.625rem;
  ${withTypography((theme) => theme.typography.body.sm.semibold)};
  cursor: pointer;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 18rem;
  }

  &:hover {
    transform: translateY(-0.125rem);
    box-shadow: 0 0.5rem 1rem rgba(255, 255, 255, 0.2);
  }
`;

export default MainPage;
