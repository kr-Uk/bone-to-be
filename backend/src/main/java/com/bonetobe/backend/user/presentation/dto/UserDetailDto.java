package com.bonetobe.backend.user.presentation.dto;

import com.bonetobe.backend.common.SkeletonType;

public record UserDetailDto(
        String profileImageUrl,
        String nickname,
        SkeletonType skeletonType,
        long postCount,
        long followerCount,
        long followingCount,
        String bio
) {}