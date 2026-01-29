package com.bonetobe.backend.post.presentation.dto;

import com.bonetobe.backend.common.DomainCategory;
import com.bonetobe.backend.post.domain.command.PostFileCommand;
import com.bonetobe.backend.post.domain.query.PostFileSummary;
import io.swagger.v3.oas.annotations.media.Schema;

public class PostFileDto {
    @Schema(name = "PostFileRequest")
    public record Request(
            String originalFileName,
            String contentType,
            Long fileSize
    ) {
        public PostFileCommand toCommand(Long userId) {

            return new PostFileCommand(
                    userId,
                    originalFileName,
                    contentType,
                    DomainCategory.FEED,
                    fileSize
            );
        }
    }

    @Schema(name = "PostFileResponse")
    public record Response(
            Long fileId,
            String uploadUrl
    ) {
        public static PostFileDto.Response of(PostFileSummary summary) {
            return new PostFileDto.Response(
                    summary.fileId(),
                    summary.uploadUrl()
            );
        }
    }
}
