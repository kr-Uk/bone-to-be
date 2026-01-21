package com.bonetobe.backend.common.domain;

import com.bonetobe.backend.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "stored_file",
        indexes = {
                @Index(name = "idx_file_reference", columnList = "reference_id, category") // 조회 성능 최적화
        }
)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class StoredFile extends BaseEntity {
    private static final int MAX_FILE_CATEGORY_NAME_LENGTH = 100;
    private static final int MAX_FILE_DISPLAY_TITLE_LENGTH = 300;
    private static final int MAX_FILE_TITLE_LENGTH = 50;
    private static final int MAX_FILE_FORMAT_LENGTH = 50;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; //통합 파일 ID

    @Column(name = "category", length = MAX_FILE_CATEGORY_NAME_LENGTH, nullable = false)
    @Enumerated(EnumType.STRING)
    private FileCategory category;

    @Column(name = "reference_id", nullable = false)
    private Long referenceId;

    @Column(name = "display_title", length = MAX_FILE_DISPLAY_TITLE_LENGTH, nullable = false)
    private String displayTitle;

    @Column(name = "title", length = MAX_FILE_TITLE_LENGTH,  nullable = false)
    private String title;

    @Column(name = "content_type", nullable = false)
    private String contentType;

    @Column(name = "format", length = MAX_FILE_FORMAT_LENGTH, nullable = false)
    private String fileFormat;

    @Column(name = "size", nullable = false)
    private Long fileSize;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FileStatus status;

    @Column(nullable = false)
    private String storagePath; // S3 key
}
