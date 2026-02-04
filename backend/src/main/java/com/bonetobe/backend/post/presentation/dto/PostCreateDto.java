package com.bonetobe.backend.post.presentation.dto;

import com.bonetobe.backend.common.SkeletonType;
import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;
import com.bonetobe.backend.post.domain.command.PostCreateCommand;
import com.bonetobe.backend.post.presentation.parser.PostRequestParser;
import com.bonetobe.backend.style.domain.StyleName;
import com.bonetobe.backend.user.domain.Gender;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

public class PostCreateDto {

    @Schema(name = "PostCreateRequest")
    public record Request(
            Long fileId,
            String content,
            String gender,
            String skeletonType,
            List<String> style,
            Integer height,
            Integer weight
    ) {
        public PostCreateCommand toCommand(Long userId) {

            if (fileId == null) {
                throw new BusinessException(ErrorCode.POST_CREATE_FILE_REQUIRED);
            }

            if (content.length() > 500){
                throw new BusinessException(ErrorCode.POST_CREATE_CONTENT_LENGTH);
            }

            Gender parsedGender = PostRequestParser.parseGender(gender);
            SkeletonType parsedSkeletonType = PostRequestParser.parseSkeletonType(skeletonType);
            List<StyleName> parsedStyles = PostRequestParser.parseStyles(style);

            return new PostCreateCommand(
                    userId,
                    fileId,
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
