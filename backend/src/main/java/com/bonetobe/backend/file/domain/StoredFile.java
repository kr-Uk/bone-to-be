package com.bonetobe.backend.file.domain;

import com.bonetobe.backend.common.BaseEntity;
import com.bonetobe.backend.common.DomainCategory;
import com.bonetobe.backend.common.response.ErrorCode;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "stored_file")
@Getter
public class StoredFile extends BaseEntity {
    private static final int MAX_FILE_CATEGORY_NAME_LENGTH = 100;
    private static final int MAX_FILE_TITLE_LENGTH = 50;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; //통합 파일 ID

    @Column(name = "category", length = MAX_FILE_CATEGORY_NAME_LENGTH, nullable = false)
    @Enumerated(EnumType.STRING)
    private DomainCategory category;

    @Column(name = "owner_id")
    private Long ownerId;

    @Column(name = "title", length = MAX_FILE_TITLE_LENGTH,  nullable = false)
    private String title;

    @Column(name = "content_type", nullable = false)
    @Enumerated(value = EnumType.STRING)
    private ContentType contentType;

    @Column(name = "size", nullable = false)
    private Long fileSize;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FileStatus status;

    @Column(nullable = false)
    private String key; // S3 key

    public static StoredFile createRequest(
        FileMetadata metadata
    ) {
        StoredFile storedFile = new StoredFile();
        storedFile.category = metadata.getFileDomainCategory();
        storedFile.title = metadata.getOriginalFileName();
        storedFile.contentType = metadata.getContentType();
        storedFile.fileSize = metadata.getFileSize();
        storedFile.key = metadata.getStorageKey();
        storedFile.status = FileStatus.CONFIRMED;
        storedFile.ownerId = metadata.getOwnerId();
        return storedFile;
    }

    public static StoredFile of(Long fileId) {
        StoredFile storedFile = new StoredFile();
        storedFile.id = fileId;
        return storedFile;
    }

    public void completeUpload() {
        if (status != FileStatus.CONFIRMED) {
            throw new FileStorageUploadException(ErrorCode.FILE_NOT_CONFIRMED_EXCEPTION);
        }
        status = FileStatus.UPLOADED;
    }

    public boolean isOwner(Long userId) {
        return userId.equals(ownerId);
    }
}
