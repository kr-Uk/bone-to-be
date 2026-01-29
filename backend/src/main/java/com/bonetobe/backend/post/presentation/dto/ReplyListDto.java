package com.bonetobe.backend.post.presentation.dto;

import com.bonetobe.backend.post.domain.query.ReplySummary;

import java.time.LocalDateTime;

public class ReplyListDto {

    public record Response(
            Long replyId,
            Author author,
            String content,
            Long likeCount,
            Boolean isLiked,
            Boolean isMine,
            LocalDateTime createdAt
    ) {
        public static Response of(ReplySummary summary) {
            return new Response(
                    summary.replyId(),
                    Author.of(summary.author()),
                    summary.content(),
                    summary.likeCount(),
                    summary.isLiked(),
                    summary.isMine(),
                    summary.createdAt()
            );
        }
    }

    public record Author(
            Long userId,
            String profileImageUrl,
            String nickname
    ) {
        public static Author of(ReplySummary.AuthorSummary summary) {
            return new Author(
                    summary.userId(),
                    summary.profileImageUrl(),
                    summary.nickname()
            );
        }
    }
}
