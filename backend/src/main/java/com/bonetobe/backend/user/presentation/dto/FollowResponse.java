package com.bonetobe.backend.user.presentation.dto;

import com.bonetobe.backend.common.SkeletonType;
import com.bonetobe.backend.file.domain.StoredFile;
import com.bonetobe.backend.user.domain.User;

public record FollowResponse(
        Long id,
        String nickname,
        StoredFile profileImage,
        SkeletonType skeletonType,
        String bio
) {
    public static FollowResponse from(User user) {
        return new FollowResponse(
                user.getId(),
                user.getNickname(),
                user.getProfileImage(),
                user.getSkeletonType(),
                user.getBio()
        );
    }
}