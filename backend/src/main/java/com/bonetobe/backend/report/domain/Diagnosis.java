package com.bonetobe.backend.report.domain;

import com.bonetobe.backend.common.BaseEntity;
import jakarta.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Diagnosis {
    private Double straightRatio;
    private Double waveRatio;
    private Double naturalRatio;
}