package com.bonetobe.backend.user.presentation.dto;

import com.bonetobe.backend.user.domain.User;

public record FollowResponse(
        Long id,
        String nickname,
        String profileImageUrl
) {
    public static FollowResponse from(User user) {
        return new FollowResponse(
                user.getId(),
                user.getNickname(),
                // profileImage가 존재할 때만 key 또는 URL 추출
                user.getProfileImage() != null ? user.getProfileImage().getKey() : null
        );
    }
}