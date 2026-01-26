package com.bonetobe.backend.post.domain.command;

import com.bonetobe.backend.common.SkeletonType;
import com.bonetobe.backend.style.domain.StyleName;

import java.util.List;

public record PostUpdateCommand(
        Long userId,
        SkeletonType skeletonType,
        String content,
        List<StyleName> styles
) {}

