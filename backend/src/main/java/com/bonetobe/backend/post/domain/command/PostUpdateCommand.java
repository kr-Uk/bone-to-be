package com.bonetobe.backend.post.domain.command;

import com.bonetobe.backend.common.SkeletonType;
import com.bonetobe.backend.style.domain.StyleName;
import com.bonetobe.backend.user.domain.Gender;

import java.util.List;

public record PostUpdateCommand(
        Long userId,
        String content,
        Gender gender,
        SkeletonType skeletonType,
        List<StyleName> styles,
        Integer height,
        Integer weight
) {
}

