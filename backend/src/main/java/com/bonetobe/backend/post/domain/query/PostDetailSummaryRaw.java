package com.bonetobe.backend.post.domain.query;

import com.bonetobe.backend.common.SkeletonType;
import com.bonetobe.backend.style.domain.StyleName;
import com.bonetobe.backend.user.domain.Gender;

import java.time.LocalDateTime;
import java.util.List;

public record PostDetailSummaryRaw(
        Long postId,
        Long fileId,
        List<StyleName> style,
        Gender gender,
        Integer height,
        Integer weight,
        SkeletonType skeletonType,
        String content,
        Long likeCount,
        Long commentCount,
        Boolean isLiked,
        AuthorSummary author,
        LocalDateTime createdAt
) {
    public record AuthorSummary(
            Long userId,
            String nickname,
            Boolean isFollowing
    ) {}

    public PostDetailSummary toSummary(String imageUrl) {
        return new PostDetailSummary(
                postId,
                imageUrl,
                style,
                gender,
                height,
                weight,
                skeletonType,
                content,
                likeCount,
                commentCount,
                isLiked,
                new PostDetailSummary.AuthorSummary(
                        author.userId(),
                        author.nickname(),
                        author.isFollowing()
                ),
                createdAt
        );
    }
}
