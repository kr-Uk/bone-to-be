package com.bonetobe.backend.file.presentation;

import com.bonetobe.backend.common.DomainCategory;
import com.bonetobe.backend.common.response.APIResponse;
import com.bonetobe.backend.common.response.SuccessCode;
import com.bonetobe.backend.file.domain.FileService;
import com.bonetobe.backend.user.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
    TODO : 도메인 별 구현 완료 시 삭제 예정
 */
@RestController
@RequestMapping("/file")
@RequiredArgsConstructor
public class FileTestController {
    private final FileService fileService;
    @PostMapping("/upload")
    public ResponseEntity<APIResponse<FileUploadUrl.Response>> presignedUrl(
        @RequestBody FileUploadUrl.Request request,
        @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.status(HttpStatus.OK)
            .body(APIResponse.success(SuccessCode.OK, fileService.createUploadUrl(request, user.getId(), DomainCategory.PROFILE)));
    }

    @GetMapping("/download")
    public ResponseEntity<APIResponse<List<FileDownloadUrl.Result>>> downloadUrl(
        @RequestBody List<FileDownloadUrl.Query> request
    ) {
        return ResponseEntity.status(HttpStatus.OK)
            .body(APIResponse.success(SuccessCode.OK, fileService.getPublicDownloadUrls(request)));
    }
}
