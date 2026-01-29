package com.bonetobe.backend.post.domain.query;

public record MyPostSummaryRaw(
        Long postId,
        Long fileId,
        Long likeCount
) {
    public MyPostSummary toSummary(String imageUrl) {
        return new MyPostSummary(
                postId,
                imageUrl,
                likeCount
        );
    }
}
