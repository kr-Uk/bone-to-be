package com.bonetobe.backend.user.domain;

public interface EmailService {
    void sendEmailCode(String email);
    boolean verifyCode(String email, String code);
    boolean isEmailVerified(String email);
    void sendPasswordResetLink(String email);
    void validateTokenOnly(String token);
    String getEmailByResetToken(String token);
    void deleteAuthStatus(String email);
}
