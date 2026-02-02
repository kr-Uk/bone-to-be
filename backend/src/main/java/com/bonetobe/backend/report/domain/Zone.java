package com.bonetobe.backend.report.domain;

import com.bonetobe.backend.common.SkeletonType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class Zone {
    private String label;
    private SkeletonType skeletonType;
    private Double max;
}
