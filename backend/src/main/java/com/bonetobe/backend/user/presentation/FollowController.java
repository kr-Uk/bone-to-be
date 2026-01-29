package com.bonetobe.backend.user.presentation;

import com.bonetobe.backend.common.response.APIResponse;
import com.bonetobe.backend.common.response.SuccessCode;
import com.bonetobe.backend.user.domain.FollowService;
import com.bonetobe.backend.user.infrastructure.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class FollowController {
    private final FollowService followService;

    @PostMapping("/{userId}/follow")
    public ResponseEntity<APIResponse<Void>> follow(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserPrincipal user
            ) {
        followService.follow(userId, user.getId());
        return ResponseEntity
                .status(SuccessCode.OK.getStatus())
                .body(APIResponse.success(SuccessCode.OK));
    }

    @DeleteMapping("/{userId}/follow")
    public ResponseEntity<APIResponse<Void>> unfollow(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        followService.unfollow(userId, user.getId());
        return ResponseEntity
                .status(SuccessCode.OK.getStatus())
                .body(APIResponse.success(SuccessCode.OK));
    }
}
