package com.bonetobe.backend.user.domain;

public interface UserService {
    void updatePassword(UserUpdateCommand command);
    void deleteAccount(Long userId);
    User getUserById(Long userId);
}
