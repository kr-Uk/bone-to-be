package com.bonetobe.backend.file.infrastructure;

import com.bonetobe.backend.common.DomainCategory;
import com.bonetobe.backend.common.S3Properties;
import com.bonetobe.backend.file.domain.ContentType;
import com.bonetobe.backend.file.domain.FileMetadata;
import com.bonetobe.backend.file.domain.FileStorage;
import com.bonetobe.backend.file.domain.FileStorageUploadException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class S3FileStoreImpl implements FileStorage {
    private final S3Presigner s3Presigner;
    private final S3Properties s3Properties;
    private final S3Client s3Client;

    @Override
    public String createPresignedGetUrl(String key) {
        try {
            // aws sdk 전용 request dto
            GetObjectRequest objectRequest = GetObjectRequest.builder()
                .bucket(s3Properties.bucket())
                .key(key)
                .build();

            GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(10))  // The URL will expire in 10 minutes.
                .getObjectRequest(objectRequest)
                .build();

            PresignedGetObjectRequest presignedRequest = s3Presigner.presignGetObject(presignRequest);
            log.info("Presigned URL: [{}]", presignedRequest.url().toString());
            log.info("HTTP method: [{}]", presignedRequest.httpRequest().method());

            return presignedRequest.url().toExternalForm();
        } catch (S3Exception e) {
            throw new RuntimeException("s3 다운로드 이미지 실패");
        }
    }

    @Override
    public String createPresignedUrl(FileMetadata metadata) {
        try {
            PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(s3Properties.bucket())
                .key(metadata.getStorageKey())
                .contentType(metadata.getContentType().getContentType())
                .build();

            PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(10))  // The URL expires in 10 minutes.
                .putObjectRequest(objectRequest)
                .build();

            PresignedPutObjectRequest presignedRequest = s3Presigner.presignPutObject(presignRequest);

            return presignedRequest.url().toExternalForm();
        } catch (S3Exception e) {
            throw new FileStorageUploadException();
        }
    }

    @Override
    public String generateKey(DomainCategory category, ContentType contentType) {
        return "%s/%s/%s.%s".formatted(
            category.name().toLowerCase(),
            LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd")),
            UUID.randomUUID(),
            contentType.getExtension().toLowerCase()
        );
    }

    @Override
    public void delete(String key) {

    }
}
