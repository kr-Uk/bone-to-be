package com.bonetobe.backend.file.domain;

import com.bonetobe.backend.common.DomainCategory;

public interface FileStorage {
    /*
        스토리지에서 파일 다운로드용 presigned url 생성
     */
    String createPresignedGetUrl(String key);

    /*
        스토리지에서 파일 생성용 presigned url 생성
     */
    String createPresignedUrl(FileMetadata metadata);

    /*
        키 생성
     */
    String generateKey(DomainCategory category, ContentType contentType);

    /*
        스토리지에서 파일 삭제
     */
    void delete(String key);
}
