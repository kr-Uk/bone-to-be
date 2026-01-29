package com.bonetobe.backend.post.domain.command;

public record ReplyCreateCommand(
        Long postId,
        Long userId,
        String content

) {

}
