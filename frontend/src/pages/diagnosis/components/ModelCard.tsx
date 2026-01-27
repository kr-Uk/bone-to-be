import { motion } from "framer-motion";
import styled from "styled-components";

const Card = styled(motion.div)<{ $isBest: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  min-width: 180px;
  flex: 1 0 0;

  @media (min-width: 768px) {
    min-width: 180px;
  }
`;

const ImageContainer = styled.div<{ $isBest: boolean }>`
  position: relative;
  aspect-ratio: 259.55 / 346.07;
  background: ${({ theme }) => theme.colors.gray[800]};
  border: 1px solid
    ${({ theme, $isBest }) => ($isBest ? theme.colors.brand : theme.colors.gray[600])};
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ $isBest, theme }) =>
    $isBest &&
    `
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: ${theme.colors.brand};
      opacity: 0.05;
    }
  `}
`;

const PlaceholderText = styled.p`
  font-size: ${({ theme }) => theme.typography.body.sm.medium.fontSize};
  color: ${({ theme }) => theme.colors.gray[600]};
  line-height: 16px;
  margin: 0;
  z-index: 1;
`;

const ModelImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ModelName = styled.h4`
  font-size: 20px;
  font-weight: ${({ theme }) => theme.typography.heading.sm.fontWeight};
  color: ${({ theme }) => theme.colors.gray[200]};
  line-height: 20px;
  margin: 0;
  white-space: pre-wrap;
`;

interface ModelCardProps {
  name: string;
  imageUrl: string;
  isBest: boolean;
  index?: number;
}

const ModelCard = ({ name, imageUrl, isBest, index = 0 }: ModelCardProps) => {
  const isPlaceholder = imageUrl.includes("placeholder");

  return (
    <Card
      $isBest={isBest}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
    >
      <ImageContainer $isBest={isBest}>
        {isPlaceholder ? (
          <PlaceholderText>[Model Image]</PlaceholderText>
        ) : (
          <ModelImage src={imageUrl} alt={name} loading="lazy" />
        )}
      </ImageContainer>
      <ModelName>{name}</ModelName>
    </Card>
  );
};

export default ModelCard;
