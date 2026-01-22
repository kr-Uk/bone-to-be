package com.bonetobe.backend.post.presentation.dto;

import com.bonetobe.backend.common.SkeletonType;
import com.bonetobe.backend.post.application.query.PostSummary;

import java.time.LocalDateTime;
import java.util.List;

public record PostDto(
        Long postId,
        String imageUrl,
        String gender,
        SkeletonType skeletonType,
        List<String> style,
        Integer height,
        Integer weight,
        Boolean isLiked,
        LocalDateTime createdAt
) {
    public static PostDto of(PostSummary summary) {
        return new PostDto(
                summary.postId(),
                summary.imageUrl(),
                summary.gender(),
                summary.skeletonType(),
                summary.style(),
                summary.height(),
                summary.weight(),
                summary.isLiked(),
                summary.createdAt()
        );
    }
}
