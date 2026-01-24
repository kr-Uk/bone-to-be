package com.bonetobe.backend.user.presentation;

import com.bonetobe.backend.common.response.APIResponse;
import com.bonetobe.backend.common.response.SuccessCode;
import com.bonetobe.backend.user.domain.EmailService;
import com.bonetobe.backend.user.domain.UserService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class UserApiController {
    private final UserService userService;
    private final EmailService emailService;

    @GetMapping("/check/nickname")
    public ResponseEntity<APIResponse<AddUser.NicknameCheckResponse>> checkNickname(@RequestParam String nickname) {
        boolean isDuplicated = userService.existsByNickname(nickname);

        return ResponseEntity.ok(
                APIResponse.success(SuccessCode.OK, AddUser.NicknameCheckResponse.from(isDuplicated))
        );
    }

    @GetMapping("/check/email")
    public ResponseEntity<APIResponse<AddUser.EmailCheckResponse>> checkEmail(@RequestParam String email) {
        boolean isDuplicated = userService.existsByEmail(email);

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
        log.info("회원가입 요청 수신: email={}", request.getEmail());

        AddUser.Response response = userService.save(request.toCommand());
        log.info("회원가입 완료: userId={}", response.getId());

        return ResponseEntity
                .status(SuccessCode.CREATED.getStatus())
                .body(APIResponse.success(SuccessCode.CREATED, response));
    }
}
