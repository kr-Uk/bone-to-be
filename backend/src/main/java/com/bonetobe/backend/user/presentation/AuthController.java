package com.bonetobe.backend.user.presentation;

import com.bonetobe.backend.common.response.APIResponse;
import com.bonetobe.backend.common.response.SuccessCode;
import com.bonetobe.backend.user.domain.EmailService;
import com.bonetobe.backend.user.domain.AuthService;
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

    // 이메일 인증코드 발송
    @PostMapping("/email/validate")
    public ResponseEntity<APIResponse<Void>> sendEmailCode(@RequestParam String email) {
        emailService.sendEmailCode(email);
        return ResponseEntity.ok(APIResponse.success(SuccessCode.OK));
    }

    @GetMapping("/email/validate")
    public ResponseEntity<APIResponse<AddUser.EmailVerificationResponse>> verifyEmailCode(
            @RequestParam String email,
            @RequestParam String code) {

        boolean isValid = emailService.verifyCode(email, code);
        return ResponseEntity.ok(
                APIResponse.success(SuccessCode.OK, AddUser.EmailVerificationResponse.from(isValid))
        );
    }

    @PostMapping("/signup")
    public ResponseEntity<APIResponse<AddUser.Response>> signup(@RequestBody @Valid AddUser.Request request) {
        User user = authService.save(request.toCommand());
        return ResponseEntity.ok(APIResponse.success(SuccessCode.CREATED, AddUser.Response.from(user)));
    }
}
