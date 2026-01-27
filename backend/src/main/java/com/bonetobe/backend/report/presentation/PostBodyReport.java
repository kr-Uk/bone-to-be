package com.bonetobe.backend.report.presentation;

import com.bonetobe.backend.report.domain.BodyInfo;
import com.bonetobe.backend.report.domain.ReportCommand;
import com.bonetobe.backend.user.domain.Gender;
import com.bonetobe.backend.user.domain.User;

public class PostBodyReport {
    public record Request(
        Long fileId,
        Integer height,
        Integer weight,
        Gender gender
    ) {
        public ReportCommand toCommand(Long userId) {
            return new ReportCommand(
                User.makeReferencedUser(userId),
                BodyInfo.createBodyInfo(
                    height,
                    weight,
                    gender
                ),
                fileId
            );
        }
    }
}
