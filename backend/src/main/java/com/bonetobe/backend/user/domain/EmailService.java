package com.bonetobe.backend.user.domain;

public interface EmailService {
    void sendEmailCode(String email);
    boolean verifyCode(String email, String code);
}
