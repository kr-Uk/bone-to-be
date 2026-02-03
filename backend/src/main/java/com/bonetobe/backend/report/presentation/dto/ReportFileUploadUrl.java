package com.bonetobe.backend.report.presentation.dto;

import com.bonetobe.backend.file.presentation.FileUploadUrl;

public record ReportFileUploadUrl(
    String originalFileName,
    String contentType,
    Long fileSize
) {
    public FileUploadUrl.Request toUrlRequest() {
        return new FileUploadUrl.Request(
            originalFileName,
            contentType,
            fileSize
        );
    }
}
