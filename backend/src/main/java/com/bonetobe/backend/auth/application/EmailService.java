package com.bonetobe.backend.auth.application;

public interface EmailService {
    void sendEmailCode(String email);
    boolean verifyCode(String email, String code);
}
