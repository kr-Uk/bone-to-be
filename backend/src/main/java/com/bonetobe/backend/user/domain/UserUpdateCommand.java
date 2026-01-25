package com.bonetobe.backend.user.domain;

import lombok.Builder;

@Builder
public record UserUpdateCommand(
        Long userId,
        String currentPassword,
        String newPassword,
        String newPasswordConfirm
) {
    public void validate() {
        if (!newPassword.equals(newPasswordConfirm)) {
            throw new IllegalArgumentException("새 비밀번호가 일치하지 않습니다.");
        }

        if (currentPassword.equals(newPassword)) {
            throw new IllegalArgumentException("현재 비밀번호와 새 비밀번호가 동일합니다.");
        }
    }
}
