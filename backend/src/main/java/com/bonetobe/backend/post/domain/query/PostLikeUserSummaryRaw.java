package com.bonetobe.backend.post.domain.query;

public record PostLikeUserSummaryRaw (
        Long userId,
        String nickname,
        Long fileId,
        Boolean isFollowing
){
    public PostLikeUserSummary toSummary(String imageUrl) {
        return new PostLikeUserSummary(
                userId,
                nickname,
                imageUrl,
                isFollowing
        );
    }
}