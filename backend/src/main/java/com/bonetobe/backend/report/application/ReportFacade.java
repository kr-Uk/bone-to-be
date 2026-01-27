package com.bonetobe.backend.report.application;

import com.bonetobe.backend.file.domain.FileService;
import com.bonetobe.backend.file.domain.StoredFile;
import com.bonetobe.backend.file.presentation.FileDownloadUrl;
import com.bonetobe.backend.report.domain.ReportService;
import com.bonetobe.backend.user.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ReportFacade {
    private final ReportService reportService;
    private final FileService fileService;

    public void createReport(Long fileId, User user) {
        StoredFile file = fileService.getFile(fileId);

        fileService.completeUpload(file, user.getId());
        FileDownloadUrl.Result result = fileService.getPrivateDownloadUrls(List.of(new FileDownloadUrl.Query(fileId)), user.getId()).get(0);
        reportService.generateReport(user, result.presignedUrl());
    }
}
