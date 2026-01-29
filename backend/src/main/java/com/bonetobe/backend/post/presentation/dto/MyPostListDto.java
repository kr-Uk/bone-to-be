package com.bonetobe.backend.post.presentation.dto;

import com.bonetobe.backend.post.domain.query.MyPostSummary;
import io.swagger.v3.oas.annotations.media.Schema;

public class MyPostListDto {

    @Schema(name = "MyPostListResponse")
    public record Response(
            Long postId,
            String imageUrl,
            Long likeCount,
            Long commentCount
    ) {
        public static Response of(MyPostSummary summary) {
            return new Response(
                    summary.postId(),
                    summary.imageUrl(),
                    summary.likeCount(),
                    summary.commentCount()
            );
        }
    }
}
