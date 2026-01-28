package com.bonetobe.backend.post.presentation.dto;

import com.bonetobe.backend.common.SkeletonType;
import com.bonetobe.backend.post.domain.command.PostUpdateCommand;
import com.bonetobe.backend.post.presentation.parser.PostRequestParser;
import com.bonetobe.backend.style.domain.StyleName;
import com.bonetobe.backend.user.domain.Gender;

import java.util.List;

public class PostUpdateDto {
    public record Request(
            String content,
            String gender,
            String skeletonType,
            List<String> style,
            Integer height,
            Integer weight
    ) {
        public PostUpdateCommand toCommand(Long userId) {
            Gender parsedGender = PostRequestParser.parseGender(gender);
            SkeletonType parsedSkeletonType = PostRequestParser.parseSkeletonType(skeletonType);
            List<StyleName> parsedStyles = PostRequestParser.parseStyles(style);
            return new PostUpdateCommand(
                    userId,
                    content,
                    parsedGender,
                    parsedSkeletonType,
                    parsedStyles,
                    height,
                    weight
            );
        }
    }
}
