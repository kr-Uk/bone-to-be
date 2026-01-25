package com.bonetobe.backend.user.domain;

public interface AuthService {
    boolean existsByEmail(String email);
    boolean existsByNickname(String nickname);
    User save(UserCreateCommand command);
}
