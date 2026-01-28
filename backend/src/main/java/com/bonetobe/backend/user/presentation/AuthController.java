package com.bonetobe.backend.user.presentation;

import com.bonetobe.backend.common.response.APIResponse;
import com.bonetobe.backend.common.response.SuccessCode;
import com.bonetobe.backend.user.domain.EmailService;
import com.bonetobe.backend.user.domain.AuthService;
import com.bonetobe.backend.user.infrastructure.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;
    private final EmailService emailService;

    // --- 중복 체크 및 이메일 인증 ---

    @GetMapping("/check/nickname")
    public ResponseEntity<APIResponse<AddUser.NicknameCheckResponse>> checkNickname(@RequestParam String nickname) {
        return ResponseEntity.ok(APIResponse.success(SuccessCode.OK, AddUser.NicknameCheckResponse.from(
                authService.existsByNickname(nickname))));
    }

    @GetMapping("/check/email")
    public ResponseEntity<APIResponse<AddUser.EmailCheckResponse>> checkEmail(@RequestParam String email) {
        return ResponseEntity.ok(APIResponse.success(SuccessCode.OK, AddUser.EmailCheckResponse.from(
                authService.existsByEmail(email))));
    }

    @PostMapping("/email/verification")
    public ResponseEntity<APIResponse<Void>> sendEmailCode(@RequestBody @Valid AddUser.EmailRequest request) {
        emailService.sendEmailCode(request.getEmail());
        return ResponseEntity.ok(APIResponse.success(SuccessCode.OK));
    }

    @PostMapping("/email/verification/check")
    public ResponseEntity<APIResponse<AddUser.EmailVerificationResponse>> verifyEmailCode(
            @RequestBody @Valid AddUser.EmailVerificationRequest request) {
        return ResponseEntity
                .ok(
                        APIResponse.success(SuccessCode.OK,
                                AddUser.EmailVerificationResponse.from(emailService.verifyCode(request.getEmail(), request.getCode()))));
    }

    @PostMapping("/signup")
    public ResponseEntity<APIResponse<AddUser.Response>> signup(@RequestBody @Valid AddUser.Request request) {
        return ResponseEntity.ok(APIResponse.success(SuccessCode.CREATED, AddUser.Response.from(authService.signup(request.toCommand()))));
    }

    // --- 로그인 및 로그아웃 (Security 필터 처리용 명세) ---

    @Operation(summary = "로그인", description = "이메일과 비밀번호를 사용하여 세션을 생성합니다.")
    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE) // 형식을 Form-data로 고정
    public ResponseEntity<APIResponse<Void>> login(@ModelAttribute @Valid LoginUser.Request request) {
        // 실제 로직은 필터에서 처리하므로 여기는 비워둬도 됩니다.
        return ResponseEntity.ok(APIResponse.success(SuccessCode.OK));
    }

    @Operation(summary = "로그아웃", description = "현재 세션을 무효화하고 로그아웃합니다.")
    @SecurityRequirement(name = "CookieAuth")
    @PostMapping("/logout")
    public ResponseEntity<APIResponse<Void>> logout() {
        // 실제 로직은 Spring Security Filter(LogoutFilter)에서 처리됩니다.
        return ResponseEntity.ok(APIResponse.success(SuccessCode.OK));
    }

    // --- 비밀번호 재설정 ---

    /**
     * 비밀번호 찾기 메일 발송 (UUID 링크 방식)
     */
    @PostMapping("/password/reset/request")
    public ResponseEntity<APIResponse<Void>> requestPasswordReset(
            @RequestBody @Valid PasswordReset.Request request) {

        // 1. 유저 존재 여부 확인 (AuthService 담당)
        authService.validateUserExists(request.getEmail());

        // 2. UUID 포함된 재설정 링크 발송 (EmailService 담당)
        emailService.sendPasswordResetLink(request.getEmail());

        return ResponseEntity.ok(APIResponse.success(SuccessCode.OK));
    }

    /**
     * 비밀번호 재설정 토큰 유효성 검증
     * 명세서의 '토큰 유효 검증' 항목에 해당합니다.
     */
    @GetMapping("/password/reset/verify")
    public ResponseEntity<APIResponse<Void>> verifyResetToken(@RequestParam String token) {
        // 1. Redis에 토큰이 살아있는지 확인 (삭제 X)
        emailService.validateTokenOnly(token);

        // 2. 유효하다면 200 OK 반환 -> 프론트에서 입력 폼 노출
        return ResponseEntity.ok(APIResponse.success(SuccessCode.OK));
    }

    /**
     * 새 비밀번호 설정 확정
     */
    @PostMapping("/password/reset/confirm")
    public ResponseEntity<APIResponse<Void>> confirmPasswordReset(
            @RequestBody @Valid PasswordReset.ConfirmRequest request) {

        // 1. 토큰 검증 및 이메일 추출 로직 (기존 유지)
        String email = emailService.getEmailByResetToken(request.getToken());
        log.info("[비밀번호 재설정 확인] 요청 이메일: {}", email);

        // 2. 비밀번호 업데이트 실행 (request 객체를 통째로 전달하도록 변경)
        authService.updatePassword(email, request);

        return ResponseEntity.ok(APIResponse.success(SuccessCode.UPDATED));
    }

    @GetMapping("/me")
    public ResponseEntity<APIResponse<AuthMeResponse>> getMyInfo(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            // 공통 에러 코드가 있다면 적용 (예: ErrorCode.UNAUTHORIZED)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(APIResponse.success(SuccessCode.OK, authService.getMyInfo(principal)));
    }
}