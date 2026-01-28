package com.bonetobe.backend.user.domain.query;

public record UserFileSummary(
        Long fileId,
        String uploadUrl
) {
}