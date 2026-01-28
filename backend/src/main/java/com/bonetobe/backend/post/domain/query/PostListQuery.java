package com.bonetobe.backend.post.domain.query;

import com.bonetobe.backend.common.SkeletonType;
import com.bonetobe.backend.user.domain.Gender;
import com.bonetobe.backend.post.domain.PostSort;
import com.bonetobe.backend.style.domain.StyleName;

import java.util.List;

public record PostListQuery(
        Long viewerId,
        PostSort postSort,
        Gender gender,
        SkeletonType skeletonType,
        Integer minHeight,
        Integer maxHeight,
        Integer minWeight,
        Integer maxWeight,
        List<StyleName> style
) {
}
