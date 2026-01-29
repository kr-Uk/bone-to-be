package com.bonetobe.backend.post.presentation;

import com.bonetobe.backend.common.response.APIResponse;
import com.bonetobe.backend.common.response.SuccessCode;
import com.bonetobe.backend.post.application.ReplyLikeFacade;
import com.bonetobe.backend.user.infrastructure.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/replies/{replyId}/likes")
public class ReplyLikeController {

    private final ReplyLikeFacade replyLikeFacade;

    @PostMapping
    public ResponseEntity<APIResponse<Void>> like(
            @PathVariable Long replyId,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        replyLikeFacade.like(replyId, user.getId());
        return ResponseEntity
                .status(SuccessCode.OK.getStatus())
                .body(APIResponse.success(SuccessCode.OK));
    }

    @DeleteMapping
    public ResponseEntity<APIResponse<Void>> unlike(
            @PathVariable Long replyId,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        replyLikeFacade.unlike(replyId, user.getId());
        return ResponseEntity
                .status(SuccessCode.OK.getStatus())
                .body(APIResponse.success(SuccessCode.OK));
    }
}
