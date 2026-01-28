import { motion } from "framer-motion";
import styled, { css, keyframes, useTheme } from "styled-components";

import type { AppTheme } from "@/shared/styles/theme";
import { NaturalShape, StraightShape, WaveShape } from "@/shared/components/BoneShapes";

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

type Props = {
  categoryItems: string[];
};

export const MainSection = ({ categoryItems }: Props) => {
  const theme = useTheme() as AppTheme;
  const lineColor = theme.colors.brand;
  const lineOpacity = 0.5;
  const dotColor = theme.colors.brand;

  return (
    <>
      <HeroSection>
        <HeroBg aria-hidden="true">
          <StraightShape $floatAnimation={floatStraight} $duration="8s" />
          <WaveShape $floatAnimation={floatWave} $duration="10s" />
          <NaturalShape $floatAnimation={floatNatural} $duration="12s" />
          <HeroSvg viewBox="0 0 1440 700" preserveAspectRatio="none">
            <motion.path
              d="M-60,190 C260,310 520,340 720,340 C980,340 1220,290 1500,190"
              fill="none"
              stroke={lineColor}
              strokeOpacity={lineOpacity}
              strokeWidth="0.4rem"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.2, ease: "easeInOut" }}
            />
            <motion.circle
              r="0.3125rem"
              fill={dotColor}
              style={{
                offsetPath: 'path("M-60,190 C260,310 520,340 720,340 C980,340 1220,290 1500,190")',
              }}
              initial={{ offsetDistance: "0%" }}
              animate={{ offsetDistance: "100%" }}
              transition={{ duration: 2.2, ease: "easeInOut" }}
            />
            <motion.path
              d="M-60,510 C260,390 520,360 720,360 C980,360 1220,410 1500,510"
              fill="none"
              stroke={lineColor}
              strokeOpacity={lineOpacity}
              strokeWidth="0.4rem"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.2, ease: "easeInOut", delay: 0.1 }}
            />
            <motion.circle
              r="0.3125rem"
              fill={dotColor}
              style={{
                offsetPath: 'path("M-60,510 C260,390 520,360 720,360 C980,360 1220,410 1500,510")',
              }}
              initial={{ offsetDistance: "0%" }}
              animate={{ offsetDistance: "100%" }}
              transition={{ duration: 2.2, ease: "easeInOut", delay: 0.1 }}
            />
          </HeroSvg>
        </HeroBg>

        <HeroContent>
          <TypeLine text="AI SKELETAL ANALYSIS SERVICE" delay={0} speed={0.02} variant="subtitle" />
          <TypeBlock>
            <TypeLine text="Find Your" delay={0.15} speed={0.045} variant="title" />
            <TypeLine text="Originality." delay={0.35} speed={0.045} variant="title2" />
          </TypeBlock>

          <DescWrap
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7, duration: 0.25 }}
          >
            <DescLine
              initial={{ x: -1.125, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.7, duration: 0.35, ease: "easeOut" }}
            >
              살이 찌거나 빠져도 변하지 않는 고유의 <strong>골격(Bone)</strong>을 분석하여,
            </DescLine>
            <DescLine
              initial={{ x: -1.125, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.7, duration: 0.35, ease: "easeOut" }}
            >
              가장 잘 어울리는 스타일을 제안합니다.
            </DescLine>
          </DescWrap>

          <CtaMotion
            initial={{ y: -0.625, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2.1, duration: 0.45, ease: "easeOut" }}
          >
            <CTAButton>내 골격 진단하기 →</CTAButton>
          </CtaMotion>
        </HeroContent>
      </HeroSection>

      <CategoryBar>
        <CategoryTrack>
          <CategoryGroup>
            {categoryItems.map((item) => (
              <Category key={`category-${item}`}>{item}</Category>
            ))}
          </CategoryGroup>
          <CategoryGroup aria-hidden="true">
            {categoryItems.map((item) => (
              <Category key={`category-duplicate-${item}`}>{item}</Category>
            ))}
          </CategoryGroup>
        </CategoryTrack>
      </CategoryBar>
    </>
  );
};

const HeroSection = styled.section`
  position: relative;
  padding: 5.3rem 3rem;
  text-align: center;
  min-height: 37.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.gray[900]};

  @media (max-width: 1024px) {
    padding: 6.5rem 2rem;
    min-height: 32rem;
  }

  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
    min-height: auto;
  }
`;

const HeroBg = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
`;

const HeroSvg = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
`;

const floatStraight = keyframes`
  0% { transform: translateY(0) rotate(10deg) scale(1); }
  50% { transform: translateY(-2.5rem) rotate(15deg) scale(1.05); }
  100% { transform: translateY(0) rotate(10deg) scale(1); }
`;

const floatWave = keyframes`
  0% { transform: translate(0, 0) rotate(-10deg) scale(1); }
  50% { transform: translate(1.875rem, 2.5rem) rotate(0deg) scale(1.1); }
  100% { transform: translate(0, 0) rotate(-10deg) scale(1); }
`;

const floatNatural = keyframes`
  0% { transform: rotate(0deg) translateY(0) scale(1); }
  33% { transform: rotate(10deg) translateY(-1.875rem) scale(1.1); }
  66% { transform: rotate(-5deg) translateY(1.25rem) scale(0.95); }
  100% { transform: rotate(0deg) translateY(0) scale(1); }
`;


