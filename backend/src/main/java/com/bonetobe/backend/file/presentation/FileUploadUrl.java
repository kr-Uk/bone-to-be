package com.bonetobe.backend.file.presentation;

import com.bonetobe.backend.common.DomainCategory;
import io.swagger.v3.oas.annotations.media.Schema;

public class FileUploadUrl {
    @Schema(name = "FileUploadUrlRequest")
    public record Request(
        String originalFileName,
        String contentType,
        // TODO: 빼자?
        DomainCategory fileDomainCategory,
        Long fileSize
    ) {

    }

    @Schema(name = "FileUploadUrlResponse")
    public record Response(
        Long fileId,
        String uploadUrl
    ) {
    }
}
