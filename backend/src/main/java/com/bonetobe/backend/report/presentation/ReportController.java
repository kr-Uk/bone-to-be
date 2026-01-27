package com.bonetobe.backend.report.presentation;

import com.bonetobe.backend.common.response.APIResponse;
import com.bonetobe.backend.common.response.SuccessCode;
import com.bonetobe.backend.file.domain.FileService;
import com.bonetobe.backend.file.presentation.FileUploadUrl;
import com.bonetobe.backend.report.application.ReportFacade;
import com.bonetobe.backend.user.domain.User;
import com.bonetobe.backend.user.infrastructure.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/report")
@RequiredArgsConstructor
public class ReportController {
    private final FileService fileService;
    private final ReportFacade reportFacade;
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
                        fileService.createUploadUrl(request.toUrlRequest(), user.getUserId())));
    }

    @PostMapping
    public ResponseEntity<APIResponse<Void>> startReport(
        @RequestBody PostBodyReport.Request request,
        @AuthenticationPrincipal UserPrincipal user
    ) {
        reportFacade.createReport(request.toCommand(user.getUserId()));
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(APIResponse.success(SuccessCode.UPDATED));
    }
}
