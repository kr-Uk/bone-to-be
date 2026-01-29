package com.bonetobe.backend.user.infrastructure;

import com.bonetobe.backend.user.domain.User;
import org.apache.ibatis.annotations.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

interface UserJpaRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailAndIsDeleted(String email, Boolean isDeleted);
    boolean existsByEmail(String email);
    boolean existsByEmailAndIsDeleted(String email, boolean isDeleted);
    boolean existsByNicknameAndIsDeleted(String Nickname, boolean isDeleted);

    @Query("SELECT f.following FROM Follow f WHERE f.follower.id = :userId")
    List<User> findFollowingsByUserId(@Param("userId") Long userId);
    @Query("SELECT f.follower FROM Follow f WHERE f.following.id = :userId")
    List<User> findFollowersByUserId(@Param("userId") Long userId);
}
