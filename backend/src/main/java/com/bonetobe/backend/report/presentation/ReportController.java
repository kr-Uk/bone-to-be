package com.bonetobe.backend.report.presentation;

import com.bonetobe.backend.common.DomainCategory;
import com.bonetobe.backend.common.response.APIResponse;
import com.bonetobe.backend.common.response.SuccessCode;
import com.bonetobe.backend.file.domain.FileService;
import com.bonetobe.backend.file.presentation.FileUploadUrl;
import com.bonetobe.backend.report.application.ReportFacade;
import com.bonetobe.backend.report.domain.ReportService;
import com.bonetobe.backend.report.presentation.dto.*;
import com.bonetobe.backend.user.infrastructure.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportController {
    private final FileService fileService;
    private final ReportFacade reportFacade;
    private final ReportService reportService;

    @PostMapping("/createUrl")
    public ResponseEntity<APIResponse<FileUploadUrl.Response>> createReportPresignedUrl(
        @RequestBody ReportFileUploadUrl request,
        @AuthenticationPrincipal UserPrincipal user
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(APIResponse
                    .success(
                        SuccessCode.CREATED,
                        fileService.createUploadUrl(request.toUrlRequest(), user.getId(), DomainCategory.DIAGNOSE_PICTURE)));
    }

    @PostMapping
    public ResponseEntity<APIResponse<PostReport>> startReport(
        @RequestBody PostBodyReport.Request request,
        @AuthenticationPrincipal UserPrincipal user
    ) {
        Long reportId = reportFacade.createReport(request.toCommand(user.getId()));
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(APIResponse.success(SuccessCode.UPDATED,
                PostReport.of(reportId)));
    }

    @GetMapping("/{reportId}")
    public ResponseEntity<APIResponse<GetReport>> getDetailReport(
        @PathVariable Long reportId,
        @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        return ResponseEntity
            .status(HttpStatus.OK)
            .body(
                APIResponse.success(SuccessCode.OK,
                    GetReport.from(reportService.getReportWithFile(reportId, userPrincipal.getId()))));
    }

    @GetMapping
    public ResponseEntity<APIResponse<List<GetReportList>>> getReportList(
        @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        return ResponseEntity
            .status(HttpStatus.OK)
            .body(
                APIResponse.success(SuccessCode.OK,
                    reportService.getReportList(userPrincipal.getId()).stream()
                        .map(GetReportList::from)
                        .toList()));
    }


    @DeleteMapping("/{reportId}")
    public ResponseEntity<APIResponse<Void>> deleteReport(
        @AuthenticationPrincipal UserPrincipal userPrincipal,
        @PathVariable Long reportId
    ) {
        reportFacade.authorizeAndDeleteReport(userPrincipal.getId(), reportId);
        return ResponseEntity
            .status(HttpStatus.OK)
            .body(APIResponse.success(SuccessCode.DELETED));
    }

    @PutMapping("/{reportId}")
    public ResponseEntity<APIResponse<Void>> makeReportRepresentative(
        @AuthenticationPrincipal UserPrincipal userPrincipal,
        @PathVariable Long reportId
    ) {
        reportFacade.authorizeAndRepresentReport(userPrincipal.getId(), reportId);
        return ResponseEntity
            .status(HttpStatus.OK)
            .body(APIResponse.success(SuccessCode.UPDATED));
    }

    @DeleteMapping("/representative")
    public ResponseEntity<APIResponse<Void>> deleteRepresentative(
        @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        reportService.clearRepresentativeReport(userPrincipal.getId());
        return ResponseEntity
            .status(HttpStatus.OK)
            .body(APIResponse.success(SuccessCode.UPDATED));
    }
}
