package com.bonetobe.backend.file.domain;

public enum FileStatus {
    REQUESTED,   // presigned 발급됨
    UPLOADED,    // S3 업로드 완료
    CONFIRMED,   // 서버 검증 완료
    FAILED,
    DELETED
}