package com.bonetobe.backend.auth.presentation;

import com.bonetobe.backend.common.response.APIResponse;
import com.bonetobe.backend.common.response.SuccessCode;
import com.bonetobe.backend.auth.application.EmailService;
import com.bonetobe.backend.auth.application.AuthService;
import com.bonetobe.backend.user.domain.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
}
