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

import {
  DEFAULT_CHART_OPTIONS,
  DEFAULT_CUSTOM_LABELS,
  DEFAULT_SCALE,
  DEFAULT_TOOLTIP,
} from "./TriangleChart.types";

import type { TriangleChartProps } from "./TriangleChart.types";

import triangleLabelsPlugin from "@/shared/plugins/triangleLabelsPlugin";


// Register Chart.js components
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

/**
 * Generic TriangleChart component for rendering radar charts with 3 vertices.
 *
 * @param data - Array of 3 numeric values (typically 0-100)
 * @param labels - Array of 3 label strings for each vertex
 * @param chartOptions - Optional styling for the chart area and points
 * @param customLabels - Optional configuration for custom label rendering plugin
 * @param scale - Optional scale configuration (min, max, grid colors)
 * @param tooltip - Optional tooltip configuration
 * @param animate - Whether to animate the chart on mount (default: true)
 * @param className - Optional CSS class name
 *
 * @example
 * ```tsx
 * <TriangleChart
 *   data={[70, 20, 10]}
 *   labels={["STRAIGHT", "WAVE", "NATURAL"]}
 *   customLabels={{
 *     enabled: true,
 *     alignments: ["center", "right", "left"]
 *   }}
 * />
 * ```
 */
const TriangleChart = ({
  data,
  labels,
  chartOptions,
  customLabels,
  scale,
  tooltip,
  animate = true,
  className,
}: TriangleChartProps) => {
  // Merge chart options with defaults
  const mergedChartOptions = {
    ...DEFAULT_CHART_OPTIONS,
    ...chartOptions,
  };

  // Merge scale options with defaults
  const mergedScale = {
    ...DEFAULT_SCALE,
    ...scale,
  };

  // Merge tooltip options with defaults
  const mergedTooltip = {
    ...DEFAULT_TOOLTIP,
    ...tooltip,
  };

  // Merge custom labels options with defaults
  const mergedCustomLabels = {
    ...DEFAULT_CUSTOM_LABELS,
    ...customLabels,
    enabled: customLabels?.enabled ?? DEFAULT_CUSTOM_LABELS.enabled,
  };

  const numericData = data.map((value) => Number(value));
  const maxValue = Math.max(...numericData);
  const normalizedData = maxValue > 0 && maxValue <= 1 ? numericData.map((value) => value * 100) : numericData;

  const chartData = {
    labels,
    datasets: [
      {
        label: "Analysis",
        data: normalizedData,
        backgroundColor: mergedChartOptions.backgroundColor,
        borderColor: mergedChartOptions.borderColor,
        borderWidth: mergedChartOptions.borderWidth,
        pointBackgroundColor: mergedChartOptions.pointBackgroundColor,
        pointBorderColor: mergedChartOptions.pointBorderColor,
        pointHoverBackgroundColor: mergedChartOptions.pointHoverBackgroundColor,
        pointHoverBorderColor: mergedChartOptions.pointHoverBorderColor,
        pointRadius: mergedChartOptions.pointRadius,
        pointHoverRadius: mergedChartOptions.pointHoverRadius,
      },
    ],
  };

  const options: ChartOptions<"radar"> = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        min: mergedScale.min,
        max: mergedScale.max,
        ticks: {
          display: false,
          stepSize: mergedScale.stepSize,
        },
        grid: {
          color: mergedScale.gridColor,
          lineWidth: 1,
        },
        angleLines: {
          color: mergedScale.angleLineColor,
          lineWidth: 1,
        },
        pointLabels: {
          display: false, // Hide default labels when using custom plugin
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: mergedTooltip.enabled,
        backgroundColor: mergedTooltip.backgroundColor,
        titleColor: mergedTooltip.titleColor,
        bodyColor: mergedTooltip.bodyColor,
        borderColor: mergedTooltip.borderColor,
        borderWidth: mergedTooltip.borderWidth,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context: TooltipItem<"radar">) => {
            return `${context.parsed.r}%`;
          },
        },
      },
      // Conditionally add custom labels plugin
      ...(mergedCustomLabels.enabled && {
        triangleLabels: {
          font: mergedCustomLabels.font,
          color: mergedCustomLabels.color,
          padding: mergedCustomLabels.padding,
          alignments: mergedCustomLabels.alignments,
        },
      }),
    },
  };

  return (
    <ChartContainer
      className={className}
      initial={animate ? { opacity: 0, scale: 0.8 } : false}
      animate={animate ? { opacity: 1, scale: 1 } : false}
      transition={animate ? { duration: 0.6, ease: "easeOut" } : undefined}
    >
      <Radar data={chartData} options={options} />
    </ChartContainer>
  );
};

export default TriangleChart;
