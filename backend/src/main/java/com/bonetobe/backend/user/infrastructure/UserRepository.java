package com.bonetobe.backend.user.infrastructure;

import com.bonetobe.backend.user.domain.User;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    // 기본적으로 @Where(is_deleted = false)가 붙어서 작동함
    boolean existsByEmail(String email);
    boolean existsByNickname(String nickname);

    // 가끔 삭제된 유저까지 포함해서 조회해야 할 때 (예: 관리자 기능)
    @Query(value = "SELECT * FROM users u WHERE u.email = :email", nativeQuery = true)
    Optional<User> findAnyByEmail(@Param("email") String email);
}