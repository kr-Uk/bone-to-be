package com.bonetobe.backend.file.domain;

import com.bonetobe.backend.common.response.ErrorCode;

public class FileStorageUploadException extends RuntimeException {
    public FileStorageUploadException() {
        super(ErrorCode.S3_UPLOAD_FAIL_ERROR.getMessage());
    }

    public FileStorageUploadException(ErrorCode errorCode) {
        super(errorCode.getMessage());
    }
}
