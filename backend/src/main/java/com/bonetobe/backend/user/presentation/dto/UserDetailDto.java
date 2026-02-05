package com.bonetobe.backend.user.presentation.dto;

import com.bonetobe.backend.common.SkeletonType;

public record UserDetailDto(
        String profileImageUrl,
        String nickname,
        String skeletonType,
        long postCount,
        long followerCount,
        long followingCount,
        String bio,
        boolean isFollowing
) {}