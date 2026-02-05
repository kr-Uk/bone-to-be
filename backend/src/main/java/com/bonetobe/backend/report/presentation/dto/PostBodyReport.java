package com.bonetobe.backend.report.presentation.dto;

import com.bonetobe.backend.report.domain.BodyInfo;
import com.bonetobe.backend.report.domain.ReportCommand;
import com.bonetobe.backend.style.domain.StyleName;
import com.bonetobe.backend.user.domain.Gender;
import com.bonetobe.backend.user.domain.User;

public class PostBodyReport {
    public record Request(
        Long fileId,
        Integer height,
        Integer weight,
        Gender gender,
        StyleName style
    ) {
        public ReportCommand toCommand(Long userId) {
            return new ReportCommand(
                User.of(userId),
                BodyInfo.createBodyInfo(
                    weight,
                    height,
                    gender
                ),
                fileId,
                style
            );
        }
    }
}
