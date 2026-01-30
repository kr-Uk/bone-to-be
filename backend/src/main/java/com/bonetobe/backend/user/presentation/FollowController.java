package com.bonetobe.backend.user.presentation;

import com.bonetobe.backend.common.response.APIResponse;
import com.bonetobe.backend.common.response.SuccessCode;
import com.bonetobe.backend.user.domain.FollowService;
import com.bonetobe.backend.user.infrastructure.UserPrincipal;
import com.bonetobe.backend.user.presentation.dto.FollowResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/me/followings")
    public ResponseEntity<APIResponse<List<FollowResponse>>> getMyFollowings(
            @AuthenticationPrincipal UserPrincipal user
    ) {
        return ResponseEntity
                .status(SuccessCode.OK.getStatus())
                .body(APIResponse.success(SuccessCode.OK, followService.getFollowings(user.getId(), user.getId())));
    }

    @GetMapping("/{userId}/followings")
    public ResponseEntity<APIResponse<List<FollowResponse>>> getOtherFollowings(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        Long currentUserId = (user != null) ? user.getId() : null;
        return ResponseEntity
                .status(SuccessCode.OK.getStatus())
                .body(APIResponse.success(SuccessCode.OK, followService.getFollowings(userId, currentUserId)));
    }

    @GetMapping("/me/followers")
    public ResponseEntity<APIResponse<List<FollowResponse>>> getMyFollowers(
            @AuthenticationPrincipal UserPrincipal user
    ) {
        // 내 팔로워 리스트에서도 내가 그들을 맞팔로우 중인지 확인
        return ResponseEntity
                .status(SuccessCode.OK.getStatus())
                .body(APIResponse.success(SuccessCode.OK, followService.getFollowers(user.getId(), user.getId())));
    }

    @GetMapping("/{userId}/followers")
    public ResponseEntity<APIResponse<List<FollowResponse>>> getOtherFollowers(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserPrincipal user // 추가
    ) {
        Long currentUserId = (user != null) ? user.getId() : null;
        return ResponseEntity
                .status(SuccessCode.OK.getStatus())
                .body(APIResponse.success(SuccessCode.OK, followService.getFollowers(userId, currentUserId)));
    }
}
