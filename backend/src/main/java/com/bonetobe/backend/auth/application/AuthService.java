package com.bonetobe.backend.auth.application;

import com.bonetobe.backend.user.domain.User;
import com.bonetobe.backend.user.domain.UserCreateCommand;

public interface AuthService {
    boolean existsByEmail(String email);
    boolean existsByNickname(String nickname);
    User signup(UserCreateCommand command);
}
