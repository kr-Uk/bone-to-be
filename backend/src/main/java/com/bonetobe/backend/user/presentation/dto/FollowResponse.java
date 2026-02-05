package com.bonetobe.backend.user.presentation.dto;

import com.bonetobe.backend.common.SkeletonType;
import com.bonetobe.backend.file.domain.StoredFile;
import com.bonetobe.backend.user.domain.User;

public record FollowResponse(
        Long id,
        String nickname,
        String profileImageUrl, // 변경: 프론트에서 바로 쓸 수 있는 URL
        String skeletonType,
        String bio,
        boolean isFollowing
) {
    public static FollowResponse of(User user, String profileImageUrl, boolean isFollowing) {
        String skeletonType = (user.getSkeletonType() != null)
                ? user.getSkeletonType().name()
                : "UNKNOWN";

        return new FollowResponse(
                user.getId(),
                user.getNickname(),
                profileImageUrl,
                skeletonType,
                user.getBio(),
                isFollowing
        );
    }
}