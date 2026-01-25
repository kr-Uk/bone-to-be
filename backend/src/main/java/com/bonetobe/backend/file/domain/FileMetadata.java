package com.bonetobe.backend.file.domain;

import com.bonetobe.backend.common.DomainCategory;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class FileMetadata {
    private String storageKey;
    private String originalFileName;
    private ContentType contentType;
    private Long ownerId;
    private DomainCategory fileDomainCategory;
    private Long fileSize;

    public static FileMetadata createMetadata(
        String key,
        String originalFileName,
        String contentType,
        Long ownerId,
        DomainCategory category,
        Long fileSize
    ) {
        FileMetadata fileMetadata = new FileMetadata();
        fileMetadata.storageKey = key;
        fileMetadata.originalFileName = originalFileName;
        fileMetadata.contentType = ContentType.getContentType(contentType);
        fileMetadata.ownerId = ownerId;
        fileMetadata.fileDomainCategory = category;
        fileMetadata.fileSize = fileSize;
        return fileMetadata;
    }
}