const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 56.25rem;
  margin: 0 auto;

  @media (max-width: 1024px) {
    max-width: 42rem;
  }

  @media (max-width: 768px) {
    max-width: 22rem;
  }
`;

const reveal = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const TypeRow = styled.div<{
  $delay: number;
  $duration: number;
  $variant: "subtitle" | "title" | "title2";
}>`
  position: relative;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  width: 0;
  animation: ${reveal} ${({ $duration }) => $duration}s steps(60, end) forwards;
  animation-delay: ${({ $delay }) => $delay}s;

  ${({ $variant, theme }) =>
    $variant === "subtitle" &&
    css`
      letter-spacing: 0.125rem;
      text-transform: uppercase;
      color: ${theme.colors.brand};
      ${withTypography((t) => t.typography.body.md.semibold)};
      margin-bottom: 1rem;

      @media (max-width: 768px) {
        letter-spacing: 0.1rem;
        margin-bottom: 0.75rem;
      }
    `}

  ${({ $variant, theme }) =>
    $variant === "title" &&
    css`
      font-size: 8rem;
      font-weight: 800;
      background: linear-gradient(
        180deg,
        ${theme.colors.purple[900]} 0%,
        ${theme.colors.purple[700]} 47.6%,
        ${theme.colors.brand} 100%
      );
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      -webkit-text-fill-color: transparent;
      line-height: 8rem;

      @media (max-width: 1024px) {
        font-size: 5rem;
        line-height: 5.5rem;
      }

      @media (max-width: 768px) {
        font-size: 3rem;
        line-height: 3.5rem;
      }
    `}

  ${({ $variant, theme }) =>
    $variant === "title2" &&
    css`
      font-size: 8rem;
      font-weight: 800;
      background: linear-gradient(
        180deg,
        ${theme.colors.brand} 0.01%,
        ${theme.colors.purple[200]} 100%
      );
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      -webkit-text-fill-color: transparent;
      margin-bottom: 2.2rem;

      @media (max-width: 1024px) {
        font-size: 5rem;
        margin-bottom: 2.5rem;
      }

      @media (max-width: 768px) {
        font-size: 3rem;
        margin-bottom: 2rem;
      }
    `}
`;

const TypeBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TypeLine = ({
  text,
  delay,
  speed,
  variant,
}: {
  text: string;
  delay: number;
  speed: number;
  variant: "subtitle" | "title" | "title2";
}) => {
  const duration = Math.max(0.15, text.length * speed);
  return (
    <TypeRow $delay={delay} $duration={duration} $variant={variant}>
      {text}
    </TypeRow>
  );
};

const DescWrap = styled(motion.div)`
  margin: 0 auto 2rem;
  max-width: 51.25rem;

  > p {
    color: ${({ theme }) => theme.colors.gray[400]};
  }

  @media (max-width: 768px) {
    max-width: 22rem;
    margin-bottom: 1.5rem;
  }
`;

const DescLine = styled(motion.p)`
  margin: 0;
  color: ${({ theme }) => theme.colors.textLight};
  ${withTypography((theme) => theme.typography.body.lg.regular)};

  @media (max-width: 768px) {
    ${withTypography((theme) => theme.typography.body.md.regular)};
  }

  strong {
    font-weight: 700;
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const CtaMotion = styled(motion.div)`
  display: flex;
  justify-content: center;
`;

const CTAButton = styled.button`
  background-color: ${({ theme }) => theme.colors.brand};
  color: ${({ theme }) => theme.colors.secondary};
  border: none;
  padding: 0.875rem 2rem;
  border-radius: 1.875rem;
  ${withTypography((theme) => theme.typography.body.md.semibold)};
  cursor: pointer;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 18rem;
  }

  &:hover {
    transform: translateY(-0.125rem);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.2);
  }
`;

const scrollLeft = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`;

const CategoryBar = styled.div`
  background-color: ${({ theme }) => theme.colors.purple[900]};
  color: ${({ theme }) => theme.colors.gray[50]};
  padding: 1.25rem 3rem;
  overflow: hidden;
  position: relative;
  --category-gap: 2rem;
  --category-speed: 28s;

  @media (max-width: 1024px) {
    padding: 1rem 2rem;
    --category-gap: 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 0.75rem 1.25rem;
    --category-gap: 1.25rem;
    --category-speed: 22s;
  }
`;

const CategoryTrack = styled.div`
  display: flex;
  width: max-content;
  align-items: center;
  animation: ${scrollLeft} var(--category-speed) linear infinite;
  will-change: transform;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transform: translateX(0);
  }
`;

const CategoryGroup = styled.div`
  display: flex;
  align-items: center;
  gap: var(--category-gap);
  padding-right: var(--category-gap);
`;

const Category = styled.div`
  ${withTypography((theme) => theme.typography.body.sm.medium)};
  white-space: nowrap;
  transition: opacity 0.3s ease;
  letter-spacing: 0.0625rem;
  text-transform: uppercase;

  @media (max-width: 768px) {
    letter-spacing: 0.04rem;
  }

  &:hover {
    opacity: 0.7;
  }
`;
