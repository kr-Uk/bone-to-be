package com.bonetobe.backend.post.presentation.dto;

import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;
import com.bonetobe.backend.post.domain.command.PostDeleteCommand;

public class PostDeleteDto {

    public record Request() {
        public static PostDeleteCommand toCommand(Long userId, Long postId) {
            if (userId == null || postId == null) {
                throw new BusinessException(ErrorCode.BAD_REQUEST);
            }
            return new PostDeleteCommand(userId, postId);
        }
    }
}
