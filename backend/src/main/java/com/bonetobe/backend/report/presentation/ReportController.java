package com.bonetobe.backend.report.presentation;

import com.bonetobe.backend.common.response.APIResponse;
import com.bonetobe.backend.common.response.SuccessCode;
import com.bonetobe.backend.file.domain.FileService;
import com.bonetobe.backend.file.presentation.FileUploadUrl;
import com.bonetobe.backend.user.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/report")
@RequiredArgsConstructor
public class ReportController {
    private final FileService fileService;

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

}
