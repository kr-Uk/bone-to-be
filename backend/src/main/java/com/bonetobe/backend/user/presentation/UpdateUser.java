package com.bonetobe.backend.user.presentation;

import com.bonetobe.backend.user.domain.UserCreateCommand;
import com.bonetobe.backend.user.domain.UserUpdateCommand;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;

public class UpdateUser {
    @Getter
    public static class PasswordRequest {
        @NotBlank(message = "현재 비밀번호를 입력해주세요.")
        private String currentPassword;

        @NotBlank(message = "새 비밀번호는 필수 입력 항목입니다.")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,20}$",
                message = "비밀번호는 8~20자의 영문 대/소문자, 숫자, 특수문자를 포함해야 합니다."
        )
        private String newPassword;

        @NotBlank(message = "비밀번호 확인을 입력해주세요.")
        private String newPasswordConfirm;

        public UserUpdateCommand toCommand(Long userId) {
            return UserUpdateCommand.builder()
                    .userId(userId)
                    .currentPassword(currentPassword)
                    .newPassword(newPassword)
                    .newPasswordConfirm(newPasswordConfirm)
                    .build();
        }
    }
}
