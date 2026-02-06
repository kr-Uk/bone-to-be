import styled from "styled-components";

import type { BodyTypeKey } from "@/shared/constants/reportMockData";

import { useMediaQuery } from "@/shared/hooks/useMediaQuery";

const HeroContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[600]};
  margin-bottom: 0.75rem;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.brand};
  border-radius: 4px;
  font-size: ${({ theme }) => theme.typography.body.sm.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.sm.semibold.fontWeight};
  color: ${({ theme }) => theme.colors.brand};
  text-transform: uppercase;
  letter-spacing: 1px;
  width: fit-content;
  margin-bottom: 0.5rem;

  @media (min-width: 1024px) {
    border-radius: 6px;
    font-size: ${({ theme }) => theme.typography.body.sm.semibold.fontSize};
    letter-spacing: 1.2px;
  }
`;

const Title = styled.h1`
  font-size: 2.625rem;
  font-weight: 800;
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
  justify-content: space-between;

  @media (min-width: 1024px) {
    flex-direction: row;
  }
`;

const DescriptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 446px;
  margin-bottom: 0.75rem;

  @media (min-width: 1024px) {
    align-items: flex-end;
  }
`;

const Tagline = styled.p`
  font-size: ${({ theme }) => theme.typography.body.lg.medium.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.lg.medium.fontWeight};
  color: ${({ theme }) => theme.colors.gray[200]};
  line-height: 32px;
  margin: 0;
  text-align: left;
  margin-bottom: 0.5rem;
  white-space: nowrap;

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
  description: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
}

const ReportHeroSection = ({
  bodyTypeKey,
  korean,
  tagline,
  description,
}: ReportHeroSectionProps) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isTablet = useMediaQuery("(min-width: 768px)");

  const displayDescription = isDesktop
    ? description.desktop
    : isTablet
      ? description.tablet
      : description.mobile;

  return (
    <HeroContainer>
      <Badge>{korean}</Badge>
      <ContentWrapper>
        <Title>{bodyTypeKey.toUpperCase()}</Title>

        <DescriptionWrapper>
          <Tagline>"{tagline}"</Tagline>
          <Description>{displayDescription}</Description>
        </DescriptionWrapper>
      </ContentWrapper>
    </HeroContainer>
  );
};

export default ReportHeroSection;
