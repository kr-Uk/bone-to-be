package com.bonetobe.backend.recommendation.presentation;

import com.bonetobe.backend.common.response.APIResponse;
import com.bonetobe.backend.common.response.SuccessCode;
import com.bonetobe.backend.recommendation.application.TryOnFacade;
import com.bonetobe.backend.user.infrastructure.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/tryon")
public class TryOnController {
    private final TryOnFacade tryOnFacade;

    @GetMapping("/{reportId}")
    public ResponseEntity<APIResponse<GetTryOnPicture>> getTryOnPicture(
        @PathVariable Long reportId,
        @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(APIResponse
                .success(SuccessCode.OK, tryOnFacade.getTryOnPicture(reportId, userPrincipal.getId())));
    }
}
