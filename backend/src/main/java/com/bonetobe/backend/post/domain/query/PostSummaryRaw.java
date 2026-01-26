package com.bonetobe.backend.post.domain.query;

import com.bonetobe.backend.common.SkeletonType;
import com.bonetobe.backend.style.domain.StyleName;
import com.bonetobe.backend.user.domain.Gender;

import java.time.LocalDateTime;
import java.util.List;

public record PostSummaryRaw(
        Long postId,
        Long fileId,
        Gender gender,
        SkeletonType skeletonType,
        List<StyleName> style,
        Integer height,
        Integer weight,
        boolean isLiked,
        LocalDateTime createdAt
) {
    public PostSummary toSummary(String imageUrl) {
        return new PostSummary(
                postId,
                imageUrl,
                gender,
                skeletonType,
                style,
                height,
                weight,
                isLiked,
                createdAt
        );
    }
}
