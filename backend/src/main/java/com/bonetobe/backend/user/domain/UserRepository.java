package com.bonetobe.backend.user.domain;

import java.util.Optional;

public interface UserRepository {
    Optional<User> findById(Long id);
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsActiveUserByEmail(String email);
    boolean existsByNickname(String nickname);
    User save(User user);
    User update(User user);
}