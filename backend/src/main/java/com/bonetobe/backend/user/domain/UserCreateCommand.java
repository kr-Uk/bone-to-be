package com.bonetobe.backend.user.domain;

import lombok.Builder;

public record UserCreateCommand(
        String email,
        String password,
        String passwordConfirm,
        String nickname,
        String authCode
) {
    @Builder
    public UserCreateCommand {
        if (!password.equals(passwordConfirm)) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }
    }
}