package com.bonetobe.backend.user.presentation;

import com.bonetobe.backend.auth.security.UserPrincipal;
import com.bonetobe.backend.common.response.APIResponse;
import com.bonetobe.backend.common.response.SuccessCode;
import com.bonetobe.backend.user.domain.User;
import com.bonetobe.backend.user.application.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    // 프로필 조회
    //@GetMapping("/me")

    // 이미지 업로드
    @PostMapping("/image/presigned-url")
    public ResponseEntity<APIResponse<UpdateUser.PresignedUrlResponse>> generatePresignedUrl(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody @Valid UpdateUser.PresignedUrlRequest request
    ) {
        UpdateUser.PresignedUrlResponse response =
                userService.generatePresignedUrl(principal.getUserId(), request);

        return ResponseEntity.ok(APIResponse.success(SuccessCode.OK, response));
    }

    // 마이페이지 수정
    //@PutMapping("/me")


    @DeleteMapping("/me")
    public ResponseEntity<APIResponse<Void>> deleteAccount(
            @AuthenticationPrincipal User user) {

        userService.deleteAccount(user.getId());
        return ResponseEntity.ok(APIResponse.success(SuccessCode.OK));
    }

    @PatchMapping("/me/password")
    public ResponseEntity<APIResponse<Void>> updatePassword(
            @AuthenticationPrincipal User user,
            @RequestBody @Valid UpdateUser.PasswordRequest request) {

        userService.updatePassword(request.toCommand(user.getId()));
        return ResponseEntity.ok(APIResponse.success(SuccessCode.OK));
    }
}
