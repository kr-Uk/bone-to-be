package com.bonetobe.backend.post.domain.query;

import com.bonetobe.backend.common.SkeletonType;

import java.time.LocalDateTime;
import java.util.List;

public record PostSummaryRaw(
        Long postId,
        Long fileId,
        String gender,
        SkeletonType skeletonType,
        List<String> style,
        Integer height,
        Integer weight,
        boolean isLiked,
        LocalDateTime createdAt
) {
}
