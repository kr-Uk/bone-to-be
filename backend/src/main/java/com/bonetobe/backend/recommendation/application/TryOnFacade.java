package com.bonetobe.backend.recommendation.application;

import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.notification.application.NotificationFacade;
import com.bonetobe.backend.notification.domain.AlertType;
import com.bonetobe.backend.notification.domain.Notification;
import com.bonetobe.backend.recommendation.domain.Recommendation;
import com.bonetobe.backend.recommendation.domain.TryOnService;
import com.bonetobe.backend.recommendation.presentation.TryOnResult;
import com.bonetobe.backend.report.domain.Report;
import com.bonetobe.backend.report.domain.ReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TryOnFacade {
    private final TryOnService tryOnService;
    private final NotificationFacade notificationFacade;
    private final ReportService reportService;

    public void saveResultAndSendEvent(TryOnResult result) {
        Report report = reportService.getReport(result.reportId());
        try {
            Recommendation recommendation = tryOnService.saveResult(report.getId());
            notificationFacade.saveAndSendNotification(Notification.create(recommendation.getUser().getId(), recommendation.getId(), AlertType.TRY_ME));
        } catch (BusinessException e) {
            log.error("리포트 저장 중 에러 발생 :{}", e.getMessage());
        }
    }
}
