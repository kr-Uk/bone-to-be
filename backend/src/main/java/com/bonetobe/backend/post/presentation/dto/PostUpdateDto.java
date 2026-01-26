package com.bonetobe.backend.post.presentation.dto;

import com.bonetobe.backend.common.SkeletonType;
import com.bonetobe.backend.post.domain.command.PostUpdateCommand;
import com.bonetobe.backend.style.domain.StyleName;

import java.util.List;

public class PostUpdateDto {
    public record Request(
            SkeletonType skeletonType,
            String content,
            List<StyleName> styles
    ) {
        public PostUpdateCommand toCommand(Long userId) {
            return new PostUpdateCommand(userId, skeletonType, content, styles);
        }
    }
}
