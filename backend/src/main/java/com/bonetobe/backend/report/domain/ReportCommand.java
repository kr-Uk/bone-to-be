package com.bonetobe.backend.report.domain;

import com.bonetobe.backend.style.domain.StyleName;
import com.bonetobe.backend.user.domain.User;

public record ReportCommand(
    User user,
    BodyInfo bodyInfo,
    Long fileId,
    StyleName styleName) {
}
