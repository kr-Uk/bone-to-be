package com.bonetobe.backend.file.presentation;

import com.bonetobe.backend.common.DomainCategory;

public class FileUploadUrl {
    public record Request(
        String originalFileName,
        String contentType,
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
