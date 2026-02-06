package com.bonetobe.backend.post.domain.query;

import com.bonetobe.backend.common.SkeletonType;
import com.bonetobe.backend.style.domain.StyleName;
import com.bonetobe.backend.user.domain.Gender;

import java.time.LocalDateTime;
import java.util.List;

public record PostSummary(
        Long postId,
        String imageUrl,
        String authorNickname,
        Gender gender,
        SkeletonType skeletonType,
        List<StyleName> style,
        Integer height,
        Integer weight,
        boolean isLiked,
        Long commentCount,
        LocalDateTime createdAt
) {
}
