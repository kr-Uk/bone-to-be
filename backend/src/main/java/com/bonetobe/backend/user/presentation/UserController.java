package com.bonetobe.backend.user.presentation;

import com.bonetobe.backend.user.infrastructure.UserPrincipal;
import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.APIResponse;
import com.bonetobe.backend.common.response.ErrorCode;
import com.bonetobe.backend.common.response.SuccessCode;
import com.bonetobe.backend.user.domain.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    // 프로필 조회
    //@GetMapping("/me")

    // 이미지 업로드
//    @PostMapping("/image/presigned-url")
//    public ResponseEntity<APIResponse<UpdateUser.PresignedUrlResponse>> generatePresignedUrl(
//            @AuthenticationPrincipal UserPrincipal principal,
//            @RequestBody @Valid UpdateUser.PresignedUrlRequest request
//    ) {
//        UpdateUser.PresignedUrlResponse response =
//                userService.generatePresignedUrl(principal.getUserId(), request);
//
//        return ResponseEntity.ok(APIResponse.success(SuccessCode.OK, response));
//    }

    // 마이페이지 수정
    //@PutMapping("/me")

    @PatchMapping("/me/password")
    public ResponseEntity<APIResponse<Void>> updatePassword(
            @AuthenticationPrincipal UserPrincipal principal, // UserPrincipal로 변경
            @RequestBody @Valid UpdateUser.PasswordRequest request) {

        if (principal == null) {
            log.error("[Auth Error] 인증 객체가 Null입니다.");
            throw new BusinessException(ErrorCode.UNAUTHORIZED);
        }

        // principal.getUserId()를 사용하여 요청 처리
        userService.updatePassword(request.toCommand(principal.getUserId()));

        return ResponseEntity.ok(APIResponse.success(SuccessCode.OK));
    }

    @DeleteMapping("/me")
    public ResponseEntity<APIResponse<Void>> deleteAccount(
            @AuthenticationPrincipal UserPrincipal principal) { // 타입을 UserPrincipal로 변경

        if (principal == null) {
            log.error("[Auth Error] 인증 객체가 Null입니다.");
            throw new BusinessException(ErrorCode.UNAUTHORIZED);
        }

        userService.deleteAccount(principal.getUserId()); // principal.getUserId() 호출
        return ResponseEntity.ok(APIResponse.success(SuccessCode.OK));
    }
}
