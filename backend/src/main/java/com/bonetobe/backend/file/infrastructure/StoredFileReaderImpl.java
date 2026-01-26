package com.bonetobe.backend.file.infrastructure;

import com.bonetobe.backend.file.domain.StoredFile;
import com.bonetobe.backend.file.domain.StoredFileReader;
import com.bonetobe.backend.file.presentation.FileDownloadUrl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class StoredFileReaderImpl implements StoredFileReader {
    private final StoredFileJpaRepository jpaRepository;

    @Override
    public StoredFile read(Long fileId) {
        return jpaRepository.findById(fileId).orElseThrow();
    }

    @Override
    public List<StoredFile> readFiles(List<FileDownloadUrl.Query> queries) {
        return jpaRepository.findByList(objectsToId(queries));
    }

    @Override
    public List<StoredFile> readPrivateFiles(List<FileDownloadUrl.Query> queries, Long userId) {
        List<StoredFile> files = jpaRepository.findByListAndUserId(objectsToId(queries), userId);
        if (files.size() != queries.size()) {
            throw new AuthorizationDeniedException("denied");
        }
        return files;
    }

    private List<Long> objectsToId(List<FileDownloadUrl.Query> queries) {
        return queries
            .stream()
            .map(FileDownloadUrl.Query::fileId)
            .toList();
    }
}
