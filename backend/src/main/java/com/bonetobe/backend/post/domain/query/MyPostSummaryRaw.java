package com.bonetobe.backend.post.domain.query;

public record MyPostSummaryRaw(
        Long postId,
        Long fileId,
        Long likeCount,
        Long commentCount
) {
    public MyPostSummary toSummary(String imageUrl) {
        return new MyPostSummary(
                postId,
                imageUrl,
                likeCount,
                commentCount
        );
    }
}
