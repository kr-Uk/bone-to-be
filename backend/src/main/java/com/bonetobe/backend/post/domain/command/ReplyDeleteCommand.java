package com.bonetobe.backend.post.domain.command;

public record ReplyDeleteCommand (
        Long postId,
        Long userId,
        Long replyId
){
}
