package com.bonetobe.backend.report.application;

import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.file.domain.FileService;
import com.bonetobe.backend.file.presentation.FileDownloadUrl;
import com.bonetobe.backend.notification.application.NotificationFacade;
import com.bonetobe.backend.notification.domain.AlertType;
import com.bonetobe.backend.notification.domain.Notification;
import com.bonetobe.backend.recommendation.presentation.TryOnEvent;
import com.bonetobe.backend.report.domain.Report;
import com.bonetobe.backend.report.domain.ReportCommand;
import com.bonetobe.backend.report.domain.ReportProducer;
import com.bonetobe.backend.report.domain.ReportService;
import com.bonetobe.backend.report.infrastructure.ReportMessage;
import com.bonetobe.backend.report.presentation.dto.ReportResult;
import com.bonetobe.backend.user.domain.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Transactional
@Component
@RequiredArgsConstructor
public class ReportFacade {
    private final ReportService reportService;
    private final FileService fileService;
    private final UserService userService;
    private final ReportProducer reportProducer;
    private final NotificationFacade notificationFacade;
    private final ApplicationEventPublisher publisher;
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

    @Transactional
    public void saveResultAndSendEvent(ReportResult result) {
        try {
            Report report = reportService.saveResult(result.reportId(), result.toAnalysisReport());
            notificationFacade.saveAndSendNotification(Notification.create(report.getUser().getId(), report.getId(), AlertType.DIAGNOSE));
            userService.updateSkeletonType(report.getUser(), report.getDiagnosis().getFitType());

            // 옷 가상피팅 이벤트 발행
            publisher.publishEvent(new TryOnEvent(report.getId()));
        } catch (BusinessException e) {
            log.error("리포트 저장 중 에러 발생 :{}", e.getMessage());
        }
    }

    public void authorizeAndDeleteReport(Long userId, Long reportId) {
        Report report = reportService.isOwner(userId, reportId);
        reportService.delete(report);
    }

    public void authorizeAndRepresentReport(Long userId, Long reportId) {
        reportService.clearRepresentativeReport(userId);
        Report report = reportService.isOwner(userId, reportId);
        report.toggleRepresentative();
    }
}
