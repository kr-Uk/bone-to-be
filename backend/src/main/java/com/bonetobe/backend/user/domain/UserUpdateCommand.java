package com.bonetobe.backend.user.domain;

import lombok.Builder;

@Builder
public record UserUpdateCommand(
        Long userId,
        String currentPassword,
        String newPassword,
        String newPasswordConfirm
) {
    public UserUpdateCommand {
        validatePasswords(currentPassword, newPassword, newPasswordConfirm);
    }

    private static void validatePasswords(String current, String next, String confirm) {
        if (next == null || next.isBlank()) {
            throw new IllegalArgumentException("새 비밀번호는 필수입니다.");
        }
        if (!next.equals(confirm)) {
            throw new IllegalArgumentException("새 비밀번호 확인이 일치하지 않습니다.");
        }
        if (next.equals(current)) {
            throw new IllegalArgumentException("새 비밀번호는 현재 비밀번호와 다르게 설정해야 합니다.");
        }
    }
}