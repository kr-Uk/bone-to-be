package com.bonetobe.backend.file.infrastructure;

import com.bonetobe.backend.file.domain.StoredFile;
import com.bonetobe.backend.file.domain.StoredFileStore;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class StoredFileStoreImpl implements StoredFileStore {
    private final StoredFileJpaRepository fileJpaRepository;
    @Override
    public StoredFile save(StoredFile file) {
        return fileJpaRepository.save(file);
    }
}
