import styled from "styled-components";

import type { BodyTypeKey } from "@/shared/constants/reportMockData";

const HeroContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[600]};

  @media (min-width: 768px) {
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 5px 13px;
  border: 1px solid ${({ theme }) => theme.colors.brand};
  border-radius: 4px;
  font-size: ${({ theme }) => theme.typography.body.sm.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.sm.semibold.fontWeight};
  color: ${({ theme }) => theme.colors.brand};
  text-transform: uppercase;
  letter-spacing: 1px;
  width: fit-content;

  @media (min-width: 768px) {
    border-radius: 6px;
    padding: 4.625px 12.625px;
    font-size: ${({ theme }) => theme.typography.body.sm.semibold.fontSize};
    letter-spacing: 1.2px;
  }
`;

const Title = styled.h1`
  font-size: 42px;
  font-weight: ${({ theme }) => theme.typography.heading["4xl"].fontWeight};
  color: ${({ theme }) => theme.colors.gray[50]};
  letter-spacing: -2.4px;
  line-height: 40px;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 72px;
    line-height: 96px;
  }

  @media (min-width: 1024px) {
    font-size: 96px;
    line-height: 96px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7.375px;
  max-width: 512px;
`;

const Tagline = styled.p`
  font-size: ${({ theme }) => theme.typography.body.lg.medium.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.lg.medium.fontWeight};
  color: ${({ theme }) => theme.colors.gray[200]};
  line-height: 32px;
  margin: 0;
  text-align: left;

  @media (min-width: 768px) {
    font-size: 32px;
  }

  @media (min-width: 1024px) {
    text-align: right;
  }
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.body.sm.regular.fontSize};
  font-weight: 300;
  color: ${({ theme }) => theme.colors.gray[400]};
  line-height: 22.75px;
  margin: 0;
  text-align: left;
  white-space: pre-wrap;

  @media (min-width: 768px) {
    font-size: ${({ theme }) => theme.typography.body.lg.regular.fontSize};
  }

  @media (min-width: 1024px) {
    text-align: right;
  }
`;

interface ReportHeroSectionProps {
  bodyTypeKey: BodyTypeKey;
  korean: string;
  tagline: string;
  description: string;
}

const ReportHeroSection = ({
  bodyTypeKey,
  korean,
  tagline,
  description,
}: ReportHeroSectionProps) => {
  return (
    <HeroContainer>
      <div>
        <Badge>{korean}</Badge>
        <Title>{bodyTypeKey.toUpperCase()}</Title>
      </div>
      <ContentWrapper>
        <Tagline>"{tagline}"</Tagline>
        <Description>{description}</Description>
      </ContentWrapper>
    </HeroContainer>
  );
};

export default ReportHeroSection;
