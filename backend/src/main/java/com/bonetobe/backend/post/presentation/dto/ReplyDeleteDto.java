package com.bonetobe.backend.post.presentation.dto;

import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;
import com.bonetobe.backend.post.domain.command.ReplyDeleteCommand;

public class ReplyDeleteDto {
    public record Request() {
        public static ReplyDeleteCommand toCommand(Long postId, Long userId, Long replyId) {
            if (userId == null || postId == null || replyId == null) {
                throw new BusinessException(ErrorCode.BAD_REQUEST);
            }
            return new ReplyDeleteCommand(postId, userId, replyId);
        }
    }
}
