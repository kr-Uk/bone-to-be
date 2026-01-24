package com.bonetobe.backend.user.domain;

import com.bonetobe.backend.user.presentation.AddUser;

public interface UserService {
    boolean existsByEmail(String email);
    boolean existsByNickname(String nickname);
    AddUser.Response save(UserCreateCommand command);
}
