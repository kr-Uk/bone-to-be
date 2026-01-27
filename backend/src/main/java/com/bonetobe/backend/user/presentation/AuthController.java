package com.bonetobe.backend.user.presentation;

import com.bonetobe.backend.common.response.APIResponse;
import com.bonetobe.backend.common.response.ErrorCode;
import com.bonetobe.backend.common.response.SuccessCode;
import com.bonetobe.backend.user.domain.EmailService;
import com.bonetobe.backend.user.domain.AuthService;
import com.bonetobe.backend.user.domain.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;
    private final EmailService emailService;

    @GetMapping("/check/nickname")
    public ResponseEntity<APIResponse<AddUser.NicknameCheckResponse>> checkNickname(@RequestParam String nickname) {
        boolean isDuplicated = authService.existsByNickname(nickname);

        return ResponseEntity.ok(
                APIResponse.success(SuccessCode.OK, AddUser.NicknameCheckResponse.from(isDuplicated))
        );
    }

    @GetMapping("/check/email")
    public ResponseEntity<APIResponse<AddUser.EmailCheckResponse>> checkEmail(@RequestParam String email) {
        boolean isDuplicated = authService.existsByEmail(email);

        return ResponseEntity.ok(
                APIResponse.success(SuccessCode.OK, AddUser.EmailCheckResponse.from(isDuplicated))
        );
    }

    @PostMapping("/email/verification")
    public ResponseEntity<APIResponse<Void>> sendEmailCode(@RequestBody @Valid AddUser.EmailRequest request) {
        emailService.sendEmailCode(request.getEmail());
        return ResponseEntity.ok(APIResponse.success(SuccessCode.OK));
    }

    @PostMapping("/email/verification/check")
    public ResponseEntity<APIResponse<AddUser.EmailVerificationResponse>> verifyEmailCode(
            @RequestBody @Valid AddUser.EmailVerificationRequest request) {

        log.info("[이메일 검증 요청] email: {}", request.getEmail());

        boolean isValid = emailService.verifyCode(
                request.getEmail(),
                request.getCode()
        );

        log.info("[이메일 검증 결과] email: {}, isValid: {}", request.getEmail(), isValid);

        return ResponseEntity.ok(
                APIResponse.success(
                        SuccessCode.OK,
                        AddUser.EmailVerificationResponse.from(isValid)
                )
        );
    }

    @PostMapping("/signup")
    public ResponseEntity<APIResponse<AddUser.Response>> signup(@RequestBody @Valid AddUser.Request request) {
        User user = authService.signup(request.toCommand());
        return ResponseEntity.ok(APIResponse.success(SuccessCode.CREATED, AddUser.Response.from(user)));
    }

    // 비밀번호 찾기 메일 발송
    @PostMapping("/password/reset/request")
    public ResponseEntity<APIResponse<Void>> requestPasswordReset(
            @RequestBody @Valid PasswordReset.Request request) {

        // 1. 가입된 유저인지 확인
        authService.validateUserExists(request.getEmail());

        // 2. 재설정 인증 코드 메일 발송
        emailService.sendPasswordResetCode(request.getEmail());

        return ResponseEntity.ok(APIResponse.success(SuccessCode.OK));
    }

    // 새 비밀번호 설정
    @PostMapping("/password/reset/confirm")
    public ResponseEntity<APIResponse<Void>> confirmPasswordReset(
            @RequestBody @Valid PasswordReset.ConfirmRequest request) {

        // 1. 이메일 인증 코드 검증
        boolean isValid = emailService.verifyCode(request.getEmail(), request.getCode());

        if (!isValid) {
            // ErrorCode.java에 적절한 코드가 없다면 BAD_REQUEST 등을 활용하거나 새로 정의하세요.
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(APIResponse.fail(ErrorCode.BAD_REQUEST, "인증 코드가 유효하지 않습니다."));
        }

        // 2. 비밀번호 변경 실행 (AuthService 내부에서 암호화 처리)
        authService.updatePassword(request.getEmail(), request.getNewPassword());

        return ResponseEntity.ok(APIResponse.success(SuccessCode.UPDATED));
    }
}
