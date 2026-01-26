package com.bonetobe.backend.report.presentation;

import com.bonetobe.backend.report.domain.ReportCommand;
import com.bonetobe.backend.user.domain.Gender;

public class BodyReport {
    public record Request(
        Long fileId,
        Integer height,
        Integer weight,
        Gender gender
    ) {
        public ReportCommand toCommand(Long userId) {
            return new ReportCommand(
                userId,
                height,
                weight,
                gender,
                fileId
            );
        }
    }

    public record Response(

    ) {
    }
}
