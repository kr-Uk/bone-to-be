package com.bonetobe.backend.file.domain;

import com.bonetobe.backend.common.DomainCategory;
import com.bonetobe.backend.file.presentation.FileDownloadUrl;
import com.bonetobe.backend.file.presentation.FileUploadUrl;

import java.util.List;

public interface FileService {
    FileUploadUrl.Response createUploadUrl(FileUploadUrl.Request request, Long userId, DomainCategory domainCategory);

    void completeUpload(StoredFile file, Long userId);

    StoredFile getFile(Long fileId);

    List<FileDownloadUrl.Result> getPublicDownloadUrls(List<FileDownloadUrl.Query> queries);

    List<FileDownloadUrl.Result> getPrivateDownloadUrls(List<FileDownloadUrl.Query> queries, Long userId);
}
