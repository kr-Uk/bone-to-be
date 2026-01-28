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
  gap: 2rem;
  align-items: center;

  @media (min-width: 1024px) {
    /* position: sticky;
    top: 100px; */
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
        <TriangleChart straight={straight} wave={wave} natural={natural} />
      </ChartSection>

      <SkeletonStrengthBar percentage={dominantPercentage} description={strengthDescription} />
    </Card>
  );
};

export default AnalysisResultCard;
