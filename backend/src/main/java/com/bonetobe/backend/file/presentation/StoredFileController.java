package com.bonetobe.backend.file.presentation;

import com.bonetobe.backend.common.response.APIResponse;
import com.bonetobe.backend.common.response.SuccessCode;
import com.bonetobe.backend.file.application.FileFacade;
import com.bonetobe.backend.user.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/files")
public class StoredFileController {
    private final FileFacade fileFacade;
    @PutMapping("/{fileId}")
    public ResponseEntity<APIResponse<Void>> fileUploaded(
        @PathVariable Long fileId,
        @AuthenticationPrincipal User user
    ) {
        fileFacade.completeUpload(fileId, user.getId());
        return ResponseEntity
            .status(HttpStatus.NO_CONTENT)
            .body(APIResponse.success(SuccessCode.OK));
    }
}
