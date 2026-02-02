package com.bonetobe.backend.report.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class RangeMeta {
    private Double min;
    private Double max;
    private String leftLabel;
    private String rightLabel;
}
