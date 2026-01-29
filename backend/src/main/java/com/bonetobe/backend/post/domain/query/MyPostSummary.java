package com.bonetobe.backend.post.domain.query;

public record MyPostSummary(
        Long postId,
        String imageUrl,
        Long likeCount
) {
}
