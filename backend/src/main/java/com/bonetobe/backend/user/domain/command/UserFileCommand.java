package com.bonetobe.backend.user.domain.command;

import com.bonetobe.backend.common.DomainCategory;

public record UserFileCommand(
        Long userId,
        String originalFileName,
        String contentType,
        DomainCategory fileDomainCategory,
        Long fileSize
) {
}