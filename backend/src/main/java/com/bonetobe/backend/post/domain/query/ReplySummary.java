package com.bonetobe.backend.post.domain.query;

import java.time.LocalDateTime;

public record ReplySummary(
        Long replyId,
        AuthorSummary author,
        String content,
        Long likeCount,
        Boolean isLiked,
        Boolean isMine,
        LocalDateTime createdAt
) {
    public record AuthorSummary(
            Long userId,
            String profileImageUrl,
            String nickname
    ) {
    }
}