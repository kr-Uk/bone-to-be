package com.bonetobe.backend.report.presentation;

import com.bonetobe.backend.common.DomainCategory;
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
            DomainCategory.DIAGNOSE_PICTURE,
            fileSize
        );
    }
}
