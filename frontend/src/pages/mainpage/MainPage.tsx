import styled, { css, keyframes } from "styled-components";

import { BodyTypeScrollShowcase } from "./components/BodyTypeScrollShowcase";
import { MainAnalysisSection } from "./components/MainAnalysisSection";
import { MainProgressSection } from "./components/MainProgressSection";
import { MainSection } from "./components/MainSection";

import type { AppTheme } from "@/shared/styles/theme";

import { MainHeader } from "@/shared/components/MainHeader";

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
  return (
    <Container>
<<<<<<< HEAD
      <MainHeader />
=======

>>>>>>> f2ad1c6739fa1655671b60aa668cb5798e05af55

      <MainSection categoryItems={categoryItems} />
      <BodyTypeScrollShowcase />
      <MainProgressSection />
      <MainAnalysisSection />

      <FinalCTASection>
        <FinalTitle>Ready to find yours?</FinalTitle>
        <FinalDescription>
          지금 바로 AI 골격 진단을 시작하고, 나만의 스타일을 찾아보세요.
        </FinalDescription>
        <FinalCTAButton>지금 무료로 진단하기</FinalCTAButton>
      </FinalCTASection>
    </Container>
  );
};

<<<<<<< HEAD
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

const reveal = keyframes`
  from { width: 0; }
  to { width: 100%; }
=======


const HeroSection = styled.section`
  padding: 120px 48px;
  text-align: center;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, transparent 100%);
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Subtitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #666;
  letter-spacing: 2px;
  margin-bottom: 16px;
  text-transform: uppercase;
`;

const MainTitle = styled.h1`
  font-size: 80px;
  font-weight: 800;
  color: #000;
  margin-bottom: 24px;
  line-height: 1.1;
`;

const Title = styled.h2`
  font-size: 48px;
  font-weight: 800;
  color: #000;
  margin-bottom: 12px;
`;

const Description = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.8;
  margin-bottom: 32px;
`;

const CTAButton = styled.button`
  background-color: #000;
  color: #fff;
  border: none;
  padding: 14px 32px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const CategoryBar = styled.div`
  background-color: #000;
  color: #fff;
  padding: 20px 48px;
  display: flex;
  gap: 32px;
  overflow-x: auto;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #fff;
    border-radius: 2px;
  }
`;

const Category = styled.div`
  white-space: nowrap;
  cursor: pointer;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.7;
  }
`;

const DataDrivenSection = styled.section`
  padding: 80px 48px;
  background-color: #f8f8f8;
`;

const DataDrivenContent = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 60px;
  gap: 60px;
`;

const DataDrivenTitle = styled.div`
  flex: 1;
`;

const DataDrivenDescription = styled.p`
  flex: 1;
  font-size: 16px;
  color: #666;
  line-height: 1.8;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  padding: 40px 32px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
  }
`;

const CardIcon = styled.div`
  font-size: 48px;
  margin-bottom: 24px;
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #000;
  margin-bottom: 16px;
`;

const CardDescription = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.7;
`;

const BeyondTrendSection = styled.section`
  padding: 80px 48px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ImageBox = styled.div`
  position: relative;
`;

const PlaceholderImage = styled.div`
  background-color: #e0e0e0;
  aspect-ratio: 3 / 4;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const ImageText = styled.div`
  color: #999;
  font-size: 14px;
`;

const AnalysisLabel = styled.div`
  font-size: 12px;
  color: #666;
  font-weight: 600;
`;

const TrendContent = styled.div``;

const TrendTitle = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: #000;
`;

const TrendSubtitle = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #666;
  margin-bottom: 24px;
`;

const TrendDescription = styled.p`
  font-size: 15px;
  color: #666;
  line-height: 1.8;
  margin-bottom: 24px;
`;

const BulletList = styled.div`
  list-style: none;
  margin-bottom: 32px;
`;

const BulletItem = styled.li`
  font-size: 14px;
  color: #000;
  margin-bottom: 12px;
  font-weight: 500;
`;

const ViewCommunityButton = styled.button`
  background-color: transparent;
  color: #000;
  border: none;
  padding: 0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.7;
  }
>>>>>>> f2ad1c6739fa1655671b60aa668cb5798e05af55
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
