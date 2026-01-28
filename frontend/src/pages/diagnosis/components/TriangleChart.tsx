import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  type ChartOptions,
  type TooltipItem,
} from "chart.js";
import { motion } from "framer-motion";
import { Radar } from "react-chartjs-2";
import styled from "styled-components";

import triangleLabelsPlugin, {
  type TriangleLabelsOptions,
} from "@/shared/plugins/triangleLabelsPlugin";

// Register Chart.js components and custom plugin
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  triangleLabelsPlugin,
);

const ChartContainer = styled(motion.div)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

interface TriangleChartProps {
  straight: number; // 0-100
  wave: number; // 0-100
  natural: number; // 0-100
}

const TriangleChart = ({ straight, wave, natural }: TriangleChartProps) => {
  const data = {
    labels: ["STRAIGHT", "WAVE", "NATURAL"],
    datasets: [
      {
        label: "Body Type Analysis",
        data: [straight, wave, natural],
        backgroundColor: "rgba(152, 16, 250, 0.2)", // brand color with opacity
        borderColor: "#9810FA", // brand color
        borderWidth: 2,
        pointBackgroundColor: "#9810FA",
        pointBorderColor: "#FAFAFA",
        pointHoverBackgroundColor: "#FAFAFA",
        pointHoverBorderColor: "#9810FA",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options: ChartOptions<"radar"> & {
    plugins?: { triangleLabels?: TriangleLabelsOptions };
  } = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          display: false, // Hide tick labels
          stepSize: 50,
        },
        grid: {
          color: "#525252", // gray[600]
          lineWidth: 1,
        },
        angleLines: {
          color: "#525252", // gray[600]
          lineWidth: 1,
        },
        pointLabels: {
          display: false, // Hide default labels - using custom plugin instead
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Hide legend
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#171717", // gray[900]
        titleColor: "#FAFAFA", // gray[50]
        bodyColor: "#E5E5E5", // gray[200]
        borderColor: "#525252", // gray[600]
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context: TooltipItem<"radar">) => {
            return `${context.parsed.r}%`;
          },
        },
      },
      triangleLabels: {
        font: {
          size: 16,
          weight: "bold",
          family: "Pretendard",
        },
        color: "#A1A1A1", // gray[400]
        padding: 16,
        alignments: ["center", "right", "left"], // Straight (center), wave (right), natural (left)
      },
    },
  };

  return (
    <ChartContainer
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Radar data={data} options={options} />
    </ChartContainer>
  );
};

export default TriangleChart;
