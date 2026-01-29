package com.bonetobe.backend.user.domain;

import com.bonetobe.backend.user.domain.command.UserCreateCommand;
import com.bonetobe.backend.user.infrastructure.UserPrincipal;
import com.bonetobe.backend.user.presentation.dto.AuthMeResponse;
import com.bonetobe.backend.user.presentation.dto.PasswordReset;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public interface AuthService {
    boolean existsByEmail(String email);
    boolean existsByNickname(String nickname);
    User signup(UserCreateCommand command);
    void validateUserExists(@Email @NotBlank String email);
    void updatePassword(String email, PasswordReset.ConfirmRequest request);
    AuthMeResponse getMyInfo(UserPrincipal principal);
}
