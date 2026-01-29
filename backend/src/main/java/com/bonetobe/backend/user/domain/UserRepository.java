package com.bonetobe.backend.user.domain;

import java.util.List;
import java.util.Optional;

public interface UserRepository {
    Optional<User> findById(Long id);
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsActiveUserByEmail(String email);
    boolean existsByNickname(String nickname);
    User save(User user);
    User update(User user);
    List<User> findFollowingsByUserId(Long userId);
    List<User> findFollowersByUserId(Long userId);
}