package com.bonetobe.backend.file.domain;

import com.bonetobe.backend.common.DomainCategory;
import com.bonetobe.backend.common.response.ErrorCode;
import com.bonetobe.backend.file.presentation.FileDownloadUrl;
import com.bonetobe.backend.file.presentation.FileUploadUrl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {
    private final FileStorage fileStorage;
    private final StoredFileReader fileReader;
    private final StoredFileStore fileStore;

    @Override
    @Transactional
    public FileUploadUrl.Response createUploadUrl(FileUploadUrl.Request request, Long userId, DomainCategory domainCategory) {
        ContentType contentType = ContentType.getContentType(request.contentType());
        String storageKey = fileStorage.generateKey(domainCategory, contentType);

        FileMetadata metadata = FileMetadata.createMetadata(
            storageKey,
            request.originalFileName(),
            request.contentType(),
            userId,
            domainCategory,
            request.fileSize()
        );

        String uploadUrl = fileStorage.createPresignedUrl(metadata);
        StoredFile file = fileStore.save(StoredFile.createRequest(metadata));

        return new FileUploadUrl.Response(file.getId(), uploadUrl);
    }

    /*
        TODO : 예외 정리하기
     */
    @Override
    @Transactional
    public void completeUpload(StoredFile file, Long userId) {
        if (!file.isOwner(userId)) {
            throw new AuthorizationDeniedException(
                ErrorCode.FORBIDDEN.getMessage()
            );
        }
        file.completeUpload();
        fileStore.save(file);
    }

    @Override
    @Transactional(readOnly = true)
    public StoredFile getFile(Long fileId) {
        return fileReader.read(fileId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FileDownloadUrl.Result> getPublicDownloadUrls(List<FileDownloadUrl.Query> queries) {
        List<StoredFile> files = fileReader.readFiles(queries);
        return getResults(files);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FileDownloadUrl.Result> getPrivateDownloadUrls(List<FileDownloadUrl.Query> queries, Long userId) {
        List<StoredFile> files = fileReader.readPrivateFiles(queries, userId);
        return getResults(files);
    }


    private List<FileDownloadUrl.Result> getResults(List<StoredFile> files) {
        return files.stream()
            .map(f -> new FileDownloadUrl.Result(
                f.getId(),
                f.getOwnerId(),
                fileStorage.createPresignedGetUrl(f.getKey()))
            ).toList();
    }
}
