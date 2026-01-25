package com.bonetobe.backend.post.presentation.dto;

import com.bonetobe.backend.common.SkeletonType;
import com.bonetobe.backend.post.domain.command.PostCreateCommand;
import com.bonetobe.backend.style.domain.StyleName;
import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;

import java.util.List;

public class PostCreateDto {

    public record Request(
            Long fileId,
            SkeletonType skeletonType,
            String content,
            List<StyleName> style
    ) {
        public PostCreateCommand toCommand(Long userId) {

            if (fileId == null) {
                throw new BusinessException(ErrorCode.POST_CREATE_FILE_REQUIRED);
            }

            if (content == null || content.isBlank()) {
                throw new BusinessException(ErrorCode.POST_CREATE_CONTENT_REQUIRED);
            }

            return new PostCreateCommand(
                    userId,
                    fileId,
                    skeletonType,
                    content,
                    style
            );
        }
    }
}
