package com.bonetobe.backend.user.presentation;

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

    @Getter
    @NoArgsConstructor
    public static class ConfirmRequest {
        @Email
        @NotBlank
        private String email;

        @NotBlank
        private String code; // 메일로 받은 인증코드

        @NotBlank
        @Password
        private String newPassword;
    }
}