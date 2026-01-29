package com.bonetobe.backend.user.infrastructure;

import com.bonetobe.backend.user.domain.Follow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FollowJpaRepository extends JpaRepository<Follow, Long> {
    // 언팔로우 시 대상을 찾기 위해 필요합니다.
    Optional<Follow> findByFollowingIdAndFollowerId(Long followingId, Long followerId);

    // 이미 팔로우 중인지 확인하기 위해 필요합니다.
    boolean existsByFollowingIdAndFollowerId(Long followingId, Long followerId);

    long countByFollowingId(Long userId);

    long countByFollowerId(Long userId);
}
