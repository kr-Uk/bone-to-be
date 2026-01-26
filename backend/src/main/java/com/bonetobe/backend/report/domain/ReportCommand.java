package com.bonetobe.backend.report.domain;

import com.bonetobe.backend.user.domain.Gender;

public record ReportCommand(
    Long userId,
    Integer height,
    Integer weight,
    Gender gender,
    Long fileId
) {
}
