package com.bonetobe.backend.user.domain;

import com.bonetobe.backend.user.presentation.dto.FollowResponse;

import java.util.List;

public interface FollowService {
    void follow(Long followingId, Long followerId);
    void unfollow(Long followingId, Long followerId);
    List<FollowResponse> getFollowings(Long userId, Long currentUserId);
    List<FollowResponse> getFollowers(Long userId, Long currentUserId);
}
