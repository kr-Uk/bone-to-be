package com.bonetobe.backend.report.application;

import com.bonetobe.backend.file.domain.FileService;
import com.bonetobe.backend.file.presentation.FileDownloadUrl;
import com.bonetobe.backend.report.domain.Report;
import com.bonetobe.backend.report.domain.ReportCommand;
import com.bonetobe.backend.report.domain.ReportProducer;
import com.bonetobe.backend.report.domain.ReportService;
import com.bonetobe.backend.report.infrastructure.ReportMessage;
import com.bonetobe.backend.report.presentation.dto.ReportResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ReportFacade {
    private final ReportService reportService;
    private final FileService fileService;
    private final ReportProducer reportProducer;

    public Long createReport(ReportCommand command) {
        // 파일 db에 저장
        fileService.completeUpload(fileService.getFile(command.fileId()), command.user().getId());

        // db 에 저장
        Report report = reportService.saveReport(command);

        // 파일 다운로드 url 조회
        String presignedUrl = fileService.getPrivateDownloadUrls(List.of(new FileDownloadUrl.Query(command.fileId())), command.user().getId()).get(0).presignedUrl();

        // rabbitMq 에 정보 전달
        ReportMessage.Request request = ReportMessage.Request.of(report, presignedUrl);
        reportProducer.produce(request);

        return report.getId();
    }

    public void saveResultAndSendEvent(ReportResult result) {
        Report report = reportService.saveResult(result.reportId(), result.toAnalysisReport());

        /*
            TODO : 프론트 구현 시 해제
         */
        // reportService.sendEvent(result.reportId());
    }

    public void authorizeAndDeleteReport(Long userId, Long reportId) {
        Report report = reportService.isOwner(userId, reportId);
        reportService.delete(report);
    }

    public void authorizeAndRepresentReport(Long userId, Long reportId) {
        Report report = reportService.isOwner(userId, reportId);
        reportService.makeRepresentative(report);
    }
}
