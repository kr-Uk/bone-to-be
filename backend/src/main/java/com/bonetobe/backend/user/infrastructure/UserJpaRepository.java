package com.bonetobe.backend.user.infrastructure;

import com.bonetobe.backend.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

interface UserJpaRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailAndIsDeleted(String email, Boolean isDeleted);
    boolean existsByEmail(String email);
    boolean existsByNickname(String nickname);
    boolean existsByEmailAndIsDeleted(String email, boolean isDeleted);
    boolean existsByNicknameAndIsDeleted(String Nickname, boolean isDeleted);
}
