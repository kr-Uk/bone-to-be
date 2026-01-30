package com.bonetobe.backend.user.domain;

import java.util.Optional;

public interface FollowRepository {
    Optional<Follow> findByFollowingIdAndFollowerId(Long followingId, Long followerId);
    boolean existsByFollowingIdAndFollowerId(Long followingId, Long followerId);
    Follow save(Follow follow);
    void delete(Follow follow);

    long countByFollowingId(Long userId);
    long countByFollowerId(Long userId);

    boolean existsByFollowerIdAndFollowingId(Long currentUserId, Long targetUserId);
}
