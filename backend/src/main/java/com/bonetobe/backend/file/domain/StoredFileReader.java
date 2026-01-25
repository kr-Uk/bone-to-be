package com.bonetobe.backend.file.domain;

import com.bonetobe.backend.file.presentation.FileDownloadUrl;

import java.util.List;

public interface StoredFileReader {
    StoredFile read(Long fileId);

    List<StoredFile> readFiles(List<FileDownloadUrl.Query> queries);

    List<StoredFile> readPrivateFiles(List<FileDownloadUrl.Query> queries, Long userId);
}
