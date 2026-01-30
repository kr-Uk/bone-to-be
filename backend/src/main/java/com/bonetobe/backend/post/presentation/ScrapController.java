package com.bonetobe.backend.post.presentation;

import com.bonetobe.backend.common.response.APIResponse;
import com.bonetobe.backend.common.response.SuccessCode;
import com.bonetobe.backend.post.application.ScrapFacade;
import com.bonetobe.backend.user.infrastructure.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/feeds/{postId}/scraps")
public class ScrapController {

    private final ScrapFacade scrapFacade;

    @PostMapping
    public ResponseEntity<APIResponse<Void>> scrap(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        scrapFacade.scrap(postId, user.getId());
        return ResponseEntity
                .status(SuccessCode.OK.getStatus())
                .body(APIResponse.success(SuccessCode.OK));
    }

    @DeleteMapping
    public ResponseEntity<APIResponse<Void>> unscrap(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        scrapFacade.unscrap(postId, user.getId());
        return ResponseEntity
                .status(SuccessCode.OK.getStatus())
                .body(APIResponse.success(SuccessCode.OK));
    }
}
