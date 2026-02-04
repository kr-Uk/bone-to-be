package com.bonetobe.backend.recommendation.application;

import com.bonetobe.backend.cloth.domain.BestWorstClothDownload;
import com.bonetobe.backend.cloth.domain.Cloth;
import com.bonetobe.backend.cloth.domain.ClothService;
import com.bonetobe.backend.common.DomainCategory;
import com.bonetobe.backend.file.domain.FileService;
import com.bonetobe.backend.file.domain.StoredFile;
import com.bonetobe.backend.file.presentation.FileDownloadUrl;
import com.bonetobe.backend.file.presentation.FileUploadUrl;
import com.bonetobe.backend.notification.application.NotificationFacade;
import com.bonetobe.backend.notification.domain.AlertType;
import com.bonetobe.backend.notification.domain.Notification;
import com.bonetobe.backend.recommendation.domain.*;
import com.bonetobe.backend.recommendation.presentation.GetTryOnPicture;
import com.bonetobe.backend.recommendation.presentation.TryOnResult;
import com.bonetobe.backend.report.domain.Report;
import com.bonetobe.backend.report.domain.ReportService;
import com.bonetobe.backend.user.domain.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class TryOnFacade {
    private final TryOnService tryOnService;
    private final NotificationFacade notificationFacade;
    private final ReportService reportService;
    private final ClothService clothService;
    private final TryOnProducer tryOnProducer;
    private final FileService fileService;

    @Transactional
    public void saveResultAndSendEvent(TryOnResult result) {
        // 리포트 조회
        Recommendation recommendation = tryOnService.saveResult(result.reportId());

        // 파일 저장 처리
        fileService.completeUpload(fileService.getFile(recommendation.getBestPicture().getId()), recommendation.getUser().getId());
        fileService.completeUpload(fileService.getFile(recommendation.getWorstPicture().getId()), recommendation.getUser().getId());

        // 알림 전송
        notificationFacade.saveAndSendNotification(Notification.create(recommendation.getUser().getId(), recommendation.getId(), AlertType.TRY_ME));
    }

    @Transactional
    public void startTryOn(Long reportId) {
        Report report = reportService.getReportWithFile(reportId);
        // 파일 업로드 url 생성
        FileUploadUrl.Response bestUrl = fileService.createUploadUrl(
                new FileUploadUrl.Request(
                    "TryOnBest-" + report.getPhoto().getTitle(),
                    "image/png",
                    report.getPhoto().getFileSize()),
                    report.getUser().getId(),
                    DomainCategory.AFTER_TRY_ME);

        FileUploadUrl.Response worstUrl = fileService.createUploadUrl(
            new FileUploadUrl.Request(
                "TryOnWorst-" + report.getPhoto().getTitle(),
                "image/png",
                report.getPhoto().getFileSize()),
            report.getUser().getId(),
            DomainCategory.AFTER_TRY_ME);

        // 파일 다운로드 url 생성
        BestWorstClothDownload clothDownloadPresignedUrls = clothService.getClothDownloadPresignedUrls(report.getDiagnosis().getFitType());
        String userPresignedUrl = fileService.getPublicDownloadUrls(Collections.singletonList(new FileDownloadUrl.Query(report.getPhoto().getId()))).get(0).presignedUrl();

        // db 에 저장
        Recommendation recommendation = tryOnService.save(
            Recommendation.start(
                report,
                User.of(report.getUser().getId()),
                StoredFile.of(bestUrl.fileId()),
                StoredFile.of(worstUrl.fileId()),
                Cloth.of(clothDownloadPresignedUrls.bestClothId()),
                Cloth.of(clothDownloadPresignedUrls.worstClothId())
        ));

        // rabbitMq 에 정보 전달
        tryOnProducer.produce(RecommendationMessage.of(
                recommendation,
                userPresignedUrl,
                clothDownloadPresignedUrls.bestClothUrl(),
                bestUrl.uploadUrl(),
                clothDownloadPresignedUrls.worstClothUrl(),
                worstUrl.uploadUrl()));
    }

    public GetTryOnPicture getTryOnPicture(Long reportId, Long userId) {
        Recommendation recommendation = tryOnService.get(reportId, userId);
        if (recommendation.getStatus() == TryOnStatus.PENDING) {
            return new GetTryOnPicture(reportId, null, null, recommendation.getStatus());
        }

        String worst = fileService.getPrivateDownloadUrls(
            List.of(
                new FileDownloadUrl.Query(recommendation.getWorstPicture().getId())),
            userId).get(0).presignedUrl();

        String best = fileService.getPrivateDownloadUrls(
            List.of(
                new FileDownloadUrl.Query(recommendation.getBestPicture().getId())),
            userId).get(0).presignedUrl();

        return new GetTryOnPicture(reportId, best, worst, recommendation.getStatus());
    }
}
