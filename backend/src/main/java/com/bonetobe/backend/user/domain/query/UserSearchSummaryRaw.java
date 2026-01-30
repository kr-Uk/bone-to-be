package com.bonetobe.backend.user.domain.query;

public record UserSearchSummaryRaw(
        Long userId,
        String nickname,
        Long fileId,
        Boolean isFollowing
) {
    public UserSearchSummary toSummary(String imageUrl) {
        return new UserSearchSummary(
                userId,
                nickname,
                imageUrl,
                isFollowing
        );
    }
}
