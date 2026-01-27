import { motion } from "framer-motion";
import styled from "styled-components";

import SkeletonStrengthBar from "./SkeletonStrengthBar";
import TriangleChart from "./TriangleChart";

const Card = styled(motion.div)`
  backdrop-filter: blur(10px);
  background: ${({ theme }) => theme.colors.gray[900]};
  border: 1px solid ${({ theme }) => theme.colors.gray[600]};
  border-radius: 16px;
  box-shadow: 0px 25px 50px -12px rgba(0, 0, 0, 0.5);
  padding: 33px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxl};
  align-items: center;

  @media (min-width: 1024px) {
    position: sticky;
    top: 0;
    align-self: flex-start;
  }
`;

const Heading = styled.h3`
  font-size: ${({ theme }) => theme.typography.heading.lg.fontSize};
  font-weight: ${({ theme }) => theme.typography.heading.lg.fontWeight};
  color: ${({ theme }) => theme.colors.brand};
  text-align: center;
  letter-spacing: 0.7px;
  text-transform: uppercase;
  margin: 0;
`;

const ChartSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  align-items: center;
  width: 100%;
`;

const ChartLabel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
`;

const LabelTitle = styled.p`
  font-size: 20px;
  font-weight: ${({ theme }) => theme.typography.heading.sm.fontWeight};
  color: ${({ theme }) => theme.colors.gray[400]};
  line-height: 16px;
  margin: 0;
  text-align: center;
`;

const LabelValue = styled.p`
  font-size: ${({ theme }) => theme.typography.body.lg.regular.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.lg.regular.fontWeight};
  color: ${({ theme }) => theme.colors.gray[600]};
  line-height: 15px;
  margin: 0;
`;

const PercentageLabels = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 291.34px;
  padding-bottom: 2.5px;
`;

const PercentageItem = styled.div<{ $isHighlighted?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 6.5px;
  align-items: flex-start;

  &:last-child {
    align-items: flex-end;
  }

  p:first-child {
    font-size: 20px;
    font-weight: ${({ theme }) => theme.typography.heading.sm.fontWeight};
    color: ${({ theme, $isHighlighted }) =>
      $isHighlighted ? theme.colors.brand : theme.colors.gray[400]};
    line-height: 16px;
    margin: 0;
  }

  p:last-child {
    font-size: ${({ theme }) => theme.typography.body.lg.regular.fontSize};
    font-weight: ${({ theme }) => theme.typography.body.lg.regular.fontWeight};
    color: ${({ theme, $isHighlighted }) =>
      $isHighlighted ? theme.colors.brand : theme.colors.gray[600]};
    line-height: 15px;
    margin: 0;
  }
`;

interface AnalysisResultCardProps {
  straight: number;
  wave: number;
  natural: number;
  dominantType: "straight" | "wave" | "natural";
  strengthDescription?: string;
}

const AnalysisResultCard = ({
  straight,
  wave,
  natural,
  dominantType,
  strengthDescription,
}: AnalysisResultCardProps) => {
  // Calculate skeleton strength based on dominant type percentage
  const dominantPercentage =
    dominantType === "straight" ? straight : dominantType === "wave" ? wave : natural;

  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Heading>AI 분석결과</Heading>

      <ChartSection>
        <ChartLabel>
          <LabelTitle>STRAIGHT</LabelTitle>
          <LabelValue>{straight}%</LabelValue>
        </ChartLabel>

        <TriangleChart straight={straight} wave={wave} natural={natural} />

        <PercentageLabels>
          <PercentageItem $isHighlighted={dominantType === "wave"}>
            <p>WAVE</p>
            <p>{wave}%</p>
          </PercentageItem>
          <PercentageItem $isHighlighted={dominantType === "natural"}>
            <p>NATURAL</p>
            <p>{natural}%</p>
          </PercentageItem>
        </PercentageLabels>
      </ChartSection>

      <SkeletonStrengthBar
        percentage={dominantPercentage}
        description={strengthDescription}
      />
    </Card>
  );
};

export default AnalysisResultCard;
