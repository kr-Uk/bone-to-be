import type { Chart, Plugin, RadialLinearScale } from "chart.js";

/**
 * Custom Chart.js plugin for rendering triangle radar chart labels with per-vertex alignment.
 *
 * This plugin addresses the limitation of Chart.js v4.5.1 where pointLabels do not support
 * per-vertex text alignment control. It manually renders labels after the chart is drawn
 * with custom alignment for each vertex:
 * - Index 0 (top-right "WAVE"): right-aligned
 * - Index 1 (bottom "NATURAL"): center-aligned
 * - Index 2 (top-left "STRAIGHT"): left-aligned
 *
 * The plugin uses a two-phase approach:
 * 1. beforeLayout: Measures label widths and sets layout.padding to prevent overflow
 * 2. afterDraw: Renders labels in the reserved space
 */

export interface TriangleLabelsOptions {
  font?: {
    size?: number;
    weight?: string | number;
    family?: string;
  };
  color?: string;
  padding?: number;
  alignments?: CanvasTextAlign[];
}

/**
 * Extracts plugin options from chart configuration
 */
function getPluginOptions(chart: Chart): TriangleLabelsOptions | undefined {
  const pluginsOptions = chart.options.plugins as Record<string, unknown> | undefined;
  return pluginsOptions?.triangleLabels as TriangleLabelsOptions | undefined;
}

/**
 * Renders custom labels with per-vertex alignment
 */
function drawLabels(chart: Chart, options: TriangleLabelsOptions): void {
  // Access the radial scale and cast to RadialLinearScale
  const scale = chart.scales.r as RadialLinearScale | undefined;
  if (!scale) return;

  const ctx = chart.ctx;
  const labels = (chart.data.labels || []) as string[];

  // Extract font configuration with proper defaults
  const fontSize = options.font?.size ?? 16;
  const fontWeight = options.font?.weight ?? "bold";
  const fontFamily = options.font?.family ?? "Pretendard";
  const color = options.color ?? "#A1A1A1";
  const padding = options.padding ?? 20;
  const alignments = options.alignments ?? ["right", "center", "left"];

  // Set font for text measurement and rendering
  ctx.font = `${String(fontWeight)} ${fontSize}px ${fontFamily}`;
  ctx.fillStyle = color;
  ctx.textBaseline = "middle";

  // Draw each label with custom alignment
  labels.forEach((label, index) => {
    // Get the position of the point on the outer edge plus padding
    const distance = scale.drawingArea + padding;
    const position = scale.getPointPosition(index, distance);

    // Set alignment based on vertex index
    const alignment = alignments[index] ?? "center";
    ctx.textAlign = alignment;

    // Adjust vertical position slightly below the vertex
    const yOffset = 5; // Slight downward offset for better visual alignment

    // Draw the label
    ctx.fillText(label, position.x, position.y + yOffset);
  });
}

const triangleLabelsPlugin: Plugin = {
  id: "triangleLabels",

  /**
   * beforeLayout: Calculate required padding to prevent label overflow
   * Runs before chart layout calculation to reserve space for labels
   */
  beforeLayout: (chart: Chart) => {
    const options = getPluginOptions(chart);
    if (!options) return;

    const ctx = chart.ctx;
    const labels = (chart.data.labels || []) as string[];

    // Set font for accurate measurement
    const fontSize = options.font?.size ?? 16;
    const fontWeight = options.font?.weight ?? "bold";
    const fontFamily = options.font?.family ?? "Pretendard";
    ctx.font = `${String(fontWeight)} ${fontSize}px ${fontFamily}`;

    // Measure maximum label width
    let maxLabelWidth = 0;
    labels.forEach((label) => {
      const metrics = ctx.measureText(label);
      maxLabelWidth = Math.max(maxLabelWidth, metrics.width);
    });

    // Calculate required padding
    // Formula: (max label width / 2) + user padding + safety margin
    const userPadding = options.padding ?? 20;
    const requiredPadding = Math.ceil(maxLabelWidth / 2 + userPadding + 10);

    // Set layout padding dynamically
    if (!chart.options.layout) chart.options.layout = {};
    chart.options.layout.padding = requiredPadding;
  },

  /**
   * afterDraw: Render labels in the reserved space
   * Runs after chart is drawn to overlay custom labels
   */
  afterDraw: (chart: Chart) => {
    const options = getPluginOptions(chart);
    if (options) drawLabels(chart, options);
  },
};

export default triangleLabelsPlugin;
