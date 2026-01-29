package com.bonetobe.backend.post.presentation.dto;

import com.bonetobe.backend.common.SkeletonType;
import com.bonetobe.backend.post.domain.query.PostDetailSummary;
import com.bonetobe.backend.style.domain.StyleName;
import com.bonetobe.backend.user.domain.Gender;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.List;

public class PostDetailDto {

    @Schema(name = "PostDetailResponse")
    public record Response(
            Long postId,
            String imageUrl,
            List<StyleName> style,
            Gender gender,
            Integer height,
            Integer weight,
            SkeletonType skeletonType,
            String content,
            Long likeCount,
            Boolean isLiked,
            Author author,
            LocalDateTime createdAt
    ) {
        public static Response of(PostDetailSummary summary) {
            return new Response(
                    summary.postId(),
                    summary.imageUrl(),
                    summary.style(),
                    summary.gender(),
                    summary.height(),
                    summary.weight(),
                    summary.skeletonType(),
                    summary.content(),
                    summary.likeCount(),
                    summary.isLiked(),
                    Author.of(summary.author()),
                    summary.createdAt()
            );
        }
    }

    public record Author(
            Long userId,
            String profileImageUrl,
            String nickname
    ) {
        public static Author of(PostDetailSummary.AuthorSummary summary) {
            return new Author(
                    summary.userId(),
                    summary.profileImageUrl(),
                    summary.nickname()
            );
        }
    }
}
