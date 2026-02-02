package com.bonetobe.backend.report.domain;


public record RangeMeta(
    Double min,
    Double max,
    String leftLabel,
    String rightLabel
) {
}
