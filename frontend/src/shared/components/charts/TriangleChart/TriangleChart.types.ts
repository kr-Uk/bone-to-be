import type { TriangleLabelsOptions } from "@/shared/plugins/triangleLabelsPlugin";

export interface TriangleChartProps {
  // Data
  data: number[]; // Array of 3 values (0-100)
  labels: string[]; // Array of 3 labels

  // Styling (optional)
  chartOptions?: {
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    pointRadius?: number;
    pointBackgroundColor?: string;
    pointBorderColor?: string;
    pointHoverBackgroundColor?: string;
    pointHoverBorderColor?: string;
    pointHoverRadius?: number;
  };

  // Custom label plugin (optional)
  customLabels?: TriangleLabelsOptions & {
    enabled?: boolean;
  };

  // Scale configuration (optional)
  scale?: {
    min?: number;
    max?: number;
    stepSize?: number;
    gridColor?: string;
    angleLineColor?: string;
  };

  // Tooltip configuration (optional)
  tooltip?: {
    enabled?: boolean;
    backgroundColor?: string;
    titleColor?: string;
    bodyColor?: string;
    borderColor?: string;
    borderWidth?: number;
  };

  // Animation (optional)
  animate?: boolean;

  // Other
  className?: string;
}

// Default values for the chart
export const DEFAULT_CHART_OPTIONS = {
  backgroundColor: "rgba(152, 16, 250, 0.2)",
  borderColor: "#9810FA",
  borderWidth: 2,
  pointRadius: 4,
  pointBackgroundColor: "#9810FA",
  pointBorderColor: "#FAFAFA",
  pointHoverBackgroundColor: "#FAFAFA",
  pointHoverBorderColor: "#9810FA",
  pointHoverRadius: 6,
};

export const DEFAULT_CUSTOM_LABELS: Required<TriangleLabelsOptions> & { enabled: boolean } = {
  enabled: true,
  font: {
    size: 16,
    weight: "bold",
    family: "Pretendard",
  },
  color: "#A1A1A1",
  padding: 16,
  alignments: ["center", "right", "left"],
};

export const DEFAULT_SCALE = {
  min: 0,
  max: 100,
  stepSize: 50,
  gridColor: "#525252",
  angleLineColor: "#525252",
};

export const DEFAULT_TOOLTIP = {
  enabled: true,
  backgroundColor: "#171717",
  titleColor: "#FAFAFA",
  bodyColor: "#E5E5E5",
  borderColor: "#525252",
  borderWidth: 1,
};
