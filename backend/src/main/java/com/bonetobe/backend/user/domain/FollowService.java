package com.bonetobe.backend.user.domain;

public interface FollowService {
    void follow(Long userId, Long id);
    void unfollow(Long userId, Long id);
}
