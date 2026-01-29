package com.bonetobe.backend.user.presentation;

import com.bonetobe.backend.common.DomainCategory;
import com.bonetobe.backend.user.domain.command.UserFileCommand;
import com.bonetobe.backend.user.domain.query.UserFileSummary;
import io.swagger.v3.oas.annotations.media.Schema;

public class UserFileDto {
    @Schema(name = "UserFileRequest")
    public record Request(
            String originalFileName,
            String contentType,
            Long fileSize
    ) {
        public UserFileCommand toCommand(Long userId) {
            return new UserFileCommand(
                    userId,
                    originalFileName,
                    contentType,
                    DomainCategory.PROFILE,
                    fileSize
            );
        }
    }

    @Schema(name = "UserFileResponse")
    public record Response(
            Long fileId,
            String uploadUrl
    ) {
        public static UserFileDto.Response of(UserFileSummary summary) {
            return new UserFileDto.Response(
                    summary.fileId(),
                    summary.uploadUrl()
            );
        }
    }
}