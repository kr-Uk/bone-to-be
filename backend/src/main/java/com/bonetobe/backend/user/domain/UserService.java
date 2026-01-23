package com.bonetobe.backend.user.domain;

public interface UserService {
    boolean existsByEmail(String email);
    boolean existsByNickname(String nickname);
    Long save(UserCreateCommand command);
}
