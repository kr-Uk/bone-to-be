package com.bonetobe.backend.report.presentation;

import com.bonetobe.backend.common.response.APIResponse;
import com.bonetobe.backend.common.response.SuccessCode;
import com.bonetobe.backend.file.domain.FileService;
import com.bonetobe.backend.file.presentation.FileUploadUrl;
import com.bonetobe.backend.report.application.ReportFacade;
import com.bonetobe.backend.user.domain.User;
import lombok.RequiredArgsConstructor;
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
        @AuthenticationPrincipal User user
    ) {
        return ResponseEntity
                .ok()
                .body(APIResponse
                    .success(
                        SuccessCode.CREATED,
                        fileService.createUploadUrl(request.toUrlRequest(), user.getId())));
    }

    @PutMapping("/uploaded/{fileId}")
    public ResponseEntity<APIResponse<Void>> startReport(
        @PathVariable Long fileId,
        @AuthenticationPrincipal User user
    ) {
        reportFacade.createReport(fileId, user);
        return ResponseEntity
            .ok()
            .body(APIResponse
                .success(
                    SuccessCode.UPDATED
                ));
    }
}
