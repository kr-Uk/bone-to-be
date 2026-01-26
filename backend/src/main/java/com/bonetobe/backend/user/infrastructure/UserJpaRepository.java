package com.bonetobe.backend.user.infrastructure;

import com.bonetobe.backend.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

interface UserJpaRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByNickname(String nickname);

    @Query(value = "SELECT * FROM users u WHERE u.email = :email", nativeQuery = true)
    Optional<User> findAnyByEmail(@Param("email") String email);
}
