import styled from "styled-components";

import ModelCard from "./ModelCard";

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
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

const BestBadge = styled.div`
  background: ${({ theme }) => theme.colors.brand};
  padding: 2px 4px;
  border-radius: 4px;
  box-shadow: 0px 0px 10px 0px rgba(124, 58, 237, 0.5);

  font-size: 8px;
  font-weight: ${({ theme }) => theme.typography.body.sm.semibold.fontWeight};
  color: ${({ theme }) => theme.colors.gray[50]};
  line-height: 15px;

  @media (min-width: 768px) {
    padding: 4px 8px;
    font-size: 10px;
  }
`;

const CardsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  overflow-x: auto;
  overflow-y: visible;
  padding-bottom: ${({ theme }) => theme.spacing.sm};

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;
  scrollbar-width: none;

  @media (min-width: 768px) {
    overflow-x: scroll;
  }

  @media (min-width: 1024px) {
    overflow-x: visible;
  }
`;

interface FitReference {
  name: string;
  imageUrl: string;
  isBest: boolean;
}

interface FitReferenceSectionProps {
  fitReferences: FitReference[];
}

const FitReferenceSection = ({ fitReferences }: FitReferenceSectionProps) => {
  return (
    <Section>
      <Header>
        <Heading>Standard Fit Reference</Heading>
        <BestBadge>BEST</BestBadge>
      </Header>
      <CardsContainer>
        {fitReferences.map((ref, index) => (
          <ModelCard
            key={ref.name}
            name={ref.name}
            imageUrl={ref.imageUrl}
            isBest={ref.isBest}
            index={index}
          />
        ))}
      </CardsContainer>
    </Section>
  );
};

export default FitReferenceSection;
