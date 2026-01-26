package com.bonetobe.backend.file.presentation;

import com.bonetobe.backend.common.DomainCategory;
import io.swagger.v3.oas.annotations.media.Schema;

public class FileUploadUrl {
    @Schema(name = "FilePresignedUrlRequest")
    public record Request(
        String originalFileName,
        String contentType,
        // TODO: 빼자?
        DomainCategory fileDomainCategory,
        Long fileSize
    ) {

    }

    public record Response(
        Long fileId,
        String uploadUrl
    ) {
    }
}
