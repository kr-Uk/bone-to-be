package com.bonetobe.backend.post.presentation.dto;

import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;
import com.bonetobe.backend.post.domain.command.ReplyCreateCommand;

public class ReplyCreateDto {
    public record Request(
            String content
    ){
        public ReplyCreateCommand toCommand(Long postId, Long userId){
            if (postId == null || userId == null){
                throw new BusinessException(ErrorCode.BAD_REQUEST);
            }

            return new ReplyCreateCommand(
                    postId,
                    userId,
                    content
            );
        }
    }
}
