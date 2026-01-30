package com.bonetobe.backend.post.domain.query;

public record UserPostSummaryRaw(
        Long postId,
        Long fileId,
        Long likeCount,
        Long commentCount
) {
    public UserPostSummary toSummary(String imageUrl) {
        return new UserPostSummary(
                postId,
                imageUrl,
                likeCount,
                commentCount
        );
    }
}
