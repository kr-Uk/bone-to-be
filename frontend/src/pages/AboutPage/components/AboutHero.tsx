import styled, { css } from "styled-components";

import type { AppTheme } from "@/shared/styles/theme";

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

const Section = styled.section`
  text-align: center;
  margin-bottom: 8rem;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 56.25rem;
  margin: 0 auto;
  padding-top: 5rem;

  @media (max-width: 1024px) {
    max-width: 42rem;
    padding-top: 2rem;
  }

  @media (max-width: 768px) {
    max-width: 22rem;
    padding-top: 1.5rem;
  }
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
  width: auto;

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
  variant,
}: {
  text: string;
  variant: "subtitle" | "title" | "title2";
}) => {
  const duration = 0;
  return (
    <TypeRow $delay={0} $duration={duration} $variant={variant}>
      {text}
    </TypeRow>
  );
};

const DescWrap = styled.div`
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

const DescLine = styled.p`
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

export const AboutHero = () => (
  <Section>
    <HeroContent>
      <TypeLine text="스타일에 대한 이해는 골격에서부터" variant="subtitle" />
      <TypeBlock>
        <TypeLine text="Start from" variant="title" />
        <TypeLine text="Your Bone" variant="title2" />
      </TypeBlock>

      <DescWrap>
        <DescLine>
          내 스타일을 찾기 위해서는 <strong>내 골격을 먼저 이해해야 합니다.</strong>
        </DescLine>
        <DescLine>
          트렌드를 무작정 좇기보다, 타고난 프레임(Frame)을 먼저 파악하세요.
        </DescLine>
          본투비가 당신만의 고유한 골격을 찾아드립니다.
        </DescWrap>
    </HeroContent>
  </Section>
);
