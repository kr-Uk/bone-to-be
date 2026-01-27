package com.bonetobe.backend.report.infrastructure;

import com.bonetobe.backend.report.domain.Report;
import com.bonetobe.backend.user.domain.Gender;

public class ReportMessage {
    public record Request(
        Long reportId,
        Integer weight,
        Integer height,
        Gender gender,
        String presignedUrl
    ) {
        public static Request of(Report report, String presignedUrl) {
            return new Request(
                report.getId(),
                report.getBodyInfo().getHeight(),
                report.getBodyInfo().getHeight(),
                report.getBodyInfo().getGender(),
                presignedUrl
            );
        }
    }
}
