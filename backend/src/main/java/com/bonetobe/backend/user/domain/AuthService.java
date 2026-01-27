package com.bonetobe.backend.user.domain;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public interface AuthService {
    boolean existsByEmail(String email);
    boolean existsByNickname(String nickname);
    User signup(UserCreateCommand command);
    void validateUserExists(@Email @NotBlank String email);
    void updatePassword(@Email @NotBlank String email, String newPassword);
}
