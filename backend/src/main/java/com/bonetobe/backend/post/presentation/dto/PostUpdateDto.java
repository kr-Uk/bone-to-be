package com.bonetobe.backend.post.presentation.dto;

import com.bonetobe.backend.common.SkeletonType;
import com.bonetobe.backend.post.domain.command.PostUpdateCommand;
import com.bonetobe.backend.style.domain.StyleName;
import com.bonetobe.backend.user.domain.Gender;

import java.util.List;

public class PostUpdateDto {
    public record Request(
            String content,
            Gender gender,
            SkeletonType skeletonType,
            List<StyleName> style,
            Integer height,
            Integer weight
    ) {
        public PostUpdateCommand toCommand(Long userId) {
            return new PostUpdateCommand(userId, content, gender, skeletonType, style, height, weight);
        }
    }
}
