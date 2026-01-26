package com.bonetobe.backend.post.domain.command;

public record PostDeleteCommand(
        Long userId,
        Long postId
) {}
