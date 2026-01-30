package com.bonetobe.backend.user.presentation.dto;

import com.bonetobe.backend.common.SkeletonType;
import com.bonetobe.backend.file.domain.StoredFile;
import com.bonetobe.backend.user.domain.User;

public record FollowResponse(
        Long id,
        String nickname,
        String profileImageUrl, // 변경: 프론트에서 바로 쓸 수 있는 URL
        SkeletonType skeletonType,
        String bio,
        boolean isFollowing
) {
    public static FollowResponse of(User user, String profileImageUrl, boolean isFollowing) {
        return new FollowResponse(
                user.getId(),
                user.getNickname(),
                profileImageUrl,
                user.getSkeletonType(),
                user.getBio(),
                isFollowing
        );
    }
}