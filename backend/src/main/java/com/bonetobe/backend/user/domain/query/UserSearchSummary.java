package com.bonetobe.backend.user.domain.query;

public record UserSearchSummary(
        Long userId,
        String nickname,
        String profileImageUrl,
        Boolean isFollowing
) {

}
