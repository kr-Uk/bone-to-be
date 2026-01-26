package com.bonetobe.backend.file.domain;

import com.bonetobe.backend.common.response.ErrorCode;

public class FileMetaDataInputException extends RuntimeException {
    public FileMetaDataInputException() {
        super(ErrorCode.NULL_FILE_NAME_EXCEPTION.getMessage());
    }
}
