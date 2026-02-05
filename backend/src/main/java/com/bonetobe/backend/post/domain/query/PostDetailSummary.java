package com.bonetobe.backend.post.domain.query;

import com.bonetobe.backend.common.SkeletonType;
import com.bonetobe.backend.style.domain.StyleName;
import com.bonetobe.backend.user.domain.Gender;

import java.time.LocalDateTime;
import java.util.List;

public record PostDetailSummary(
        Long postId,
        String imageUrl,
        List<StyleName> style,
        Gender gender,
        Integer height,
        Integer weight,
        SkeletonType skeletonType,
        String content,
        Long likeCount,
        Long commentCount,
        Boolean isLiked,
        Boolean isScrapped,
        AuthorSummary author,
        LocalDateTime createdAt
) {

    public record AuthorSummary(
            Long userId,
            String profileImageUrl,
            String nickname
    ) {
    }
}
