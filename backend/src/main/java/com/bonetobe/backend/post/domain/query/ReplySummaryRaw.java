package com.bonetobe.backend.post.domain.query;

import java.time.LocalDateTime;

public record ReplySummaryRaw(
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
            Long profileId,
            String nickname
    ) {
    }

    public ReplySummary toSummary(String profileImageUrl) {
        return new ReplySummary(
                replyId,
                new ReplySummary.AuthorSummary(
                        author.userId(),
                        profileImageUrl,
                        author.nickname()
                ),
                content,
                likeCount,
                isLiked,
                isMine,
                createdAt
        );
    }
}
