package com.bonetobe.backend.user.domain.command;

public record UpdateMyPageCommand(
        Long userId,
        String nickname,
        String bio,
        Long profileImageId
) {}