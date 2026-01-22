package com.bonetobe.backend.file.application;

import com.bonetobe.backend.file.domain.FileService;
import com.bonetobe.backend.file.domain.StoredFile;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class FileFacade {
    private final FileService fileService;
    public void completeUpload(Long fileId, Long userId) {
        StoredFile file = fileService.getFile(fileId);
        fileService.completeUpload(file, userId);
    }
}
