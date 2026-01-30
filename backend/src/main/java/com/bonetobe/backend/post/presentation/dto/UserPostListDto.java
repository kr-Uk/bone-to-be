package com.bonetobe.backend.post.presentation.dto;

import com.bonetobe.backend.post.domain.query.UserPostSummary;
import io.swagger.v3.oas.annotations.media.Schema;

public class UserPostListDto {

    @Schema(name = "MyPostListResponse")
    public record Response(
            Long postId,
            String imageUrl,
            Long likeCount,
            Long commentCount
    ) {
        public static Response of(UserPostSummary summary) {
            return new Response(
                    summary.postId(),
                    summary.imageUrl(),
                    summary.likeCount(),
                    summary.commentCount()
            );
        }
    }
}
