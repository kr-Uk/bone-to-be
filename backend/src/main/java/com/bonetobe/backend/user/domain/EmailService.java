package com.bonetobe.backend.user.domain;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public interface EmailService {
    void sendEmailCode(String email);
    boolean verifyCode(String email, String code);
    void sendPasswordResetCode(@Email @NotBlank String email);
}
