import { motion } from "framer-motion";
import { Info, SearchCheck } from "lucide-react";

import "./style.css";

import type { ReportDetailMetric } from "../api/diagnosis.types";

interface MetricRangeIndicatorProps {
  metric: ReportDetailMetric;
  isOpen: boolean;
  selectedIndex?: 0 | 1 | 2;
}

const getZoneIndex = (metric: ReportDetailMetric): 0 | 1 | 2 => {
  const { min, max } = metric.rangeMeta;
  const clampedScore = Math.max(min, Math.min(max, metric.score));

  for (let i = 0; i < metric.zones.length; i += 1) {
    if (clampedScore <= metric.zones[i].max) {
      return i as 0 | 1 | 2;
    }
  }

  return 2;
};

const getZoneWidths = (metric: ReportDetailMetric): number[] => {
  const { min, max } = metric.rangeMeta;
  const totalRange = max - min;

  return metric.zones.map((zone, index) => {
    const prevMax = index === 0 ? min : metric.zones[index - 1].max;
    return ((zone.max - prevMax) / totalRange) * 100;
  });
};

const MetricRangeIndicator = ({
  metric,
  isOpen,
  selectedIndex,
}: MetricRangeIndicatorProps) => {
  const metricKeyLabel = metric.key.replace(/_/g, " ");
  const resolvedIndex = selectedIndex ?? getZoneIndex(metric);
  const zoneWidths = getZoneWidths(metric);

  return (
    <div className="metricCard">
      <div className="metricCard__panel">
        <div className="metricCard__header">
          <div className="metricCard__titleGroup">
            <div className="metricCard__key">{metricKeyLabel}</div>
            <div className="metricCard__titleRow">
              <div className="metricCard__title metricCard__title--active">{metric.label}</div>
              <div className="metricCard__info">
                <Info className="metricCard__infoIcon" aria-hidden="true" />
                <div className="metricCard__tooltip">{metric.description}</div>
              </div>
            </div>
          </div>
          <div className={`metricCard__value metricCard__value--zone-${resolvedIndex}`}>
            {metric.percent}
          </div>
        </div>

        <div className="metricCard__range">
          <div
            className="metricCard__bar"
            style={{
              ["--zone-0-width" as string]: `${zoneWidths[0] ?? 0}%`,
              ["--zone-1-width" as string]: `${zoneWidths[1] ?? 0}%`,
              ["--zone-2-width" as string]: `${zoneWidths[2] ?? 0}%`,
            }}
          >
            <motion.div
              className={`metricCard__barHighlight metricCard__barHighlight--zone-${resolvedIndex}`}
              initial={{ width: 0 }}
              animate={{ width: isOpen ? `${metric.percent}%` : 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="metricCard__segment metricCard__segment--first">
              <span
                className={`metricCard__segmentLabel ${
                  resolvedIndex === 0 ? "metricCard__segmentLabel--active" : ""
                }`}
              >
                {metric.zones[0]?.label}
              </span>
            </div>
            <div className="metricCard__segment metricCard__segment--second">
              <span
                className={`metricCard__segmentLabel ${
                  resolvedIndex === 1 ? "metricCard__segmentLabel--active" : ""
                }`}
              >
                {metric.zones[1]?.label}
              </span>
            </div>
            <div className="metricCard__segment metricCard__segment--third">
              <span
                className={`metricCard__segmentLabel ${
                  resolvedIndex === 2 ? "metricCard__segmentLabel--active" : ""
                }`}
              >
                {metric.zones[2]?.label}
              </span>
            </div>
          </div>
          <div className="metricCard__rangeLabels">
            <span>{metric.rangeMeta.leftLabel}</span>
            <span>{metric.rangeMeta.rightLabel}</span>
          </div>
        </div>

        <div className="metricCard__result">
          <SearchCheck className="metricCard__resultIcon" aria-hidden="true" />
          <div className="metricCard__resultText">{metric.analysis.resultText}</div>
        </div>
      </div>
    </div>
  );
};

export default MetricRangeIndicator;
