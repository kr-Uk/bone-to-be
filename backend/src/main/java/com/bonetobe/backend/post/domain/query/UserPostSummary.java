package com.bonetobe.backend.post.domain.query;

public record UserPostSummary(
        Long postId,
        String imageUrl,
        Long likeCount,
        Long commentCount
) {
}
