package com.bonetobe.backend.report.domain;

import com.bonetobe.backend.user.domain.User;

public record ReportCommand(
    User user,
    BodyInfo bodyInfo,
    Long fileId
) {
}
