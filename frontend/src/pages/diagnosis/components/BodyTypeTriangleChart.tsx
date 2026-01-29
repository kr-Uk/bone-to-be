import TriangleChart from "@/shared/components/charts/TriangleChart";

/**
 * Props for body type specific triangle chart.
 * Maintains backward compatibility with the original TriangleChart interface.
 */
interface BodyTypeTriangleChartProps {
  straight: number; // 0-100
  wave: number; // 0-100
  natural: number; // 0-100
}

/**
 * Body type specific wrapper around the generic TriangleChart component.
 * This maintains the original API while using the reusable chart implementation.
 *
 * Converts body type percentages into the generic chart format with
 * appropriate labels, alignments, and styling for the body type analysis domain.
 *
 * @param straight - Percentage for STRAIGHT body type (0-100)
 * @param wave - Percentage for WAVE body type (0-100)
 * @param natural - Percentage for NATURAL body type (0-100)
 */
const BodyTypeTriangleChart = ({ straight, wave, natural }: BodyTypeTriangleChartProps) => {
  return (
    <TriangleChart
      data={[straight, wave, natural]}
      labels={["STRAIGHT", "WAVE", "NATURAL"]}
      customLabels={{
        enabled: true,
        font: {
          size: 16,
          weight: "bold",
          family: "Pretendard",
        },
        color: "#A1A1A1", // gray[400]
        padding: 16,
        alignments: ["center", "right", "left"], // Straight (top center), Wave (right), Natural (left)
      }}
      // Uses default brand purple color from TriangleChart defaults
    />
  );
};

export default BodyTypeTriangleChart;
