package com.bonetobe.backend.post.domain.command;

import com.bonetobe.backend.common.DomainCategory;

public record PostFileCommand(
        Long userId,
        String originalFileName,
        String contentType,
        DomainCategory fileDomainCategory,
        Long fileSize
) {
}
