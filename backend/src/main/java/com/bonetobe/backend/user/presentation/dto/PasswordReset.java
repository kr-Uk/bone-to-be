package com.bonetobe.backend.user.presentation.dto;

import com.bonetobe.backend.common.annotation.Password;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class PasswordReset {

    @Getter
    @NoArgsConstructor
    public static class Request {
        @Email
        @NotBlank
        private String email;
    }

    @Getter @NoArgsConstructor
    public static class ConfirmRequest {
        @NotBlank
        private String token; // 이메일 링크에서 받아온 UUID 토큰

        @Password
        private String newPassword;

        @NotBlank
        private String confirmPassword;
    }
}