import type { BodyTypeRatio } from "../api/profile.types";

export interface ChartPoint {
  x: number;
  y: number;
}

export const sanitizeRatio = (ratio: BodyTypeRatio): BodyTypeRatio => {
  const total = ratio.natural + ratio.wave + ratio.straight;
  if (total <= 0) {
    return { natural: 1 / 3, wave: 1 / 3, straight: 1 / 3 };
  }

  return {
    natural: ratio.natural / total,
    wave: ratio.wave / total,
    straight: ratio.straight / total,
  };
};

export const clampRatio = (ratio: BodyTypeRatio, minWeight = 0.18): BodyTypeRatio => {
  const clamped = {
    natural: Math.max(ratio.natural, minWeight),
    wave: Math.max(ratio.wave, minWeight),
    straight: Math.max(ratio.straight, minWeight),
  };
  const total = clamped.natural + clamped.wave + clamped.straight;

  return {
    natural: clamped.natural / total,
    wave: clamped.wave / total,
    straight: clamped.straight / total,
  };
};

export const applySmoothing = (
  ratio: BodyTypeRatio,
  smoothing = 0.18,
  minWeight = 0.18,
): BodyTypeRatio => {
  const normalized = sanitizeRatio(ratio);
  const base = 1 / 3;
  const smoothed = {
    natural: normalized.natural * (1 - smoothing) + base * smoothing,
    wave: normalized.wave * (1 - smoothing) + base * smoothing,
    straight: normalized.straight * (1 - smoothing) + base * smoothing,
  };

  return clampRatio(smoothed, minWeight);
};

export const toPoint = (vertex: ChartPoint, center: ChartPoint, weight: number): ChartPoint => ({
  x: center.x + (vertex.x - center.x) * weight,
  y: center.y + (vertex.y - center.y) * weight,
});

export const toVertex = (center: ChartPoint, radius: number, degrees: number): ChartPoint => {
  const radians = (degrees * Math.PI) / 180;

  return {
    x: center.x + radius * Math.cos(radians),
    y: center.y + radius * Math.sin(radians),
  };
};

export type BodyTypeKey = "natural" | "wave" | "straight" | "unknown";

export const getBodyTypeKey = (value: string): BodyTypeKey => {
  const normalized = value.trim().toLowerCase();

  if (normalized.includes("내츄럴") || normalized.includes("natural")) {
    return "natural";
  }

  if (normalized.includes("웨이브") || normalized.includes("wave")) {
    return "wave";
  }

  if (normalized.includes("스트레이트") || normalized.includes("straight")) {
    return "straight";
  }

  return "unknown";
};

export const getBodyTypeLabels = (value: string): { badge: string; title: string } => {
  const key = getBodyTypeKey(value);

  if (key === "natural") {
    return { badge: "내츄럴", title: "Natural" };
  }

  if (key === "wave") {
    return { badge: "웨이브", title: "Wave" };
  }

  if (key === "straight") {
    return { badge: "스트레이트", title: "Straight" };
  }

  return { badge: value, title: value };
};

export const getBodyTypeBadge = (value?: string): string => {
  const normalizedValue = value?.trim() ?? "";
  const key = normalizedValue ? getBodyTypeKey(normalizedValue) : "natural";

  if (key === "natural") {
    return "NATURAL";
  }

  if (key === "wave") {
    return "WAVE";
  }

  if (key === "straight") {
    return "STRAIGHT";
  }

  return normalizedValue ? normalizedValue.toUpperCase() : "NATURAL";
};
