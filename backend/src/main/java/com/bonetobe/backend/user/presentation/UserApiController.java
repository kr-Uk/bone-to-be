package com.bonetobe.backend.user.presentation;

import com.bonetobe.backend.common.response.APIResponse;
import com.bonetobe.backend.common.response.SuccessCode;
import com.bonetobe.backend.user.domain.EmailService;
import com.bonetobe.backend.user.domain.UserService;
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
    public ResponseEntity<APIResponse<Map<String, Boolean>>> checkNickname(@RequestParam String nickname) {
        boolean hasNickname = userService.existsByNickname(nickname);

        return ResponseEntity.ok(
                APIResponse.success(SuccessCode.OK, Map.of("hasNickname", hasNickname))
        );
    }

    @GetMapping("/check/email")
    public ResponseEntity<APIResponse<Map<String, Boolean>>> checkEmail(@RequestParam String email) {
        boolean hasEmail = userService.existsByEmail(email);

        return ResponseEntity.ok(
                APIResponse.success(SuccessCode.OK, Map.of("hasEmail", hasEmail))
        );
    }

    // 이메일 인증코드 발송
    @PostMapping("/email/validate")
    public ResponseEntity<APIResponse<Void>> sendEmailCode(@RequestParam String email) {
        emailService.sendEmailCode(email);
        return ResponseEntity.ok(APIResponse.success(SuccessCode.OK));
    }

    // 이메일 인증코드 확인
    @GetMapping("/email/validate")
    public ResponseEntity<APIResponse<Map<String, Boolean>>> verifyEmailCode(
            @RequestParam String email,
            @RequestParam String code) {

        boolean isValid = emailService.verifyCode(email, code);
        return ResponseEntity.ok(
                APIResponse.success(SuccessCode.OK, Map.of("isValid", isValid))
        );
    }

    @PostMapping("/signup")
    public ResponseEntity<APIResponse<Long>> signup(@RequestBody AddUserRequest request) {
        log.info("회원가입 요청 수신: email={}", request.getEmail());

        Long userId = userService.save(request.toCommand());
        log.info("회원가입 완료: userId={}", userId);

        return ResponseEntity
                .status(SuccessCode.CREATED.getStatus())
                .body(APIResponse.success(SuccessCode.CREATED, userId));
    }


}
