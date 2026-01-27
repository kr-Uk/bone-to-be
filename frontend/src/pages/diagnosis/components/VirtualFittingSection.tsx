import styled from "styled-components";

import StyleTag from "./StyleTag";

const Section = styled.section`
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

const Card = styled.div`
  backdrop-filter: blur(6px);
  background: ${({ theme }) => theme.colors.gray[800]};
  border: 1px solid ${({ theme }) => theme.colors.gray[600]};
  border-radius: 12px;
  box-shadow: 0px 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const ImageContainer = styled.div`
  background: ${({ theme }) => theme.colors.gray[900]};
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 339px;
  flex-shrink: 0;

  @media (min-width: 768px) {
    width: 254px;
    min-height: auto;
  }

  @media (min-width: 1024px) {
    aspect-ratio: 404.34 / 539.11;
    width: auto;
    flex: 1;
  }
`;

const PlaceholderText = styled.p`
  font-size: ${({ theme }) => theme.typography.body.md.regular.fontSize};
  color: ${({ theme }) => theme.colors.gray[600]};
  line-height: 20px;
  margin: 0;
  text-align: center;
`;

const VirtualImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.xxl};
  gap: ${({ theme }) => theme.spacing.xxl};
`;

const ContentTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const GeneratedLabel = styled.p`
  font-size: ${({ theme }) => theme.typography.body.sm.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.sm.semibold.fontWeight};
  color: ${({ theme }) => theme.colors.brand};
  line-height: 16px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  margin: 0;
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: ${({ theme }) => theme.typography.heading.lg.fontWeight};
  color: ${({ theme }) => theme.colors.gray[50]};
  line-height: 32px;
  margin: 0;

  @media (min-width: 768px) {
    font-size: ${({ theme }) => theme.typography.heading.lg.fontSize};
  }
`;

const FittingDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.body.lg.regular.fontSize};
  font-weight: 300;
  color: ${({ theme }) => theme.colors.gray[400]};
  line-height: 22.75px;
  margin: 0;
  padding-top: 7.25px;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-top: ${({ theme }) => theme.spacing.lg};
`;

const Button = styled.button`
  width: 100%;
  background: ${({ theme }) => theme.colors.gray[50]};
  color: ${({ theme }) => theme.colors.gray[900]};
  padding: 8px ${({ theme }) => theme.spacing.lg};
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  font-size: 12px;
  font-weight: ${({ theme }) => theme.typography.body.lg.semibold.fontWeight};
  line-height: 20px;
  text-align: center;

  &:hover {
    background: ${({ theme }) => theme.colors.gray[200]};
  }

  @media (min-width: 768px) {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
    font-size: ${({ theme }) => theme.typography.body.md.semibold.fontSize};
  }
`;

interface VirtualFittingSectionProps {
  imageUrl: string;
  title: string;
  description: string;
  tags: string[];
  onTryAnother?: () => void;
}

const VirtualFittingSection = ({
  imageUrl,
  title,
  description,
  tags,
  onTryAnother,
}: VirtualFittingSectionProps) => {
  const isPlaceholder = imageUrl.includes("placeholder");

  return (
    <Section>
      <SectionHeader>
        <Heading>AI Virtual Fitting</Heading>
        <Description>고객님의 사진에 어울리는 스타일을 가상으로 입혀봅니다.</Description>
      </SectionHeader>

      <Card>
        <ImageContainer>
          {isPlaceholder ? (
            <PlaceholderText>[ User&apos;s Virtual Fit Image ]</PlaceholderText>
          ) : (
            <VirtualImage src={imageUrl} alt={title} loading="lazy" />
          )}
        </ImageContainer>

        <ContentContainer>
          <ContentTop>
            <GeneratedLabel>Generated by AI</GeneratedLabel>
            <Title>&quot;{title}&quot;</Title>
            <FittingDescription>{description}</FittingDescription>
            <TagsContainer>
              {tags.map((tag) => (
                <StyleTag key={tag}>{tag}</StyleTag>
              ))}
            </TagsContainer>
          </ContentTop>

          <Button onClick={onTryAnother}>다른 스타일 입어보기</Button>
        </ContentContainer>
      </Card>
    </Section>
  );
};

export default VirtualFittingSection;
