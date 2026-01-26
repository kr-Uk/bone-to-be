package com.bonetobe.backend.post.presentation.dto;

import com.bonetobe.backend.common.SkeletonType;
import com.bonetobe.backend.post.domain.command.PostCreateCommand;
import com.bonetobe.backend.style.domain.StyleName;
import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;
import com.bonetobe.backend.user.domain.Gender;

import java.util.List;

public class PostCreateDto {

    public record Request(
            Long fileId,
            String content,
            Gender gender,
            SkeletonType skeletonType,
            List<StyleName> style,
            Integer height,
            Integer weight
    ) {
        public PostCreateCommand toCommand(Long userId) {

            if (fileId == null) {
                throw new BusinessException(ErrorCode.POST_CREATE_FILE_REQUIRED);
            }

            if (content == null || content.isBlank()) {
                throw new BusinessException(ErrorCode.POST_CREATE_CONTENT_REQUIRED);
            }

            if (gender == null) {
                throw new BusinessException(ErrorCode.POST_CREATE_GENDER_REQUIRED);
            }

            if (height == null) {
                throw new BusinessException(ErrorCode.POST_CREATE_HEIGHT_REQUIRED);
            }

            if (weight == null) {
                throw new BusinessException(ErrorCode.POST_CREATE_WEIGHT_REQUIRED);
            }

            return new PostCreateCommand(
                    userId,
                    fileId,
                    content,
                    gender,
                    skeletonType,
                    style,
                    height,
                    weight
            );
        }
    }
}
