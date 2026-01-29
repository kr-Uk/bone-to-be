package com.bonetobe.backend.report.domain;

import com.bonetobe.backend.user.domain.Gender;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Embeddable
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BodyInfo {
    private Integer weight;

    private Integer height;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    public static BodyInfo createBodyInfo(
        Integer weight,
        Integer height,
        Gender gender
    ) {
        BodyInfo bodyInfo = new BodyInfo();
        bodyInfo.weight = weight;
        bodyInfo.height = height;
        bodyInfo.gender = gender;

        return bodyInfo;
    }
}
